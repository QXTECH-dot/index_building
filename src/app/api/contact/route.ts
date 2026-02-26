import { NextRequest, NextResponse } from 'next/server'

interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json()

    // Basic validation
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Log payload to console (dev/stub)
    console.log('[Contact Form Submission]', {
      timestamp: new Date().toISOString(),
      name: body.name,
      email: body.email,
      phone: body.phone || '(not provided)',
      subject: body.subject || '(not provided)',
      message: body.message,
    })

    return NextResponse.json(
      { success: true, message: 'Message received. We will be in touch shortly.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Contact API Error]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
