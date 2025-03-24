
import AuthForm from "@/components/AuthForm";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 bg-primary/10 rounded-xl mb-4">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">DOSE-MATE</h1>
          <p className="text-muted-foreground max-w-sm mx-auto text-balance">
            Your personal medication management assistant
          </p>
        </div>
        
        <AuthForm />
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Index;
