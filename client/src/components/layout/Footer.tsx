import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logoPath from "@/assets/logo.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Link href="/" className="flex items-center">
                <img src={logoPath} alt="Servilink" className="h-10 bg-white p-1 rounded" />
              </Link>
            </div>
            <p className="mb-4">
              Conectando a personas que buscan servicios con los mejores profesionales de forma rápida y segura.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios?categoria=limpieza" className="hover:text-white">
                  Limpieza
                </Link>
              </li>
              <li>
                <Link href="/servicios?categoria=reparaciones" className="hover:text-white">
                  Reparaciones
                </Link>
              </li>
              <li>
                <Link href="/servicios?categoria=tecnologia" className="hover:text-white">
                  Tecnología
                </Link>
              </li>
              <li>
                <Link href="/servicios?categoria=fotografia" className="hover:text-white">
                  Fotografía
                </Link>
              </li>
              <li>
                <Link href="/servicios?categoria=educacion" className="hover:text-white">
                  Educación
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-white">
                  Ver todos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#como-funciona" className="hover:text-white">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/#planes" className="hover:text-white">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/#testimonios" className="hover:text-white">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="hover:text-white">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="hover:text-white">
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Servilink. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
