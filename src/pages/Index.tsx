import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Templates } from "@/components/landing/Templates";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar isLoggedIn={isLoggedIn} />
      <Hero isLoggedIn={isLoggedIn} />
      <HowItWorks />
      <Features />
      <Templates />
      <DemoPreview />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
