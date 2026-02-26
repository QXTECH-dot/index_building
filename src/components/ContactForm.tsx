'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!form.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setState('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setState('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div
        className="p-8 bg-stone-50 rounded-card border border-stone-100 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">Message Sent</h3>
        <p className="text-stone-600 text-sm">Thank you for reaching out. We'll be in touch shortly.</p>
        <button
          onClick={() => setState('idle')}
          className="btn-secondary mt-6 text-sm px-5 py-2.5"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label="Contact form"
    >
      {state === 'error' && (
        <div
          className="p-4 bg-red-50 border border-red-100 rounded-card text-sm text-red-700"
          role="alert"
          aria-live="assertive"
        >
          Something went wrong. Please try again or call us directly.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" name="name" type="text" value={form.name} onChange={handleChange} error={errors.name} required placeholder="Your name" />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="your@email.com" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+61 4XX XXX XXX" />
        <Field label="Subject" name="subject" type="text" value={form.subject} onChange={handleChange} error={errors.subject} placeholder="Project type or enquiry" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
          Message <span className="text-stone-400" aria-label="required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          required
          placeholder="Tell us about your project..."
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
          className={[
            'w-full px-4 py-3 bg-white border rounded-card text-sm text-stone-900 placeholder-stone-400',
            'focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent',
            'transition-all duration-150 resize-none',
            errors.message ? 'border-red-400' : 'border-stone-200',
          ].join(' ')}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        aria-busy={state === 'submitting'}
      >
        {state === 'submitting' ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}

interface FieldProps {
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  placeholder?: string
}

function Field({ label, name, type, value, onChange, error, required, placeholder }: FieldProps) {
  const errorId = `${name}-error`
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}{required && <span className="text-stone-400 ml-0.5" aria-label="required">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={[
          'w-full px-4 py-3 bg-white border rounded-card text-sm text-stone-900 placeholder-stone-400',
          'focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent',
          'transition-all duration-150',
          error ? 'border-red-400' : 'border-stone-200',
        ].join(' ')}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
