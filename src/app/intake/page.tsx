'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const serviceMap: Record<string, { label: string; amount: number }> = {
  'Lead Intake & CRM Automation': { label: 'Lead Intake & CRM Automation', amount: 997 },
  'Appointment Booking & Reminders': { label: 'Appointment Booking & Reminders', amount: 797 },
  'AI Chatbot Agent for Your Website': { label: 'AI Chatbot Agent for Your Website', amount: 897 },
  'Customer Support Triage': { label: 'Customer Support Triage', amount: 1197 },
  'Automated Reporting & Dashboards': { label: 'Automated Reporting & Dashboards', amount: 1297 },
  'Invoice & Payment Workflows': { label: 'Invoice & Payment Workflows', amount: 897 },
  'Content Repurposing Automation': { label: 'Content Repurposing Automation', amount: 897 },
  'Email Nurture Sequences': { label: 'Email Nurture Sequences', amount: 797 },
  'Custom API & Tool Integrations': { label: 'Custom API & Tool Integrations', amount: 1097 },
  'Website or Portfolio': { label: 'Website or Portfolio', amount: 497 },
  'Something Else': { label: 'Something Else', amount: 497 },
};

function IntakeForm() {
  const searchParams = useSearchParams();
  const preSelected = searchParams.get('service') || '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [service, setService] = useState(preSelected);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedService = serviceMap[service];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, business, service, details }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    const venmoNote = selectedService ? selectedService.label : service || 'FlowZone Project';
    const venmoAmount = selectedService ? selectedService.amount : 497;
    const venmoUrl = 'https://venmo.com/u/flowzoneautomation?txn=pay&amount=' + venmoAmount + '&note=' + encodeURIComponent(venmoNote);
    return (
      <div className='text-center py-12'>
        <div className='text-5xl mb-4'>🎉</div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>You're all set!</h2>
        <p className='text-gray-600 mb-8'>We received your project details and will be in touch within 24 hours to confirm everything and get started.</p>
        {selectedService && (
          <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 inline-block'>
            <p className='text-blue-800 font-semibold'>{selectedService.label}</p>
            <p className='text-blue-600 text-2xl font-bold'>${selectedService.amount}</p>
          </div>
        )}
        <div>
          <a href={venmoUrl} target='_blank' rel='noopener noreferrer' className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors'>
            Pay with Venmo →
          </a>
          <p className='text-gray-400 text-xs mt-3'>Payment locks in your spot. Pre-fill only works in the Venmo mobile app.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
          <input required value={name} onChange={e => setName(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Your name' />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
          <input required type='email' value={email} onChange={e => setEmail(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='you@example.com' />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Business Name</label>
        <input value={business} onChange={e => setBusiness(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Your business name' />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Service *</label>
        <select required value={service} onChange={e => setService(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <option value=''>Select a service...</option>
          {Object.keys(serviceMap).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {selectedService && (
          <p className='text-blue-600 font-semibold text-sm mt-1'>${selectedService.amount} flat rate</p>
        )}
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Tell us about your project</label>
        <textarea value={details} onChange={e => setDetails(e.target.value)} rows={4} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='What do you need automated? Any tools you currently use?' />
      </div>
      <button type='submit' disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors'>
        {loading ? 'Submitting...' : 'Submit Project Request →'}
      </button>
    </form>
  );
}

export default function IntakePage() {
  return (
    <main className='min-h-screen bg-gray-50 py-16 px-4'>
      <div className='max-w-xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Start Your Project</h1>
          <p className='text-gray-600'>Fill out the form below and we will get back to you within 24 hours.</p>
        </div>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
          <Suspense fallback={<div>Loading...</div>}>
            <IntakeForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}