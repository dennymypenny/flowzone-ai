import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-white font-bold text-xl mb-3">FlowZone AI</p>
            <p className="text-sm text-gray-500 leading-relaxed">Done-for-you AI workflow systems. Delivered in 7 days or less.</p>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Company</p>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-sm hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/intake" className="text-sm hover:text-white transition-colors">Get Free AI Audit</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Resources</p>
            <ul className="space-y-2">
              <li><Link href="/#how-it-works" className="text-sm hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/#faq" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/intake" className="text-sm hover:text-white transition-colors">Start a Project</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            <p className="text-sm mt-6">
              <a href="mailto:flowzoneautomation@gmail.com" className="hover:text-white transition-colors">flowzoneautomation@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2026 FlowZone AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
