import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 flex flex-col items-center justify-center p-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-0">
        <div>
          <h3 className="text-xl font-semibold mb-4">Sobre Nosotros</h3>
          <p className="text-sm">
            Bienvenido a <strong>UrbanGlow</strong>, tu destino ideal
            para servicios de belleza premium. Reserva citas fácilmente y
            disfruta de una experiencia de lujo al alcance de tu mano.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-gray-400">
                Inicio
              </a>
            </li>
            <li>
              <a href="/servicios" className="hover:text-gray-400">
                Servicios
              </a>
            </li>
            <li>
              <a href="/reservar" className="hover:text-gray-400">
                Reservar Cita
              </a>
            </li>
            <li>
              <a href="/nosotros" className="hover:text-gray-400">
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a href="/contacto" className="hover:text-gray-400">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Contáctanos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <i className="fas fa-phone-alt"></i> +56 9 1234 5678
            </li>
            <li>
              <i className="fas fa-envelope"></i> contacto@UrbanGlow.cl
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i> Calle Belleza 123,
              Santiago, Chile
            </li>
          </ul>
          <div className="mt-4 flex space-x-4">
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-200">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        &copy; 2025 UrbanGlow. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
