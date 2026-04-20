import Fastify from 'fastify'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const fastify = Fastify({ logger: true })

// Configurar transporter SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Ruta POST
fastify.post('/contacto', async (request, reply) => {
  const { nombre, email, mensaje } = request.body

  if (!nombre || !email || !mensaje) {
    return reply.status(400).send({ error: 'Faltan campos' })
  }

  try {
    await transporter.sendMail({
      from: `"Web Contacto" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      subject: 'Nuevo mensaje de contacto',
      html: `
        <h3>Nuevo mensaje</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
      `,
    })

    return { ok: true }
  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({ error: 'Error enviando correo' })
  }
})

// Levantar servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Servidor corriendo en http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()