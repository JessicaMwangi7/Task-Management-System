// src/pages/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OPTIONS_STEP1 = ['Work', 'Personal', 'School'];
const SUB_OPTIONS = {
  Work: ['Finance & Accounting', 'Sales & CRM', 'HR & Recruiting', 'Creative & Design', 'PMO', 'Marketing', 'Operations', 'Startup', 'Software Development', 'Professional Services', 'IT', 'Support', 'Other'],
  Personal: ['Personal Use'],
  School: ['Homework', 'Clubs', 'Projects'],
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState('');
  const [subChoice, setSubChoice] = useState('');

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
      setSubChoice('');
      return;
    }
    try {
      // now works against POST or PUT
      await API.post(

        '/auth/preferences',

        { category: choice, subcategory: subChoice }
      );
    } catch (e) {
      console.error('Onboarding save failed:', e.response?.data || e);
    }
    navigate('/dashboard');  // or /home if that's your post-onboard landing
  };

  const handleBack = () => {
    if (step === 1) navigate('/home');
    else setStep(1);
  };

  const currentOptions = step === 1 ? OPTIONS_STEP1 : SUB_OPTIONS[choice] || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-2xl mb-8">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: step === 1 ? '33%' : '66%' }}
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-primary">
        {step === 1
          ? 'What would you like to use TaskFlow for?'
          : 'What would you like to manage?'}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8 max-w-2xl">
        {currentOptions.map(opt => {
          const selected = step === 1 ? choice === opt : subChoice === opt;
          return (
            <button
              key={opt}
              onClick={() => step === 1 ? setChoice(opt) : setSubChoice(opt)}
              className={`py-2 px-4 border rounded-lg text-center whitespace-nowrap ${selected ? 'bg-primary text-white' : 'bg-white text-primary border-primary'
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex w-full max-w-2xl justify-between">
        <Button variant="outline" onClick={handleBack} className="px-6">Back</Button>
        <Button
          onClick={handleNext}
          disabled={step === 1 ? !choice : !subChoice}
          className="px-6"
        >
          {step === 1 ? 'Next' : 'Done'}
        </Button>
      </div>
    </div>
  );
}
