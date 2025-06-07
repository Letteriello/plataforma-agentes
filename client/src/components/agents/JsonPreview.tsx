import React from 'react';

interface JsonPreviewProps {
  data: any;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ marginBottom: '10px' }}>Configuração JSON em Tempo Real</h3>
      <pre style={{
        background: '#f4f4f4',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap', // Garante a quebra de linha
        wordWrap: 'break-word' // Garante que palavras longas não quebrem o layout
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default JsonPreview;
