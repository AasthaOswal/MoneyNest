import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layoutParts/Navbar';
import Footer from '../../components/layoutParts/Footer';

const Landing = () => {
  return (
    // Use 'bg-bg' but fallback to a standard gray if variable fails
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Stop tracking in notebooks. <br />
            {/* Standard blue-500 fallback if primary fails */}
            <span className="text-primary">Start building wealth.</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            A real-time family finance tracker that aggregates individual incomes, 
            expenses, and investments into a single powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Added h-14 and leading-none to ensure button height visibility */}
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl text-lg font-bold shadow-xl transition-all flex items-center justify-center"
            >
              Create Family Account
            </Link>
            <button className="px-8 py-4 bg-surface border border-border text-text rounded-xl text-lg font-bold hover:border-primary transition-all">
              See How It Works
            </button>
          </div>
        </div>
      </header>

      {/* Story Section */}
      <section className="py-20 bg-surface border-y border-border px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">The "Notebook" Story</h2>
              <p className="text-muted leading-relaxed mb-4 italic">
                "We saw our mom writing every single ₹30 and ₹40 transaction in a notebook for 3 years..."
              </p>
              <p className="text-muted leading-relaxed">
                FamFinance was built to solve this. Individual inputs, combined visibility, 
                and smart insights. No more manual pens and paper.
              </p>
            </div>
            
            {/* Visual Progress Bars using your 'income' variable */}
            <div className="bg-bg p-8 rounded-2xl border border-border shadow-inner">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-6">Family Contribution Split</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-text">Mom</span> 
                    <span className="text-income font-bold">60%</span>
                  </div>
                  <div className="w-full bg-border h-3 rounded-full">
                    <div className="bg-income h-full rounded-full w-[60%] shadow-[0_0_10px_rgba(var(--income),0.5)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-text">Dad</span> 
                    <span className="text-income font-bold">30%</span>
                  </div>
                  <div className="w-full bg-border h-3 rounded-full">
                    <div className="bg-income h-full rounded-full w-[30%] opacity-70"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Logic check: using FeatureCard sub-component */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Designed for Real Families</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon="📊" title="Real-time Analytics" desc="Detailed visualization of needs vs wants and income sources." />
          <FeatureCard icon="🚨" title="Smart Reminders" desc="Get alerts when you reach 50% of your monthly expense limit." />
          <FeatureCard icon="📄" title="One-Click Export" desc="Generate PDF or Excel reports for your family meetings." />
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-surface border border-border rounded-2xl hover:border-primary transition-all group shadow-sm">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-text">{title}</h3>
    <p className="text-muted leading-relaxed">{desc}</p>
  </div>
);

export default Landing;