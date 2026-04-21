const Fastify = require('fastify')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const rateLimit = require('@fastify/rate-limit')
const { z } = require('zod')

dotenv.config()

const fastify = Fastify({ logger: true })

// ✅ SIN await (clave en cPanel)
fastify.register(rateLimit, {
  max: 5,
  timeWindow: '1 minute',
})

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
  const { nombre, email, mensaje, empresa, website } = request.body

  // Honeypot
  if (website) {
    return reply.status(400).send({ error: 'Spam Detectado' })
  }

  // Validación
  const schema = z.object({
    nombre: z.string().min(2),
    email: z.string().email(),
    mensaje: z.string().min(10),
    empresa: z.string().optional(),
  })

  const parsed = schema.safeParse(request.body)

  if (!parsed.success) {
    return reply.status(400).send({ error: 'Datos inválidos' })
  }

  const mensajeHTML = mensaje.replace(/\n/g, '<br>')

  try {
    await transporter.sendMail({
      from: `"Web Contacto" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      subject: 'Nuevo mensaje de contacto',
      html: `
        <div style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
            <tr>
              <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:8px;overflow:hidden;border:1px solid #1f1f1f;">

                  <tr>
                    <td style="
                      background-image:url('https://images.unsplash.com/photo-1557683316-973673baf926');
                      background-size:cover;
                      background-position:center;
                      height:160px;
                    ">
                      <table width="100%" height="160">
                        <tr>
                          <td align="center" valign="middle" style="background:rgba(0,0,0,0.6);">
                            <h1 style="color:#d4af37;margin:0;font-size:24px;letter-spacing:3px;">
                              EUGEDEV
                            </h1>
                            <p style="color:#ccc;font-size:12px;margin-top:8px;">
                              Nuevo contacto desde tu web
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:30px;">

                      <div style="background:#0d0d0d;padding:20px;border:1px solid #222;border-radius:6px;">

                        <p style="color:#d4af37;font-size:11px;text-transform:uppercase;">Nombre</p>
                        <p style="color:#fff;margin-bottom:15px;">${nombre}</p>

                        <p style="color:#d4af37;font-size:11px;text-transform:uppercase;">Email</p>
                        <p style="color:#fff;margin-bottom:15px;">${email}</p>

                        ${empresa ? `
                          <p style="color:#d4af37;font-size:11px;text-transform:uppercase;">Empresa</p>
                          <p style="color:#fff;margin-bottom:15px;">${empresa}</p>
                        ` : ''}

                        <p style="color:#d4af37;font-size:11px;text-transform:uppercase;">Mensaje</p>

                        <div style="
                          color:#ddd;
                          line-height:1.6;
                          background:#0a0a0a;
                          padding:15px;
                          border-left:3px solid #d4af37;
                        ">
                          ${mensajeHTML}
                        </div>

                      </div>

                      <div style="text-align:center;margin-top:25px;">
                        <a href="mailto:${email}" 
                          style="
                            display:inline-block;
                            padding:12px 24px;
                            background:#d4af37;
                            color:#000;
                            text-decoration:none;
                            font-weight:bold;
                            font-size:12px;
                            border-radius:4px;
                          ">
                          RESPONDER
                        </a>
                      </div>

                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px;text-align:center;border-top:1px solid #1f1f1f;">
                      <p style="color:#666;font-size:11px;">
                        eugedev.cl · Sistema de contacto
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </div>
      `
    })

    return { message: "Correo enviado de forma exitosa" }

  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({ error: 'Error enviando correo' })
  }
})

// ✅ EXPORT para cPanel
module.exports = fastify