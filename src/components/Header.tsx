import Link from "next/link";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-gray-200 border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Radar Dev 🚀
        </Link>

        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <FaGithub size={24} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
    </header>
  );
}
