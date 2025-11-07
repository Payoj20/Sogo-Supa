"use client";

import Link from "next/link";
import { SiLinkedin } from "react-icons/si";
import { BsGithub } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-7 font-lato border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand section */}
          <div>
            <h2 className="text-2xl font-bold text-[#7F22FE] mb-4 font-montserrat">
              SogoSupa
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Discover premium collections and unbeatable offers. Your one-stop
              destination for style, comfort, accessories, gadgets and quality.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#7F22FE] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/payoj-mandpe-95a19524a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#7F22FE] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <SiLinkedin size={28} />
              </a>
              <a
                 href="https://github.com/Payoj20"
                 target="_blank"
                 rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#7F22FE] transition-colors duration-300"
                aria-label="GitHub"
              >
                <BsGithub size={28} />
              </a>
              <a
                href="mailto:payojmandpe20@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#7F22FE] transition-colors duration-300"
                aria-label="Email"
              >
                <MdEmail size={28} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-[#7F22FE] font-semibold">SogoSupa</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
