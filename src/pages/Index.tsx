import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, DollarSign, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:pt-40 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium animate-fade-in">
                Precise Washroom Estimation
              </div>
              <h1 className="hero-text mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Transform Your <span className="text-primary">Washroom</span> with Confidence
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Get an instant, accurate quote for your custom washroom project with our advanced calculator. Design your perfect space with precision and clarity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Button asChild size="lg" className="gap-2 button-animation">
                  <Link to="/calculator">
                    Get Your Estimate
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Modern Washroom Design" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-2xl bg-primary/10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Our Estimation Process</h2>
            <p className="subtitle max-w-2xl mx-auto">
              A simple, effective way to get accurate washroom quotes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-8 text-center hover-scale">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-7 h-7 text-primary" />
              </div>
              <h3 className="heading-3 mb-3">Accurate Pricing</h3>
              <p className="text-muted-foreground">
                Get precise cost estimates based on your exact washroom specifications and material choices.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-8 text-center hover-scale">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="heading-3 mb-3">Save Time</h3>
              <p className="text-muted-foreground">
                Receive instant quotes without waiting days for contractors to provide estimates.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-8 text-center hover-scale">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LineChart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="heading-3 mb-3">Transparent Breakdown</h3>
              <p className="text-muted-foreground">
                See exactly what you're paying for with detailed line items for materials and labor.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">How It Works</h2>
            <p className="subtitle max-w-2xl mx-auto">
              Three simple steps to get your custom washroom quote
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-6">
                1
              </div>
              <h3 className="heading-3 mb-3">Enter Your Details</h3>
              <p className="text-muted-foreground mb-4">
                Provide the dimensions and specifications of your washroom project.
              </p>
              <div className="absolute top-0 right-0 md:left-full md:top-6 h-px w-12 md:w-1/2 md:h-px bg-border hidden md:block"></div>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-6">
                2
              </div>
              <h3 className="heading-3 mb-3">Select Options</h3>
              <p className="text-muted-foreground mb-4">
                Choose your preferred fixtures, brands, and timeline for the project.
              </p>
              <div className="absolute top-0 right-0 md:left-full md:top-6 h-px w-12 md:w-1/2 md:h-px bg-border hidden md:block"></div>
            </div>
            
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-6">
                3
              </div>
              <h3 className="heading-3 mb-3">Get Your Estimate</h3>
              <p className="text-muted-foreground mb-4">
                Receive a detailed breakdown of costs with options to print or save.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="gap-2 button-animation">
              <Link to="/calculator">
                Try It Now
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Why Choose Our Calculator</h2>
            <p className="subtitle max-w-2xl mx-auto">
              Benefits that make our washroom quote calculator the best choice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Precise Measurements</h3>
                <p className="text-muted-foreground">
                  Our calculator uses exact dimensions to provide accurate square footage calculations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Multiple Brand Options</h3>
                <p className="text-muted-foreground">
                  Choose from various brands to find the perfect balance of quality and price.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Fixture Customization</h3>
                <p className="text-muted-foreground">
                  Select individual fixtures to create a personalized washroom that meets your needs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  See a complete breakdown of all costs with no hidden fees or surprises.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Timeline Options</h3>
                <p className="text-muted-foreground">
                  Choose between standard and flexible timelines to fit your schedule and budget.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Digital Estimate Delivery</h3>
                <p className="text-muted-foreground">
                  Receive your estimate by email or download as a PDF for convenient reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card rounded-2xl p-12 text-center">
            <h2 className="heading-1 mb-6">Ready to Transform Your Washroom?</h2>
            <p className="subtitle mb-8 max-w-2xl mx-auto">
              Get your personalized estimate today and make your perfect washroom a reality.
            </p>
            <Button asChild size="lg" className="gap-2 button-animation">
              <Link to="/calculator">
                Start Your Estimate
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
