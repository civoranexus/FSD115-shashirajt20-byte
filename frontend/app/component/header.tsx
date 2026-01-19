import React, { useState } from "react";

export default function Header({
  logoText = "Brand",
  navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  onSearch = (t) => console.log("search:", t),
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  return (
    <header className="w-full bg-white/80 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand + hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex md:hidden items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              aria-expanded={open}
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">{logoText[0]}</div>
              <span className="font-semibold text-lg tracking-tight text-gray-800">{logoText}</span>
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-600 hover:text-gray-900 transition">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Search + actions */}
          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(term);
              }}
              className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
              role="search"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="bg-transparent outline-none text-sm placeholder-gray-500 w-32 sm:w-48"
                placeholder="Search products..."
                aria-label="Search products"
              />
            </form>

            <a href="/cart" className="relative p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 11-.001-2.001A1 1 0 0110 21zm6 0a1 1 0 11-.001-2.001A1 1 0 0116 21z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5">3</span>
            </a>

            <div className="relative">
              <button className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100">
                <img src="https://i.pravatar.cc/40" alt="avatar" className="w-8 h-8 rounded-full" />
                <span className="hidden md:inline text-sm text-gray-700">Hi, User</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="py-2 px-2 rounded hover:bg-gray-50">
                {link.name}
              </a>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(term);
                setOpen(false);
              }}
              className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 mt-2"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="bg-transparent outline-none text-sm placeholder-gray-500 w-full"
                placeholder="Search products..."
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}


