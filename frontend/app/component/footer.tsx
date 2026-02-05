export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <img src="/resources/logo.svg" className="h-8" />
            <span className="font-bold text-lg">Civora Livestock</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Digital cattle marketplace powered by Civora Nexus.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>Marketplace</li>
            <li>Cart</li>
            <li>Orders</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-2">Follow Civora</h3>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="https://www.linkedin.com" target="_blank">LinkedIn</a>
            <a href="https://www.instagram.com" target="_blank">Instagram</a>
            <a href="https://twitter.com" target="_blank">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pb-4">
        © {new Date().getFullYear()} Civora Nexus. All rights reserved.
      </div>
    </footer>
  );
}