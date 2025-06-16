"use client";

import React, { useState } from 'react';
import { TextGenerateEffect } from '../components/ui/text-generate-effect';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

const Resume = () => {
  const resumePdf = "/resume.pdf";
  const resumeImage = "/Resume.jpg";
  const titleText = "Resume";

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const downloadResume = (format) => {
    const link = document.createElement('a');
    if (format === 'pdf') {
      link.href = resumePdf;
      link.download = 'Russel_Daniel_Paul_Resume.pdf';
    } else {
      link.href = resumeImage;
      link.download = 'Russel_Daniel_Paul_Resume.jpg';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-neutral-50 dark:from-black dark:to-neutral-900 relative">
      {/* Enhanced Header with RDP and Back to Portfolio */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-neutral-200/30 dark:border-neutral-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* RDP Text Only - Clickable */}
            <a
              href="/"
              className="group flex items-center hover:scale-105 transition-all duration-300"
            >
              <div className="text-2xl font-bold text-black dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                RDP
              </div>
            </a>
            
            {/* Back to Portfolio Button */}
            <a
              href="/"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 hover:from-neutral-200 hover:to-neutral-300 dark:hover:from-neutral-700 dark:hover:to-neutral-600 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Back to Portfolio</span>
            </a>
          </div>
        </div>
      </header>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-xl relative border border-neutral-200/50 dark:border-neutral-700/50">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Let's Connect</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">I'd love to hear from you</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-200 text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-200 text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none"
                  placeholder="I'd appreciate your feedback on my portfolio or suggestions for improvement. Also open to discussing potential opportunities!"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-black to-neutral-800 dark:from-white dark:to-neutral-200 text-white dark:text-black rounded-xl font-semibold hover:scale-[1.02] hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium bg-green-50 dark:bg-green-900/20 rounded-lg py-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Message sent successfully!
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/20 rounded-lg py-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Failed to send message.
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
          <TextGenerateEffect
            words={titleText}
            className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6"
            duration={2.5}
            filter={true}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => downloadResume('pdf')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>

            <button
              onClick={() => downloadResume('image')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-xl font-medium hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Download Image
            </button>
          </div>
          </div>

          {/* Resume Image */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-neutral-200">
                <img
                  src={resumeImage}
                  alt="Russel Daniel Paul Resume"
                  className="w-full h-auto"
                  style={{ maxHeight: '100vh', objectFit: 'contain' }}
                  onError={(e) => {
                    console.error('Error loading resume image');
                    e.target.src = `https://via.placeholder.com/800x1000/e5e5e5/666666?text=Resume+Image+Not+Found`;
                  }}
                />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                High-quality image format for easy viewing
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-500">•</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Available in both PDF and image formats
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6">
            Interested in working together? Let's connect!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 text-black dark:text-white rounded-xl font-medium hover:scale-105 hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Get In Touch
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Resume;

