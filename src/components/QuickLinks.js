import { FiExternalLink } from "react-icons/fi";
import React from "react"

const quickLinks = [
  { name: "Commission Structure", href: "#" },
  { name: "EduAnchor Represented Universities", href: "#" },
  { name: "Contact List", href: "#" },
  { name: "Webinars by EduAnchor", href: "#" },
  { name: "Webinars by Institutions", href: "#" },
  { name: "Flywire Payments", href: "#" },
  { name: "Profile", href: "#" },
  { name: "Promotional Schemes", href: "#" },
];

export default function QuickLinks() {
  return (
    <div className="w-full mx-auto  py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Links</h2>
      <div className="space-y-4">
        {quickLinks.map((link, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition duration-200"
          >
            <a
              href={link.href}
              className="text-black hover:underline text-base sm:text-lg font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
            <FiExternalLink className="text-gray-400 text-xl sm:text-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
