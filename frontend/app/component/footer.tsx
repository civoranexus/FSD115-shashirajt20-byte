// export default function Footer() {
//   return (
//     <footer className="bg-gray-900 text-white mt-10">
//       <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">

//         {/* Brand */}
//         <div>
//           <div className="flex items-center gap-2">
//             <img src="/logos/logo.svg" className="h-8" />
//             <span className="font-bold text-lg">Civora Livestock</span>
//           </div>
//           <p className="text-sm text-gray-400 mt-2">
//             Digital cattle marketplace powered by Civora Nexus.
//           </p>
//         </div>

//         {/* Links */}
//         <div>
//           <h3 className="font-semibold mb-2">Quick Links</h3>
//           <ul className="space-y-1 text-sm text-gray-400">
//             <li>Marketplace</li>
//             <li>Cart</li>
//             <li>Orders</li>
//           </ul>
//         </div>

//         {/* Social */}
//         <div>
//           <h3 className="font-semibold mb-2">Follow Civora</h3>
//           <div className="flex gap-4 text-sm text-gray-400">
//             <a href="https://www.linkedin.com/company/civoranexus/posts/?feedView=all" target="_blank">LinkedIn</a>
//             <a href="https://www.instagram.com" target="_blank">Instagram</a>
//             <a href="https://twitter.com" target="_blank">Twitter</a>
//             <a href="https://www.linkedin.com" target="_blank">github</a>
//             <a href="https://www.instagram.com" target="_blank">youtube</a>
//           </div>
//         </div>
//       </div>

//       <div className="text-center text-xs text-gray-500 pb-4">
//         © {new Date().getFullYear()} Civora Nexus. All rights reserved.
//       </div>
//     </footer>
//   );
// }
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <img src="/logos/logo.svg" className="h-8" />
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

          <div className="flex flex-col gap-2 text-sm text-gray-400">

            <a href="https://www.linkedin.com/company/civoranexus/posts/?feedView=all" target="_blank" className="flex items-center gap-2 hover:text-white">
              <img src="/icons/social/linkedin.png" className="h-4 w-4" />
              LinkedIn
            </a>

            <a href="https://www.instagram.com/civoranexus?igsh=Z240eXdjazA4NG9j" target="_blank" className="flex items-center gap-2 hover:text-white">
              <img src="/icons/social/instagram.png" className="h-4 w-4" />
              Instagram
            </a>

            <a href="https://youtube.com/@civoranexus?si=qENR5BOsj4PkgVzA" target="_blank" className="flex items-center gap-2 hover:text-white">
              <img src="/icons/social/youtube.png" className="h-4 w-4" />
              YouTube
            </a>

          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pb-4">
        © {new Date().getFullYear()} Civora Nexus. All rights reserved.
      </div>
    </footer>
  );
}