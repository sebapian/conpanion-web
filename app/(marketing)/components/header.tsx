'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/con-panion-logo.png"
            alt="Conpanion Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#solutions"
            className="text-gray-700 hover:text-yellow-500 transition-colors"
          >
            Solutions
          </Link>
          <Link
            href="#about"
            className="text-gray-700 hover:text-yellow-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="#pricing"
            className="text-gray-700 hover:text-yellow-500 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Login Button */}
        <div className="hidden md:block">
          <Button
            asChild
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <Link href="/sign-in">Log In</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="#solutions"
              className="text-gray-700 hover:text-yellow-500 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link
              href="#about"
              className="text-gray-700 hover:text-yellow-500 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#pricing"
              className="text-gray-700 hover:text-yellow-500 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Button
              asChild
              className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
            >
              <Link href="/sign-in">Log In</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 