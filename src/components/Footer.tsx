import Link from "next/link";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg text-white mb-2">SOBRE NÓS</h3>
            <p className="text-sm">
              Radar Dev é um site com notícias diárias sobre o mundo do
              desenvolvimento, IA, games e cultura geek, com artigos, opiniões e
              análises.
            </p>
          </div>

          <div />

          <div>
            <h3 className="font-bold text-lg text-white mb-2">
              SIGA O RADAR DEV
            </h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-white">
                <FaGithub size={24} />
              </a>
              <a href="#" className="hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="hover:text-white">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {currentYear} Radar Dev - Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
