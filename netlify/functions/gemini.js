exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Método no permitido. Use POST.' })
    };
  }

  // Validar que la API_KEY esté configurada
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEY no está configurada en las variables de entorno de Netlify');
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'API_KEY no configurada. Configura GEMINI_API_KEY en Netlify.' })
    };
  }

  try {
    // Agarramos lo que nos mandó el frontend
    const { prompt, systemInstruction } = JSON.parse(event.body);
    
    if (!prompt || !systemInstruction) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Faltan campos: prompt y systemInstruction' })
      };
    }

    console.log('📤 Enviando request a Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Error Gemini API (${response.status}):`, errorData);
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: `Error en Gemini API: ${response.statusText}` })
      };
    }

    const data = await response.json();
    console.log('✅ Response exitosa de Gemini');

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('🔴 Error en serverless function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error del servidor: ${error.message}` })
    };
  }
};