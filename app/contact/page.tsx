"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, User, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-extrabold text-blue-700">Mentor</span>
            <span className="text-xl font-extrabold text-orange-500">Konnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Home
            </Link>
            <Link href="/services" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Services
            </Link>
            <Link href="/mentors" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Browse Mentors
            </Link>
          </nav>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm rounded-xl">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-gray-50/60 py-16 md:py-24">
        <div className="container max-w-lg mx-auto">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 font-medium transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-orange-500" />

            <div className="p-8">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">Request Received!</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Thanks, {name.split(" ")[0]}! We&apos;ll reach out to you shortly to schedule your free call.
                    </p>
                  </div>
                  <button
                    onClick={() => { setName(""); setPhone(""); setEmail(""); setSubmitted(false); }}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-gray-900">Book a Free Discovery Call</h1>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                      Fill in your details and one of our career experts will get in touch to schedule a complimentary 15-minute call.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact-name"
                          placeholder="Jane Smith"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="pl-9 h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact-phone"
                          type="tel"
                          placeholder="+44 7700 900000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="pl-9 h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-9 h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold mt-2"
                    >
                      Book Free Call
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="font-extrabold text-blue-700">Mentor</span>
            <span className="font-extrabold text-orange-500">Konnect</span>
          </Link>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MentorKonnect. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Home</Link>
            <Link href="/mentors" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Browse Mentors</Link>
            <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
