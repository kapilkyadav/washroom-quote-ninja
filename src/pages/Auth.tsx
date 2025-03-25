
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Mail, Lock, UserCheck, AtSign } from 'lucide-react';
import Header from '@/components/layout/Header';

interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  username?: string;
  agreeTerms?: boolean;
}

const Auth = () => {
  const { user, isLoading, signIn, signUp, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");

  const signInForm = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      username: '',
      agreeTerms: false,
    },
  });

  // If the user is already logged in, redirect to home page
  if (!isLoading && user) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (data: AuthFormData) => {
    try {
      setIsSigningIn(true);
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async (data: AuthFormData) => {
    if (!data.agreeTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms and conditions to create an account.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSigningUp(true);
      const { error } = await signUp(data.email, data.password, {
        full_name: data.fullName,
        username: data.username || data.email.split('@')[0]
      });
      
      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation email. Please check your inbox.",
        });
        setActiveTab("signin");
      }
    } catch (error) {
      toast({
        title: "Error signing up",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Error signing in with Google",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signin-email"
                          placeholder="name@example.com"
                          className="pl-10"
                          type="email"
                          {...signInForm.register('email', { required: true })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signin-password"
                          type="password"
                          className="pl-10"
                          placeholder="••••••••"
                          {...signInForm.register('password', { required: true })}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSigningIn}>
                      {isSigningIn ? "Signing In..." : "Sign In"}
                      <LogIn className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-email"
                          placeholder="name@example.com"
                          className="pl-10"
                          type="email"
                          {...signUpForm.register('email', { required: true })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="signup-full-name">Full Name</Label>
                      <div className="relative">
                        <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-full-name"
                          placeholder="John Doe"
                          className="pl-10"
                          {...signUpForm.register('fullName')}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="signup-username">Username (optional)</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-username"
                          placeholder="johndoe"
                          className="pl-10"
                          {...signUpForm.register('username')}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-password"
                          type="password"
                          className="pl-10"
                          placeholder="••••••••"
                          {...signUpForm.register('password', { required: true })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms"
                        {...signUpForm.register('agreeTerms')}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the Terms and Privacy Policy
                      </Label>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSigningUp}>
                      {isSigningUp ? "Creating Account..." : "Create Account"}
                      <UserPlus className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignIn}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
