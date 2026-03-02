'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    // Match source-site behavior: fields are not marked required, but we still validate email if provided.
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }
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
        setForm({ name: '', email: '', phone: '', message: '' })
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
        className="p-8 bg-warm-50 rounded-card border border-warm-200 text-center"
        role="status"
        aria-live="polite"
      >
        <h3 className="font-sans font-semibold text-xl text-warm-900 mb-2">Message Sent</h3>
        <p className="text-warm-600 text-sm">Thank you for reaching out. We'll be in touch shortly.</p>
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
          className="p-4 bg-red-50 border border-red-100 rounded-card text-sm text-red-600"
          role="alert"
          aria-live="assertive"
        >
          Something went wrong. Please try again or call us directly.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" name="name" type="text" value={form.name} onChange={handleChange} error={errors.name} placeholder="Name" />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="Phone" />
      </div>

      <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="Email" />

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-warm-700 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Your message"
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
          className={[
            'textarea',
            errors.message ? 'border-red-400 focus:ring-red-200/60' : '',
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
          'Submit'
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
      <label htmlFor={name} className="block text-sm font-medium text-warm-700 mb-1.5">
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
          'input',
          error ? 'border-red-400 focus:ring-red-200/60' : '',
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
