# 📧 API de Envío de Correos (SMTP con Fastify)

API backend simple para procesar formularios de contacto y enviar correos usando SMTP (por ejemplo, cPanel).

---

## 🚀 Tecnologías

- Node.js
- Fastify
- Nodemailer
- Dotenv

---

## 📁 Estructura del proyecto


backend/
├── server.js
├── package.json
├── .env
└── .gitignore


---

## ⚙️ Requisitos

- Node.js v18+ (recomendado usar nvm)
- Cuenta de correo SMTP (ej: cPanel)

---

## 🔧 Instalación

```bash
npm install
🔐 Variables de entorno

Crea un archivo .env en la raíz del proyecto:

SMTP_HOST=mail.tudominio.com
SMTP_PORT=465
SMTP_USER=contacto@tudominio.com
SMTP_PASS=tu_password
SMTP_TO=destino@tudominio.com

⚠️ Nunca subas este archivo a GitHub.

▶️ Ejecutar proyecto
Desarrollo
npm run dev
Producción
npm start

Servidor disponible en:

http://localhost:3000
📬 Endpoint
POST /contacto

Envía un correo con los datos del formulario.

📥 Body (JSON)
{
  "nombre": "Eugenio",
  "email": "correo@email.com",
  "mensaje": "Hola, este es un mensaje",
  "empresa": "Mi empresa (opcional)"
}
📤 Respuesta exitosa
{
  "ok": true
}
❌ Error
{
  "error": "Mensaje de error"
}
🔗 Integración con frontend (React / Vite)

Ejemplo básico usando fetch:

async function handleSubmit(e) {
  e.preventDefault()

  await fetch('http://localhost:3000/contacto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
}
⚠️ Consideraciones importantes
Validar inputs antes de enviar
No exponer credenciales SMTP
Usar HTTPS en producción
Implementar protección contra spam (rate limit o captcha)
🛠️ Scripts disponibles
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
📌 Mejoras recomendadas
Validación con Zod o Joi
Rate limiting (@fastify/rate-limit)
Logs estructurados
Plantillas HTML para correos
Deploy en VPS o servidor cloud
👨‍💻 Autor

Proyecto creado por Eugenio Escobar.