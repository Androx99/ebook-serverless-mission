const API_URL = 'https://af380b8oof.execute-api.us-east-1.amazonaws.com/dev/contact';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.ebook-download-form');
  if (!form) return;
 
  form.addEventListener('submit', async (event) => {
    // Evitamos la recarga normal del formulario.
    event.preventDefault();
 
    // Leemos los valores del DOM.
    const name = document.getElementById('ebook-form-name').value.trim();
    const email = document.getElementById('ebook-email').value.trim();
    const payload = { name, email };
    console.log('Payload:', payload);
 
    try {
      // Mandamos los datos de dos formas a la vez para asegurar que la Lambda los lea
      // independientemente de cómo esté configurado el API Gateway.
      const requestPayload = {
        name: name,
        email: email,
        // Envolvemos también en "body" por si el Lambda lee event.body
        body: JSON.stringify({ name, email })
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });
 
      const rawResult = await response.json();
      
      // Desenvolvemos la respuesta (por si API Gateway nos devuelve la respuesta cruda de la Lambda)
      let finalResult = rawResult;
      let statusCode = response.status;

      if (rawResult && rawResult.body && typeof rawResult.body === 'string') {
          finalResult = JSON.parse(rawResult.body);
          statusCode = rawResult.statusCode || response.status;
      }

      if (statusCode !== 200) {
          throw new Error(finalResult.error ?? 'Error al enviar');
      }
 
      alert(finalResult.message || 'Solicitud completada correctamente');
      form.reset();
    } catch (error) {
      console.error('Error API:', error);
      alert(error.message);
    }
  });
});