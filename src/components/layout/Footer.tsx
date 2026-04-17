import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <span className="font-serif text-lg font-semibold">Hikma</span>
                <span className="text-sm opacity-80 block -mt-1">Class Union</span>
              </div>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Connecting alumni, fostering excellence, and building a stronger community together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Committee', path: '/committee' },
                { name: 'Wings', path: '/wings' },
                { name: 'Students', path: '/students' },
                { name: 'Events', path: '/events' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="w-4 h-4" />
                <span>hikmaclassunion@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="w-4 h-4" />
                <span>+91 9746711804</span>
              </li>
              <li className="flex items-start gap-2 text-sm opacity-80">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Kozhikode Medical College Road<br />Virippadam Oorkadvu</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2">Newsletter</h5>
              <p className="text-xs opacity-80 mb-2">Subscribe for updates</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-sm placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-sm opacity-60">
          <p>© 2026 Hikma Class Union. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
