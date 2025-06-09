import { test, expect, Page } from '@playwright/test';

// Self-correction from prompt: Assuming no explicit login step for now.
// test.beforeEach(async ({ page }) => {
//   // Navigate to login page
//   await page.goto('/login'); // Adjust if your login path is different
//   // Fill in credentials
//   await page.getByLabel('Email').fill('testuser@example.com');
//   await page.getByLabel('Password').fill('password123');
//   // Submit
//   await page.getByRole('button', { name: 'Login' }).click();
//   // Wait for navigation to dashboard or main page
//   await expect(page).toHaveURL('/'); // Adjust to your post-login URL
// });

test.describe('Agent Creation E2E Flow', () => {
  const agentName = `My E2E LLM Agent ${Date.now()}`;

  test('should navigate to Agents page, create an LLM agent, and verify its creation', async ({ page }) => {
    // 1. Start from the main page (base URL)
    await page.goto('/');

    // Wait for the main page to be somewhat stable if there are async operations
    // Example: await page.waitForSelector('text=Dashboard', { timeout: 10000 }); // Or some other stable element

    // 2. Navigate to Agents Page
    // Try to find a link or button with text "Agents". This might need adjustment.
    // Common patterns: navigation menus, sidebars.
    // First, try a generic role link.
    let agentsLink = page.getByRole('link', { name: /agents/i });
    if (!await agentsLink.isVisible()) {
      // If not visible, try a button (might be in a collapsed menu)
      // This part is highly dependent on actual UI structure.
      // For example, if there's a menu button:
      // await page.getByRole('button', { name: /menu/i }).click();
      agentsLink = page.getByRole('link', { name: /agents/i }); // Try again after potential menu click
    }
    await agentsLink.click();

    await expect(page).toHaveURL(/.*\/agents/); // Check if URL contains /agents
    // Verify a key element on the agents page
    await expect(page.getByRole('button', { name: /create agent/i })).toBeVisible();

    // 3. Create New LLM Agent
    await page.getByRole('button', { name: /create agent/i }).click();

    // Agent creation might be a dialog or a new page.
    // Assuming it's a page/section with a form.
    // Wait for the form to be visible, e.g., by looking for a form title or a specific field.
    await expect(page.getByText('Agent Type', { exact: true })).toBeVisible({ timeout: 10000 });


    // Select "LLM Agent" type if not default or if a selection is explicitly required.
    // The AgentForm in the codebase defaults to LLM if not editing.
    // If AgentTypeSelector is present and needs interaction:
    const agentTypeSelector = page.getByRole('combobox'); // Assuming Radix UI select
    const currentAgentType = await agentTypeSelector.textContent();
    if (currentAgentType && !currentAgentType.includes('LLM')) { // Check if it's not already LLM
        await agentTypeSelector.click();
        await page.getByText('LLM Agent', { exact: true }).click(); // Or the display name 'LLM Agent'
    }

    // Fill in the agent form
    await page.getByLabel('Name').fill(agentName);
    await page.getByLabel('Description').fill('This is an LLM agent created via E2E test.');

    // LLMAgentForm specific fields
    // Assuming LLMAgentForm is rendered within AgentForm after type selection.
    // Wait for LLM specific field to ensure form is ready
    await expect(page.getByLabel('Instructions')).toBeVisible();
    await page.getByLabel('Instructions').fill('You are a helpful E2E test assistant.');

    // Select a model - assuming a select dropdown for model
    // The actual model field might be complex (e.g. Radix Select)
    const modelSelect = page.getByRole('combobox', { name: /model/i }); // Adjust if label is different
    await modelSelect.click();
    // Select the first available model option. This depends on the options.
    // Example: await page.getByRole('option', { name: /Gemini 1.5 Pro/i }).first().click();
    // For robustness, let's try to pick a specific one if the text is known.
    // The LLMAgentForm has 'Gemini 1.5 Pro' as a default option.
    await page.getByText('Gemini 1.5 Pro', { exact: false }).last().click(); // Use last if multiple elements with this text (e.g. the trigger and the option)

    // Submit the form
    await page.getByRole('button', { name: /create agent/i }).last().click(); // Use last if multiple "Create Agent" buttons (e.g. title and submit)

    // Verify success
    // This could be a toast message, redirection, or appearance of agent in a list.
    // Option 1: Toast message (Playwright can struggle with toasts if they disappear quickly)
    // await expect(page.getByText(/Agent ".*" has been created successfully./i)).toBeVisible({ timeout: 10000 });
    // Option 2: Redirection (more robust)
    // Expect to be on the agent's edit page or back to the list
    // Example: /agents/edit/agent-id or /agents
    await expect(page).toHaveURL(/.*\/agents(\/edit\/[a-zA-Z0-9-]+)?/, { timeout: 15000 });
    // Check for a success toast as well, if possible (might need to adjust selector)
    await expect(page.getByText(`Agent "${agentName}" has been created successfully.`)).toBeVisible({timeout: 10000});


    // 4. Verify Agent in List
    // Navigate back to the agents list page if necessary
    if (!page.url().endsWith('/agents') || page.url().includes('/edit/')) {
        // This assumes a global navigation structure.
        let agentsListLink = page.getByRole('link', { name: /agents/i });
         if (!await agentsListLink.isVisible()) {
            // Potentially open a menu first
            // await page.getByRole('button', { name: /menu/i }).click();
            agentsListLink = page.getByRole('link', { name: /agents/i });
        }
        await agentsListLink.click();
        await expect(page).toHaveURL(/.*\/agents/);
    }

    // Verify the new agent appears in the list
    // This depends on how agents are rendered (cards, table rows, etc.)
    await expect(page.getByText(agentName, { exact: true })).toBeVisible({ timeout: 10000 });

    // Optionally, click on the agent to see its details
    await page.getByText(agentName, { exact: true }).click();
    await expect(page).toHaveURL(/.*\/agents\/edit\/[a-zA-Z0-9-]+/); // Should navigate to edit page of the new agent

    // Verify some details on the edit page
    // Input fields are typically pre-filled, so check their values.
    await expect(page.getByLabel('Name')).toHaveValue(agentName);
    await expect(page.getByLabel('Description')).toHaveValue('This is an LLM agent created via E2E test.');
    await expect(page.getByLabel('Instructions')).toHaveValue('You are a helpful E2E test assistant.');
    // Add more assertions if needed
  });
});
