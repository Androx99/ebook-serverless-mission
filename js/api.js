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
      // Enviamos JSON mediante POST.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
 
      const result = await response.json();
      // La Lambda devuelve el body como string JSON anidado dentro del wrapper proxy.
      const body = JSON.parse(result.body);
      if (result.statusCode !== 200) throw new Error(body.error ?? 'Error al enviar');
 
      alert(body.message);
      form.reset();
    } catch (error) {
      console.error('Error API:', error);
      alert(error.message);
    }
  });
});