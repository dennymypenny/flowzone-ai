import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FlowZone AI",
  description: "FlowZone AI privacy policy — how we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide mb-3">Legal</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Effective date: March 1, 2025 &nbsp;&middot;&nbsp; Last updated: March 22, 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
            <p>
              FlowZone AI (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a done-for-you AI automation
              agency operating at <a href="https://flowzone.dev" className="text-sky-600 hover:underline">flowzone.dev</a>.
              We build custom workflow automations for small and mid-size businesses using tools such as Make.com,
              Zapier, Airtable, and other no-code/low-code platforms. This Privacy Policy explains how we collect,
              use, disclose, and protect information when you visit our website or engage our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="mb-3"><strong>Information you provide directly:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name and email address when you submit our contact or intake form, or book a free AI Audit.</li>
              <li>Business name, website URL, and workflow details you share during onboarding or discovery calls.</li>
              <li>Payment information processed through our third-party payment processor (Stripe). We do not store your full card details.</li>
              <li>Any communications you send us by email or through our website.</li>
            </ul>
            <p className="mb-3"><strong>Information collected automatically:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address, browser type, device type, and operating system.</li>
              <li>Pages visited, time spent, referring URLs, and other usage analytics.</li>
              <li>Cookies and similar tracking technologies (see Section 6).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Deliver, manage, and improve our automation services.</li>
              <li>Respond to your inquiries, schedule consultations, and send project updates.</li>
              <li>Process payments and send invoices or receipts.</li>
              <li>Send you service-related communications and, with your consent, marketing emails.</li>
              <li>Analyze website usage to improve user experience and site performance.</li>
              <li>Comply with legal obligations and enforce our Terms of Service.</li>
            </ul>
            <p className="mt-4">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Information Sharing</h2>
            <p className="mb-3">We may share your information with trusted third parties solely to operate our business:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service providers:</strong> Stripe (payments), Google Workspace (email), Vercel (website hosting), Airtable, Make.com, Zapier, and similar platforms used to deliver your automation project.</li>
              <li><strong>Legal requirements:</strong> If required by law, court order, or government authority.</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the successor entity.</li>
            </ul>
            <p className="mt-4">All service providers are required to handle your data in accordance with applicable privacy laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes described in this
              policy, maintain business records, and comply with legal obligations. Project-related records are typically
              retained for up to 3 years after the conclusion of your engagement. You may request deletion at any time
              (see Section 8).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>
              Our website uses cookies and similar technologies to analyze traffic and improve your experience. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Essential cookies:</strong> Required for the website to function properly.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site (e.g., Vercel Analytics).</li>
            </ul>
            <p className="mt-4">
              You can control cookie settings through your browser. Disabling cookies may affect some website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Security</h2>
            <p>
              We implement industry-standard technical and organizational measures to protect your information against
              unauthorized access, loss, or disclosure. However, no method of transmission over the internet is 100%
              secure. We encourage you to use secure connections and avoid sharing sensitive credentials via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal information (&ldquo;right to be forgotten&rdquo;).</li>
              <li>Opt out of marketing communications at any time via the unsubscribe link in any email.</li>
              <li>Lodge a complaint with your local data protection authority.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:flowzoneautomation@gmail.com" className="text-sky-600 hover:underline">
                flowzoneautomation@gmail.com
              </a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children&rsquo;s Privacy</h2>
            <p>
              Our services are intended for business use by individuals 18 years of age or older. We do not
              knowingly collect personal information from children. If you believe a child has submitted information
              to us, please contact us and we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last updated&rdquo;
              date at the top of this page. We encourage you to review this page periodically. Continued use of our
              website or services after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 bg-sky-50 border border-sky-100 rounded-xl p-6">
              <p className="font-semibold text-gray-900">FlowZone AI</p>
              <p className="text-gray-600 mt-1">Email: <a href="mailto:flowzoneautomation@gmail.com" className="text-sky-600 hover:underline">flowzoneautomation@gmail.com</a></p>
              <p className="text-gray-600">Website: <a href="https://flowzone.dev" className="text-sky-600 hover:underline">flowzone.dev</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
