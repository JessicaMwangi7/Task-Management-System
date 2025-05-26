import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Features() {
  const navigate = useNavigate();
  const tooltips = {
    1: 'Turn chaos into checklists!',
    2: 'Teamwork, but smarter!',
    3: 'Stay on track without the pressure.',
  };

  return (
    <section className="py-16 bg-white text-primary">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/home')}
          className="mb-8 text-sm text-primary hover:underline"
        >
          {/* &larr; Back to Home */}
        </button>

        <h2 className="text-4xl font-bold text-center mb-8">Key Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Everything your team needs to collaborate, stay accountable, and get work done efficiently.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {[1,2,3].map(id => (
            <div key={id} className="bg-gray-50 rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                <img
                  src={`/images/features-photo${id}.jpg`}
                  alt="Feature"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                { id===1 ? 'Task Management' : id===2 ? 'Team Collaboration' : 'Accountability Tracking' }
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                { id===1
                  ? 'Create, assign, update, and track tasks within projects and teams.'
                  : id===2
                  ? 'Real-time collaboration with notifications and shared boards.'
                  : 'Monitor progress, deadlines, and task completion across your team.' }
              </p>
              <div className="relative group inline-block">
                <Button variant="link" className="p-0 text-primary flex items-center gap-1">
                  Learn More <ArrowRight size={16} />
                </Button>
                <div className="absolute left-0 -bottom-10 w-64 p-2 bg-primary text-primary-foreground text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                  {tooltips[id]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
