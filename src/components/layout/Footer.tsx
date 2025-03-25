
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                QuoteNinja
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              Transform your washroom projects with precise estimates and professional solutions. Our calculator provides instant, accurate quotes for your custom washroom needs.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-muted-foreground hover:text-primary transition-colors">
                  Calculator
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground">support@quoteninja.com</li>
              <li className="text-muted-foreground">+1 234 567 8900</li>
              <li className="text-muted-foreground">123 Calculator Ave, <br />Suite 456, <br />Washroom City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} QuoteNinja. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
