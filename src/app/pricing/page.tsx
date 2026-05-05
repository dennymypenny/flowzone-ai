'use client';

import Link from 'next/link';

const services = [
  { name: 'Lead Intake & CRM Automation', price: '$997', description: 'Capture, qualify, and follow up with leads automatically. Never let a prospect slip away.', features: ['Lead capture forms', 'CRM integration', 'Automated follow-up emails', 'Lead scoring', 'Pipeline tracking'], icon: '🎯' },
  { name: 'Appointment Booking & Reminders', price: '$797', description: 'Automate your entire booking flow with confirmations, reminders, and follow-ups that run on autopilot.', features: ['Online booking integration', 'SMS & email reminders', 'No-show reduction', 'Calendar sync', 'Rescheduling automation'], icon: '📅' },
  { name: 'AI Chatbot Agent for Your Website', price: '$897', description: 'A custom AI chatbot trained on your business, embedded on your site to handle FAQs, qualify leads, and capture contact info 24/7.', features: ['Custom AI training', 'Lead qualification', 'FAQ automation', '24/7 availability', 'CRM handoff', 'Mobile responsive'], icon: '🤖' },
  { name: 'Customer Support Triage', price: '$1,197', description: 'Automatically sort, prioritize, and respond to customer inquiries so your team focuses on what matters.', features: ['Email triage automation', 'Auto-responses', 'Priority routing', 'Support ticketing', 'Response templates'], icon: '🎧' },
  { name: 'Automated Reporting & Dashboards', price: '$1,297', description: 'Get real-time visibility into your business with automated reports delivered straight to your inbox.', features: ['Custom dashboards', 'Scheduled email reports', 'KPI tracking', 'Multi-source data', 'Visual analytics'], icon: '📊' },
  { name: 'Invoice & Payment Workflows', price: '$897', description: 'Automate your entire billing cycle from invoice generation to payment reminders and reconciliation.', features: ['Auto invoice generation', 'Payment reminders', 'Stripe integration', 'Overdue follow-ups', 'Payment tracking'], icon: '💳' },
  { name: 'Content Repurposing Automation', price: '$897', description: 'Turn one piece of content into many. Automatically repurpose blogs, videos, and podcasts across channels.', features: ['Blog to social posts', 'Video transcription', 'Email newsletters', 'Multi-platform posting', 'Content calendar'], icon: '♻️' },
  { name: 'Email Nurture Sequences', price: '$797', description: 'Build automated email sequences that warm up leads and convert them into paying customers.', features: ['Drip campaigns', 'Behavioral triggers', 'A/B testing', 'Segmentation', 'Performance tracking'], icon: '📧' },
  { name: 'Custom API & Tool Integrations', price: '$1,097', description: 'Connect any two tools in your stack. We build the custom bridges that make your software actually work together.', features: ['Zapier alternatives', 'Custom webhooks', 'REST API integrations', 'Data sync', 'Error monitoring'], icon: '🔌' },
  { name: 'Website or Portfolio', price: '$497', description: 'A fast, clean, professional website built in Next.js and deployed on Vercel. Ready in 7 days.', features: ['Next.js + Tailwind', 'Mobile responsive', 'SEO optimized', 'Custom domain', 'Vercel hosting'], icon: '🌐' },
  { name: 'Something Else', price: '$497+', description: 'Have a custom project in mind? Describe what you need and we will scope it out and build it.', features: ['Custom scoping', 'Flexible pricing', 'Any tech stack', 'Full ownership', 'Ongoing support available'], icon: '✨' },
];

export default function PricingPage() {
  return (
    <main className='min-h-screen bg-gray-50 py-16 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-14'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Simple, Flat-Rate Pricing</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Every automation is scoped, built, and delivered in 7 days or less. No retainers, no surprises.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {services.map((service) => (
            <div key={service.name} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow'>
              <div className='text-3xl mb-3'>{service.icon}</div>
              <h2 className='text-lg font-bold text-gray-900 mb-1'>{service.name}</h2>
              <p className='text-blue-600 font-bold text-2xl mb-3'>{service.price}</p>
              <p className='text-gray-600 text-sm mb-4 flex-grow'>{service.description}</p>
              <ul className='space-y-1 mb-6'>
                {service.features.map((f) => (
                  <li key={f} className='flex items-center gap-2 text-sm text-gray-700'>
                    <span className='text-blue-500'>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={'/intake?' + 'service=' + encodeURIComponent(service.name)} className='block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors'>
                Start This Project →
              </Link>
            </div>
          ))}
        </div>
        <div className='text-center mt-14 text-gray-500 text-sm'>All projects include a free scoping call, full code ownership, and delivery in 7 days or less.</div>
      </div>
    </main>
  );
}