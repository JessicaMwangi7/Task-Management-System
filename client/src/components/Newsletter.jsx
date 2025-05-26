import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import API from '../api/axios';

export default function Newsletter() {
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


                {/* Newsletter */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-semibold mb-2">Stay Updated!</h2>
                    <p className="text-gray-600 mb-4">
                        Join our newsletter for the latest tips and updates on managing your workflow effectively.
                    </p>
                    <form
                        onSubmit={handleSubscribe}
                        className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto"
                    >
                        <input
                            type="email"
                            value={newsletterEmail}
                            onChange={e => setNewsletterEmail(e.target.value)}
                            placeholder="Your Email Here"
                            required
                            className="w-full sm:flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? 'Joining…' : 'Join Now'}
                        </Button>
                    </form>
                    {message && <p className="mt-2 text-sm text-blue-600">{message}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                        By clicking Join Now, you agree to our{' '}
                        <a href="#" className="underline">
                            Terms and Conditions
                        </a>.
                    </p>
                </div>

            </div>
        </div>
    );
}
