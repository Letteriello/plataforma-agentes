import vertexai
from vertexai.generative_models import GenerativeModel, Part, HarmCategory, HarmBlockThreshold, Content
from typing import List, Dict, Any, Optional

from app.models.agent import Agent as AgentConfig # Pydantic model for agent config
from app.schemas.chat_schemas import ChatMessageResponse # Pydantic model for chat messages
from app.config import settings # For GOOGLE_APPLICATION_CREDENTIALS, VERTEX_AI_PROJECT_ID, VERTEX_AI_LOCATION

# Basic logging
import logging
logger = logging.getLogger(__name__)

class LLMService:
    _initialized = False

    def __init__(self):
        if not LLMService._initialized:
            if not settings.VERTEX_AI_PROJECT_ID or not settings.VERTEX_AI_LOCATION:
                logger.error("VERTEX_AI_PROJECT_ID and VERTEX_AI_LOCATION must be set in config.")
                raise ValueError("VERTEX_AI_PROJECT_ID and VERTEX_AI_LOCATION must be set in config.")
            
            try:
                logger.info(f"Initializing Vertex AI with Project ID: {settings.VERTEX_AI_PROJECT_ID} and Location: {settings.VERTEX_AI_LOCATION}")
                vertexai.init(project=settings.VERTEX_AI_PROJECT_ID, location=settings.VERTEX_AI_LOCATION)
                LLMService._initialized = True
                logger.info("Vertex AI initialized successfully.")
            except Exception as e:
                logger.error(f"Error initializing Vertex AI: {e}", exc_info=True)
                raise RuntimeError(f"Could not initialize Vertex AI: {e}") from e

    def _format_history_for_gemini(self, history: List[ChatMessageResponse]) -> List[Content]:
        gemini_history: List[Content] = []
        for msg in history:
            role = "user" if msg.sender_type == "USER" else "model"
            # Ensure content is not None and is a string
            text_content = msg.content if msg.content is not None else ""
            gemini_history.append(Content(role=role, parts=[Part.from_text(text_content)]))
        return gemini_history

    async def generate_response(
        self,
        agent_config: AgentConfig,
        conversation_history: List[ChatMessageResponse],
        user_message_content: str
    ) -> str:
        if not LLMService._initialized:
            logger.error("LLMService not initialized. Call __init__ first.")
            # Attempt to initialize again, or raise a more specific error
            self.__init__() # This might be problematic if called in async context without care
            # A better approach might be a class method for initialization or ensuring it's a singleton that's init'd once.

        try:
            model = GenerativeModel(agent_config.model) 
            logger.debug(f"Using model: {agent_config.model}")

            system_instruction_part = None
            if agent_config.instruction:
                system_instruction_part = Part.from_text(agent_config.instruction)
                logger.debug(f"System instruction: {agent_config.instruction[:100]}...")

            formatted_history = self._format_history_for_gemini(conversation_history)
            
            contents_for_llm = formatted_history
            contents_for_llm.append(Content(role="user", parts=[Part.from_text(user_message_content)]))
            logger.debug(f"User message: {user_message_content}")
            logger.debug(f"Formatted history length: {len(formatted_history)}")

            generation_config_dict = {
                "temperature": agent_config.temperature,
                "max_output_tokens": agent_config.max_output_tokens,
                "top_p": agent_config.top_p,
                "top_k": agent_config.top_k,
            }
            logger.debug(f"Generation config: {generation_config_dict}")
            
            # TODO: Map safety_settings from agent_config.security_config
            # safety_settings = { HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH }

            response = await model.generate_content_async(
                contents_for_llm,
                generation_config=generation_config_dict,
                system_instruction=system_instruction_part, 
                # safety_settings=safety_settings,
                # tools=formatted_tools, # TODO: Map from agent_config.tools
            )
            logger.debug(f"LLM Raw Response: {response}")
            
            if response.candidates and response.candidates[0].content.parts and response.candidates[0].content.parts[0].text is not None:
                llm_text_response = response.candidates[0].content.parts[0].text
                logger.info(f"LLM generated response: {llm_text_response[:100]}...")
                return llm_text_response
            else:
                logger.warning(f"LLM response did not contain expected text part. Full response: {response}")
                return "Sorry, I could not generate a valid response text."
        except Exception as e:
            logger.error(f"Error during LLM call: {e}", exc_info=True)
            return f"Error communicating with LLM: An unexpected error occurred."
