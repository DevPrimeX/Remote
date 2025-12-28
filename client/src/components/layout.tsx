import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, User, Package, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
            INDUSTRIA<span className="text-primary">PACK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {!isAdmin ? (
            <>
              <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
              <Link href="/products" className="hover:text-primary transition-colors">PRODUCTS</Link>
              <Link href="/about" className="hover:text-primary transition-colors">ABOUT US</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">CONTACT</Link>
            </>
          ) : (
            <>
              <Link href="/admin/dashboard" className="text-primary">DASHBOARD</Link>
              <Link href="/" className="hover:text-primary transition-colors">VIEW SITE</Link>
            </>
          )}

          {user ? (
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l">
              <span className="text-muted-foreground">Hi, {user.username}</span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-4 shadow-lg animate-in slide-in-from-top-5">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 font-medium">HOME</Link>
          <Link href="/products" onClick={() => setIsOpen(false)} className="block py-2 font-medium">PRODUCTS</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="block py-2 font-medium">ABOUT US</Link>
          {user && (
            <div className="border-t pt-4 mt-2">
              <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="block py-2 font-medium text-primary">ADMIN DASHBOARD</Link>
              <Button variant="destructive" className="w-full mt-2" onClick={() => logout()}>Logout</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                INDUSTRIA<span className="text-primary">PACK</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Leading manufacturer of premium food packaging solutions. Quality you can trust, delivered with excellence.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary transition-colors">Our Products</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Containers" className="hover:text-primary transition-colors">Plastic Containers</Link></li>
              <li><Link href="/products?category=Trays" className="hover:text-primary transition-colors">Serving Trays</Link></li>
              <li><Link href="/products?category=Foils" className="hover:text-primary transition-colors">Aluminum Foils</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><Phone className="h-4 w-4 mr-2 text-primary" /> +91 98765 43210</li>
              <li className="mt-2">123 Industrial Area, Phase 1<br/>New Delhi, India 110020</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} IndustriaPack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
