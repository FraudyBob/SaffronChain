"use client";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import About from "@/components/landing/About";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="w-full">
        <Hero />
        <Features />
        <HowItWorks />
        <About />
      </main>
      <Footer />
    </div>
  );
}
