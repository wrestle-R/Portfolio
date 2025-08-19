"use client"

import React, { useState } from 'react';
import { TextGenerateEffect } from './ui/text-generate-effect';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

const Contact = () => {
  const titleText = "Contact";
  const [formData, setFormData] = useState({
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
      await addDoc(collection(db, 'messages'), {
        ...formData,
        timestamp: new Date(),
        read: false
      });
      
      setSubmitStatus('success');
      setFormData({ email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-transparent px-4 py-24 relative z-10" id="contact">
      <div className="max-w-4xl mx-auto">
        {/* Animated Title - Outside Container */}
        <div className="text-center mb-8">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3"
            duration={2.5}
            filter={true}
          />
          
        </div>
        
        {/* Contact Container */}
        <div className="bg-neutral-900 rounded-2xl shadow-lg dark:shadow-2xl backdrop-blur-sm overflow-hidden">
          
          {/* Two Column Layout */}
          <div className="grid md:grid-cols-5 min-h-[350px]">
            
            {/* Left Side - Connect Message - Hidden on mobile */}
            <div className="hidden md:block md:col-span-2 p-8 flex-col justify-center md:border-r border-neutral-200/50 dark:border-neutral-700/50">
              <div className="flex flex-col justify-center h-full space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    Let's Connect!
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Have an idea, project, or just want to chat? I'd love to hear from you and explore how we can work together to bring your vision to life.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                    <span className="text-sm">Quick response within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                    <span className="text-sm">Open to collaborations & projects</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                    <span className="text-sm">Always excited to discuss new ideas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form - Full width on mobile */}
            <div className="col-span-full md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-lg md:text-xl font-bold text-black dark:text-white text-center md:text-left">Send me a message</h4>
                
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/80 dark:bg-black/50 border border-neutral-300/50 dark:border-neutral-600/50 rounded-xl focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-200 text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-black/50 border border-neutral-300/50 dark:border-neutral-600/50 rounded-xl focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-200 text-black dark:text-white resize-none placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="Tell me about your project, idea, or just say hello..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-medium animate-fade-in text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Message sent successfully!</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-medium animate-fade-in text-sm">
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