import Link from "next/link";
import { PawPrint, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#ADD8E6] text-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2">
              <PawPrint size={34} className="text-sky-700" />

              <div>
                <h2 className="text-2xl font-bold text-sky-900">
                  PawMed
                </h2>
                <p className="text-sm text-sky-700">
                  Pet Hospital
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6">
              PawMed is a trusted veterinary hospital dedicated to
              providing compassionate care, expert treatment, and
              wellness services for your beloved pets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-sky-700">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/doctors" className="hover:text-sky-700">
                  Doctors
                </Link>
              </li>

              <li>
                <Link href="/services" className="hover:text-sky-700">
                  Services
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-sky-700">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Our Services
            </h3>

            <ul className="space-y-2">
              <li>General Checkup</li>
              <li>Vaccination</li>
              <li>Pet Surgery</li>
              <li>Emergency Care</li>
              <li>Dental Care</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Contact Us
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>+880 1308-767900</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>support@pawmed.com</span>
              </div>

              <div className="mt-5 flex gap-4">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="rounded-full bg-white p-2 shadow transition hover:bg-sky-700 hover:text-white"
                >
                  <FaFacebookF size={18} />
                </Link>

                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="rounded-full bg-white p-2 shadow transition hover:bg-pink-500 hover:text-white"
                >
                  <FaInstagram size={18} />
                </Link>

                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="rounded-full bg-white p-2 shadow transition hover:bg-blue-700 hover:text-white"
                >
                  <FaLinkedinIn size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-sky-300 pt-6 text-center text-sm">
          © {new Date().getFullYear()} PawMed. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;