
import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Phone, Youtube, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-serpente-900 text-white/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png" 
                alt="Pet Serpentes" 
                className="h-12 w-auto mr-2 rounded-full" 
              />
              <span className="font-semibold text-xl text-white">PET SERPENTES</span>
            </Link>
            <p className="text-sm text-white/70 mb-4">
              Criadouro especializado em répteis e aves, devidamente registrado no IBAMA e INEA.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/petserpentes/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/@PETSerpentes" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Youtube">
                <Youtube size={20} />
              </a>
              <a href="https://wa.me/message/PQ7BIYW7H5ARK1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Links Rápidos</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/academy" className="hover:text-white transition-colors">P.S. Academy</Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors">Animais Disponíveis</Link>
              </li>
              <li>
                <Link to="/especies" className="hover:text-white transition-colors">Espécies Criadas</Link>
              </li>
              <li>
                <Link to="/manuais" className="hover:text-white transition-colors">Manuais de Criação</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">Quem Somos</Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-white transition-colors">Contato</Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
              </li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contato</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-serpente-400" />
                <a href="tel:+5521967802174" className="hover:text-white transition-colors">+55 21 96780-2174</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-serpente-400" />
                <a href="mailto:contato@petserpentes.com.br" className="hover:text-white transition-colors">contato@petserpentes.com.br</a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-serpente-400" />
                <span>Duque de Caxias, RJ - Brasil</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Newsletter</h3>
            <p className="text-sm text-white/70 mb-3">
              Receba novidades sobre disponibilidade de animais e dicas de cuidados
            </p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full px-3 py-2 text-sm rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-serpente-500"
                required
              />
              <Button type="submit" className="w-full bg-serpente-600 hover:bg-serpente-700 text-white">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-white/50 mb-4 sm:mb-0">
            © {new Date().getFullYear()} Pet Serpentes & Companhia. Todos os direitos reservados.
          </p>
          <div className="flex items-center">
            <img src="https://via.placeholder.com/40x20" alt="IBAMA" className="h-8 mx-1" />
            <img src="https://via.placeholder.com/40x20" alt="INEA" className="h-8 mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
