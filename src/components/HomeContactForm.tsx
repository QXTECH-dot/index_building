 'use client'
 
 import { useState } from 'react'
 
 type FormState = 'idle' | 'submitting' | 'success' | 'error'
 
 interface FormData {
   firstName: string
   lastName: string
   phone: string
   email: string
   subject: string
 }
 
 export function HomeContactForm() {
   const [state, setState] = useState<FormState>('idle')
   const [form, setForm] = useState<FormData>({
     firstName: '',
     lastName: '',
     phone: '',
     email: '',
     subject: '',
   })
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target
     setForm((prev) => ({ ...prev, [name]: value }))
   }
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     setState('submitting')
     try {
       const payload = {
         name: `${form.firstName} ${form.lastName}`.trim(),
         phone: form.phone,
         email: form.email,
         message: form.subject,
       }
       const res = await fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload),
       })
       setState(res.ok ? 'success' : 'error')
     } catch {
       setState('error')
     }
   }
 
   if (state === 'success') {
     return (
       <div className="p-6 rounded-card border border-stone-200/70 bg-white">
         <p className="text-sm text-stone-700">Thank you! We have received your submission.</p>
       </div>
     )
   }
 
   return (
     <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact us">
       {state === 'error' && (
         <div className="p-4 bg-red-50 border border-red-100 rounded-card text-sm text-red-700" role="alert">
           Error. Bad respond.
         </div>
       )}
 
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
         <input
           className="input"
           name="firstName"
           value={form.firstName}
           onChange={handleChange}
           placeholder="First name"
           type="text"
         />
         <input
           className="input"
           name="lastName"
           value={form.lastName}
           onChange={handleChange}
           placeholder="Last name"
           type="text"
         />
       </div>
 
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
         <input
           className="input"
           name="phone"
           value={form.phone}
           onChange={handleChange}
           placeholder="Phone"
           type="tel"
         />
         <input
           className="input"
           name="email"
           value={form.email}
           onChange={handleChange}
           placeholder="Email"
           type="email"
         />
       </div>
 
       <textarea
         className="textarea"
         name="subject"
         value={form.subject}
         onChange={handleChange}
         placeholder="Enter your subject"
         rows={5}
       />
 
       <button
         type="submit"
         className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
         disabled={state === 'submitting'}
         aria-busy={state === 'submitting'}
       >
         {state === 'submitting' ? 'Submitting…' : 'SUBMIT'}
       </button>
     </form>
   )
 }

