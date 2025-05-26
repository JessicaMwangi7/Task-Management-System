import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import API from '../api/axios';

export default function Hero() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async e => {
    e.preventDefault();
    setMessage('');
    if (!newsletterEmail) {
      setMessage('Please enter a valid email.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/newsletter', { email: newsletterEmail });
      setMessage('Thank you for subscribing!');
      setNewsletterEmail('');
    } catch {
      setMessage('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background px-4 py-12 md:px-6 lg:px-8 text-primary">
      <div className="mx-auto max-w-7xl">
        {/* 3️⃣ No static “TaskFlow” here */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-4xl">
              Collaborate, Track, and Stay Accountable with TaskFlow
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              TaskFlow empowers teams to manage tasks, collaborate in real-time,
              and stay accountable — all in one simple, powerful platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
              <Link to="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/Homepage-photo.jpg"
              alt="TaskFlow Preview"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
