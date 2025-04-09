import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Share2, LogOut, User, Heart, Plus, Settings } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className={`sticky top-0 z-30 w-full transition-shadow duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600 font-poppins">Servilink</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium ${location === '/' ? 'text-blue-600' : ''}`}>Inicio</Link>
            <Link href="/servicios" className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium ${location === '/servicios' ? 'text-blue-600' : ''}`}>Servicios</Link>
            <Link href="/#como-funciona" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Cómo funciona</Link>
            <Link href="/#planes" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Planes</Link>
          </nav>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-9 w-9 p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.nombreCompleto || 'Usuario'} />
                      <AvatarFallback>{user.nombreCompleto ? user.nombreCompleto.substring(0, 2).toUpperCase() : 'US'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.nombreCompleto}</span>
                      <span className="text-xs font-normal text-gray-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="flex cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil?tab=favoritos" className="flex cursor-pointer items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favoritos</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.rol === "Proveedor" && (
                    <DropdownMenuItem asChild>
                      <Link href="/agregar-servicio" className="flex cursor-pointer items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Publicar Servicio</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.rol === "Admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex cursor-pointer items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Panel de Administración</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost">Ingresar</Button>
                </Link>
                <Link href="/auth">
                  <Button>Registrarse</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Inicio</Link>
            <Link href="/servicios" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Servicios</Link>
            <Link href="/#como-funciona" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Cómo funciona</Link>
            <Link href="/#planes" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Planes</Link>
            
            {user ? (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link href="/perfil" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Mi Perfil</Link>
                <Link href="/perfil?tab=favoritos" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Favoritos</Link>
                {user.rol === "Proveedor" && (
                  <Link href="/agregar-servicio" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Publicar Servicio</Link>
                )}
                {user.rol === "Admin" && (
                  <Link href="/admin" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">Panel de Administración</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-2 flex space-x-2 px-3">
                <Link href="/auth" className="block w-1/2 text-center px-3 py-2 text-base font-medium text-gray-700 bg-gray-100 rounded-lg">Ingresar</Link>
                <Link href="/auth" className="block w-1/2 text-center px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-lg">Registrarse</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
