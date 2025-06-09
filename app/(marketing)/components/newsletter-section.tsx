'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is a placeholder for the actual subscription logic
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <section id="newsletter" className="w-full py-16 md:py-24 bg-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 text-yellow-500 flex justify-center">
            <Mail size={40} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Stay Updated on Our Progress
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our waitlist and newsletter to receive updates on development milestones and launch dates.
          </p>
          
          {submitted ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
              <CheckCircle className="text-yellow-500 h-16 w-16 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
              <p className="text-gray-600 text-center">
                You've been added to our waitlist. We'll keep you updated on our progress and let you know when Conpanion is ready for you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-grow py-6 px-4 text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-6 px-8 text-lg"
                  disabled={loading}
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                We respect your privacy. We'll never share your information with third parties.
              </p>
            </form>
          )}
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Early Access</h3>
              <p className="text-gray-600">Get first access when we launch</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Product Updates</h3>
              <p className="text-gray-600">Regular updates on new features</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Exclusive Content</h3>
              <p className="text-gray-600">Tips and insights for construction teams</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 