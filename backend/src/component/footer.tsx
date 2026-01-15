// File: components/Footer.jsx
import React from "react";
export default function Footer({
  columns = [
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", href: "/terms" },
        { name: "Privacy", href: "/privacy" },
      ],
    },
  ],
}) {
  return (
    <footer className="bg-gray-50 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <a href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">B</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Brand</h3>
                <p className="text-sm text-gray-600">Modern marketplace for quality products.</p>
              </div>
            </a>

            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="email" className="sr-only">Subscribe</label>
              <input id="email" type="email" placeholder="Your email" className="flex-1 bg-white border rounded-full px-4 py-2 text-sm outline-none shadow-sm" />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-95">Subscribe</button>
            </form>

            <div className="flex gap-3 mt-4">
              <a aria-label="twitter" href="#" className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 5.92c-.6.27-1.24.45-1.92.53a3.3 3.3 0 001.45-1.82c-.64.38-1.35.66-2.11.81A3.28 3.28 0 0015.5 4c-1.82 0-3.3 1.48-3.3 3.3 0 .26.03.51.08.75-2.75-.14-5.19-1.46-6.83-3.47a3.28 3.28 0 00-.45 1.66c0 1.15.58 2.16 1.46 2.76-.54-.02-1.04-.17-1.48-.41v.04c0 1.6 1.14 2.94 2.65 3.24-.46.12-.95.19-1.45.19-.36 0-.71-.03-1.05-.1.71 2.21 2.78 3.82 5.23 3.87A6.58 6.58 0 012 19.54 9.28 9.28 0 007.3 21c5.55 0 8.58-4.6 8.58-8.58 0-.13 0-.26-.01-.39.59-.42 1.1-.95 1.5-1.55z" />
                </svg>
              </a>
              <a aria-label="facebook" href="#" className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.92v-7.02H8.1v-2.9h2.2V9.2c0-2.17 1.3-3.36 3.28-3.36.95 0 1.95.17 1.95.17v2.14h-1.1c-1.08 0-1.42.67-1.42 1.36v1.64h2.42l-.39 2.9h-2.03V22c4.78-.79 8.44-4.93 8.44-9.93z" />
                </svg>
              </a>
              <a aria-label="instagram" href="#" className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 6a4 4 0 110 8 4 4 0 010-8zm6.5-4a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-medium text-gray-900 mb-3">{col.title}</h4>
                <ul className="space-y-2 text-sm">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <a href={l.href} className="text-gray-600 hover:text-gray-900">
                        {l.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-gray-700">Privacy</a>
            <a href="/terms" className="hover:text-gray-700">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
