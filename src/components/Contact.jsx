"use client"

import React, { useState } from 'react';
import { TextGenerateEffect } from './ui/text-generate-effect';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const titleText = "Contact";
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const serviceId = import.meta.env.VITE_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_PUBLIC_EMAILJS_PUBLIC_KEY;

      // Initialize EmailJS
      emailjs.init(publicKey);

      // Send email
      await emailjs.send(serviceId, templateId, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short'
        })
      });
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-16 relative z-10" style={{ backgroundColor: 'transparent' }} id="contact">
      <div className="max-w-4xl mx-auto">
        {/* Animated Title - Outside Container */}
        <div className="text-left mb-6">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl md:text-3xl font-bold mb-3"
            duration={2.5}
            filter={true}
          />
          
        </div>
        
        {/* Contact Container */}
        <div className="rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden" style={{ backgroundColor: 'oklch(var(--muted))' }}>
          
          {/* Two Column Layout */}
          <div className="grid md:grid-cols-5">
            
            {/* Left Side - Connect Message - Hidden on mobile */}
            <div className="hidden md:block md:col-span-2 p-6 flex-col justify-center" style={{ borderRight: '1px solid oklch(var(--border))' }}>
              <div className="flex flex-col justify-center h-full space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'oklch(var(--foreground))' }}>
                    Let's Connect!
                  </h3>
                  <p className="leading-relaxed text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                    Have an idea, project, or just want to chat? I'd love to hear from you and explore how we can work together to bring your vision to life.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3" style={{ color: 'oklch(var(--muted-foreground))' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'oklch(var(--foreground))' }}></div>
                    <span className="text-xs">Quick response within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-3" style={{ color: 'oklch(var(--muted-foreground))' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'oklch(var(--foreground))' }}></div>
                    <span className="text-xs">Open to collaborations & projects</span>
                  </div>
                  <div className="flex items-center space-x-3" style={{ color: 'oklch(var(--muted-foreground))' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'oklch(var(--foreground))' }}></div>
                    <span className="text-xs">Always excited to discuss new ideas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form - Full width on mobile */}
            <div className="col-span-full md:col-span-3 p-6 flex flex-col justify-center">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-center md:text-left" style={{ color: 'oklch(var(--foreground))' }}>Send me a message</h4>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'oklch(var(--muted-foreground))' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                      style={{
                        backgroundColor: 'oklch(var(--background) / 0.8)',
                        border: '1px solid oklch(var(--border))',
                        color: 'oklch(var(--foreground))'
                      }}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'oklch(var(--muted-foreground))' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                      style={{
                        backgroundColor: 'oklch(var(--background) / 0.8)',
                        border: '1px solid oklch(var(--border))',
                        color: 'oklch(var(--foreground))'
                      }}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'oklch(var(--muted-foreground))' }}>
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg resize-none transition-all duration-200 text-sm"
                      style={{
                        backgroundColor: 'oklch(var(--background) / 0.8)',
                        border: '1px solid oklch(var(--border))',
                        color: 'oklch(var(--foreground))'
                      }}
                      placeholder="Tell me about your project, idea, or just say hello..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-5 py-2.5 rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                    style={{
                      backgroundColor: 'oklch(var(--primary))',
                      color: 'oklch(var(--primary-foreground))'
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Message'}
                  </button>
                  
                  {submitStatus === 'success' && (
                    <div className="flex items-center space-x-2 font-medium animate-fade-in text-sm" style={{ color: 'oklch(var(--foreground))' }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Message sent successfully!</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="flex items-center space-x-2 font-medium animate-fade-in text-sm" style={{ color: 'oklch(var(--destructive))' }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Failed to send message.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Contact;