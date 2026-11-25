import { useState, useId, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { CONTACT_FILL_EVENT } from '../../agent/webmcp'
import styles from './ContactForm.module.css'

const validate = (vals) => {
  const errs = {}

  if (!vals.name.trim()) {
    errs.name = 'Please enter your name.'
  } else if (vals.name.trim().length < 2) {
    errs.name = 'Name must be at least 2 characters.'
  }

  if (!vals.email.trim()) {
    errs.email = 'Please enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim())) {
    errs.email = 'Please enter a valid email address (e.g. alex@company.com).'
  }

  if (!vals.message.trim()) {
    errs.message = 'Please enter a message describing your project or role.'
  } else if (vals.message.trim().length < 10) {
    errs.message = 'Message must be at least 10 characters so I have enough context.'
  }

  return errs
}

const ContactForm = ({ initialInquiryType = 'freelance' }) => {
  const formId = useId()
  const [values, setValues] = useState({
    name: '',
    email: '',
    inquiryType: initialInquiryType,
    subject: '',
    message: '',
    website: '' // Honeypot spam trap
  })

  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'
  const [serverMessage, setServerMessage] = useState('')
  const [submittedSnapshot, setSubmittedSnapshot] = useState(null)
  const [copiedFallback, setCopiedFallback] = useState(false)
  const formRef = useRef(null)

  // Update inquiry type if parent tabs change and form is still untouched
  useEffect(() => {
    if (Object.keys(touched).length === 0) {
      setValues((prev) => ({ ...prev, inquiryType: initialInquiryType }))
    }
  }, [initialInquiryType, touched])

  const submitFormValues = useCallback(
    async (vals) => {
      if (status === 'submitting') return

      const validationErrors = validate(vals)
      setErrors(validationErrors)
      setTouched({ name: true, email: true, message: true })

      if (Object.keys(validationErrors).length > 0) {
        const firstField = Object.keys(validationErrors)[0]
        const el = document.getElementById(`${formId}-${firstField}`)
        if (el) el.focus()
        return
      }

      if (vals.website) {
        setStatus('success')
        setServerMessage('Thank you for reaching out!')
        return
      }

      setStatus('submitting')
      setServerMessage('')

      const endpoint = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name: vals.name.trim(),
            email: vals.email.trim(),
            inquiryType: vals.inquiryType,
            subject: vals.subject.trim(),
            message: vals.message.trim(),
            timestamp: new Date().toISOString()
          })
        })

        const data = await response.json().catch(() => ({}))

        if (response.ok && data.ok !== false) {
          setSubmittedSnapshot({
            name: vals.name.trim(),
            email: vals.email.trim(),
            inquiryType: vals.inquiryType,
            subject: vals.subject.trim(),
            message: vals.message.trim()
          })
          setStatus('success')
          setServerMessage(
            data.message ||
              'Your message has been received! Pardeep will review it and follow up within 24 hours.'
          )
          setValues({
            name: '',
            email: '',
            inquiryType: vals.inquiryType,
            subject: '',
            message: '',
            website: ''
          })
          setTouched({})
          setErrors({})
        } else {
          setStatus('error')
          setServerMessage(
            data.error ||
              `Submission failed (status ${response.status}). Please try again or use direct email.`
          )
        }
      } catch {
        setStatus('error')
        setServerMessage(
          'Unable to connect to the submission server. You can retry or send directly via email below.'
        )
      }
    },
    [formId, status]
  )

  // Listen for WebMCP / agent prefill & submit events
  useEffect(() => {
    const handleAgentFill = (event) => {
      const detail = event.detail || {}
      const nextValues = {
        name: detail.name ?? '',
        email: detail.email ?? '',
        inquiryType: detail.inquiryType || initialInquiryType,
        subject: detail.subject ?? '',
        message: detail.message ?? '',
        website: ''
      }
      setStatus('idle')
      setValues(nextValues)
      setTouched({ name: true, email: true, message: true })
      setErrors(validate(nextValues))

      if (detail.submit) {
        submitFormValues(nextValues)
      }
    }

    window.addEventListener(CONTACT_FILL_EVENT, handleAgentFill)
    return () => window.removeEventListener(CONTACT_FILL_EVENT, handleAgentFill)
  }, [initialInquiryType, submitFormValues])

  const handleInquiryChange = (type) => {
    setValues((prev) => ({ ...prev, inquiryType: type }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const fieldErrors = validate({ ...values, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldErrors = validate(values)
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submitFormValues(values)
  }

  const handleResetForm = () => {
    setStatus('idle')
    setServerMessage('')
    setSubmittedSnapshot(null)
  }

  const getMailtoUrl = (draft) => {
    const data = draft || values
    const subjectLine =
      data.subject?.trim() ||
      `Portfolio Inquiry from ${data.name?.trim() || 'Visitor'} [${data.inquiryType}]`
    const bodyText = `Hi Pardeep,\n\n${data.message?.trim() || ''}\n\n---\nName: ${
      data.name?.trim() || 'Visitor'
    }\nEmail: ${data.email?.trim() || 'Not specified'}\nType: ${data.inquiryType}`

    return `mailto:pardeepshyoran@outlook.com?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(bodyText)}`
  }

  const handleCopyDraft = async () => {
    const data = submittedSnapshot || values
    const draftText = `Subject: ${data.subject || 'Portfolio Inquiry'}
From: ${data.name} (${data.email})
Inquiry Type: ${data.inquiryType}

${data.message}`

    try {
      await navigator.clipboard.writeText(draftText)
      setCopiedFallback(true)
      setTimeout(() => setCopiedFallback(false), 3000)
    } catch (err) {
      console.error('Failed to copy to clipboard', err)
    }
  }

  return (
    <div className={styles.formContainer}>
      {/* Success View */}
      {status === 'success' && (
        <div
          className={styles.statusCardSuccess}
          role="status"
          aria-live="polite"
        >
          <div className={styles.statusIconWrapSuccess}>
            <svg
              className={styles.statusIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className={styles.statusHeading}>Message Sent Successfully!</h3>
          <p className={styles.statusBody}>
            {serverMessage ||
              'Thank you for reaching out. Your message has been safely delivered.'}
          </p>
          {submittedSnapshot && (
            <dl className={styles.receiptBox}>
              <div className={styles.receiptRow}>
                <dt className={styles.receiptLabel}>Sender</dt>
                <dd className={styles.receiptValue}>{submittedSnapshot.name}</dd>
              </div>
              <div className={styles.receiptRow}>
                <dt className={styles.receiptLabel}>Reply-to</dt>
                <dd className={styles.receiptValue}>{submittedSnapshot.email}</dd>
              </div>
              <div className={styles.receiptRow}>
                <dt className={styles.receiptLabel}>Category</dt>
                <dd className={styles.receiptValue}>{submittedSnapshot.inquiryType}</dd>
              </div>
            </dl>
          )}
          <div className={styles.statusActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleResetForm}
            >
              Send Another Message
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Form */}
      {status !== 'success' && (
        <form
          ref={formRef}
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Contact form for employment and freelance inquiries"
          toolname="send_contact_inquiry"
          tooldescription="Send a direct employment, freelance, or technical advisory inquiry to Pardeep Shyoran."
        >
          {/* Failure Alert Banner */}
          {status === 'error' && (
            <div
              className={styles.statusCardError}
              role="alert"
              aria-live="assertive"
            >
              <div className={styles.errorHeader}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className={styles.errorTextWrap}>
                  <strong className={styles.errorTitle}>Submission Issue</strong>
                  <p className={styles.errorMessage}>{serverMessage}</p>
                </div>
              </div>
              <div className={styles.errorActions}>
                <a
                  href={getMailtoUrl()}
                  className={styles.btnFallbackMail}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className={styles.btnIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>Open in Email Client</span>
                </a>
                <button
                  type="button"
                  className={styles.btnFallbackCopy}
                  onClick={handleCopyDraft}
                  aria-label="Copy message text to clipboard"
                >
                  {copiedFallback ? 'Copied to Clipboard!' : 'Copy Message Text'}
                </button>
              </div>
            </div>
          )}

          {/* Inquiry Type Segmented Selector */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} id={`${formId}-inquiry-label`}>
              What brings you here?
            </label>
            <div
              className={styles.inquiryGrid}
              role="radiogroup"
              aria-labelledby={`${formId}-inquiry-label`}
            >
              {[
                { id: 'freelance', label: 'Freelance / Project' },
                { id: 'employment', label: 'Full-Time Role' },
                { id: 'consulting', label: 'Tech Advisory' },
                { id: 'general', label: 'Other / Say Hi' }
              ].map((item) => {
                const checked = values.inquiryType === item.id
                return (
                  <label
                    key={item.id}
                    className={`${styles.inquiryOption} ${
                      checked ? styles.inquiryOptionActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="inquiryType"
                      value={item.id}
                      checked={checked}
                      onChange={() => handleInquiryChange(item.id)}
                      className={styles.inquiryNativeRadio}
                    />
                    <span className={styles.inquiryRadioDot} aria-hidden="true" />
                    <span>{item.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Name & Email Row */}
          <div className={styles.row}>
            {/* Name Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor={`${formId}-name`} className={styles.fieldLabel}>
                Your Name <span className={styles.requiredMark}>*</span>
              </label>
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={touched.name && Boolean(errors.name)}
                aria-describedby={
                  touched.name && errors.name ? `${formId}-name-error` : undefined
                }
                placeholder="e.g. Alex Morgan"
                className={`${styles.input} ${
                  touched.name && errors.name ? styles.inputError : ''
                }`}
                disabled={status === 'submitting'}
              />
              {touched.name && errors.name && (
                <p
                  id={`${formId}-name-error`}
                  className={styles.fieldError}
                  role="alert"
                >
                  <svg
                    className={styles.inlineErrorIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor={`${formId}-email`} className={styles.fieldLabel}>
                Email Address <span className={styles.requiredMark}>*</span>
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={touched.email && Boolean(errors.email)}
                aria-describedby={
                  touched.email && errors.email ? `${formId}-email-error` : undefined
                }
                placeholder="name@company.com"
                className={`${styles.input} ${
                  touched.email && errors.email ? styles.inputError : ''
                }`}
                disabled={status === 'submitting'}
              />
              {touched.email && errors.email && (
                <p
                  id={`${formId}-email-error`}
                  className={styles.fieldError}
                  role="alert"
                >
                  <svg
                    className={styles.inlineErrorIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Subject Field (Optional) */}
          <div className={styles.fieldGroup}>
            <label htmlFor={`${formId}-subject`} className={styles.fieldLabel}>
              Subject <span className={styles.optionalMark}>(Optional)</span>
            </label>
            <input
              id={`${formId}-subject`}
              name="subject"
              type="text"
              value={values.subject}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer role or Next.js MVP build"
              className={styles.input}
              disabled={status === 'submitting'}
            />
          </div>

          {/* Message Field */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor={`${formId}-message`} className={styles.fieldLabel}>
                Project or Opportunity Details <span className={styles.requiredMark}>*</span>
              </label>
              <span className={styles.charCount}>
                {values.message.length > 0 ? `${values.message.length} chars` : 'Min 10 chars'}
              </span>
            </div>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={5}
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={touched.message && Boolean(errors.message)}
              aria-describedby={
                touched.message && errors.message ? `${formId}-message-error` : undefined
              }
              placeholder="Tell me about what you are building, timeline expectations, stack preferences, or team requirements..."
              className={`${styles.textarea} ${
                touched.message && errors.message ? styles.inputError : ''
              }`}
              disabled={status === 'submitting'}
            />
            {touched.message && errors.message && (
              <p
                id={`${formId}-message-error`}
                className={styles.fieldError}
                role="alert"
              >
                <svg
                  className={styles.inlineErrorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Hidden Bot Honeypot */}
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor={`${formId}-website`}>Website</label>
            <input
              id={`${formId}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          {/* Form Footer & Primary Action */}
          <div className={styles.formFooter}>
            <p className={styles.privacyNote}>
              🔒 Privacy-first: No tracking. Information is used solely to respond to your inquiry.
            </p>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'submitting'}
              aria-busy={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg
                    className={styles.submitArrow}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

ContactForm.propTypes = {
  initialInquiryType: PropTypes.string
}

export default ContactForm
