/* global process, Buffer */

const DEFAULT_RECIPIENT = 'pardeepshyoran@outlook.com'
const ALLOWED_INQUIRY_TYPES = new Set(['freelance', 'employment', 'consulting', 'general'])

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body || '{}')
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  return JSON.parse(raw || '{}')
}

function validateContactPayload(data) {
  const fieldErrors = {}
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  const email = typeof data.email === 'string' ? data.email.trim() : ''
  const subject = typeof data.subject === 'string' ? data.subject.trim() : ''
  const message = typeof data.message === 'string' ? data.message.trim() : ''
  const inquiryType = ALLOWED_INQUIRY_TYPES.has(data.inquiryType)
    ? data.inquiryType
    : 'general'

  if (name.length < 2) {
    fieldErrors.name = 'Name must be at least 2 characters.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Please provide a valid email address.'
  }
  if (message.length < 10) {
    fieldErrors.message = 'Message must be at least 10 characters.'
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    cleaned: { name, email, inquiryType, subject, message },
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Allow', 'POST, OPTIONS')
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    sendJson(res, 405, { ok: false, error: 'Method not allowed. Use POST.' })
    return
  }

  let data
  try {
    data = await readJsonBody(req)
  } catch {
    sendJson(res, 400, { ok: false, error: 'Invalid JSON payload received.' })
    return
  }

  if (data?.website) {
    sendJson(res, 400, { ok: false, error: 'Spam detected.' })
    return
  }

  const { valid, fieldErrors, cleaned } = validateContactPayload(data || {})
  if (!valid) {
    sendJson(res, 400, {
      ok: false,
      error: Object.values(fieldErrors)[0] || 'Invalid contact inquiry fields.',
      fieldErrors,
    })
    return
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL
  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_RECIPIENT
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

  if (resendApiKey) {
    try {
      const upstream = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: cleaned.email,
          subject:
            cleaned.subject ||
            `Portfolio Inquiry (${cleaned.inquiryType}) from ${cleaned.name}`,
          text: [
            `Name: ${cleaned.name}`,
            `Email: ${cleaned.email}`,
            `Inquiry Type: ${cleaned.inquiryType}`,
            cleaned.subject ? `Subject: ${cleaned.subject}` : null,
            '',
            cleaned.message,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      })

      if (!upstream.ok) {
        const detail = await upstream.text().catch(() => '')
        sendJson(res, 502, {
          ok: false,
          fallback: 'mailto',
          error: `Email delivery provider failed (${upstream.status}). Please use the email client fallback.`,
          detail: detail.slice(0, 200),
        })
        return
      }

      sendJson(res, 200, {
        ok: true,
        message:
          'Your message has been delivered! Pardeep will review it and follow up within 24 hours.',
      })
      return
    } catch {
      sendJson(res, 502, {
        ok: false,
        fallback: 'mailto',
        error: 'Unable to reach email delivery provider. Please use the email client fallback.',
      })
      return
    }
  }

  if (webhookUrl) {
    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleaned,
          receivedAt: new Date().toISOString(),
        }),
      })

      if (!upstream.ok) {
        sendJson(res, 502, {
          ok: false,
          fallback: 'mailto',
          error: `Webhook delivery failed (${upstream.status}). Please use the email client fallback.`,
        })
        return
      }

      sendJson(res, 200, {
        ok: true,
        message:
          'Your message has been delivered! Pardeep will review it and follow up within 24 hours.',
      })
      return
    } catch {
      sendJson(res, 502, {
        ok: false,
        fallback: 'mailto',
        error: 'Unable to reach webhook delivery endpoint. Please use the email client fallback.',
      })
      return
    }
  }

  sendJson(res, 503, {
    ok: false,
    code: 'DELIVERY_NOT_CONFIGURED',
    fallback: 'mailto',
    error:
      'Direct server delivery is not configured for this deployment. Please use "Open in Email Client" or "Copy Message Text" below.',
  })
}
