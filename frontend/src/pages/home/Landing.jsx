import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  FileText,
  Users,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white">

      {/* HERO */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Manage family finances <br />
            <span className="text-primary">without the chaos</span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
            Track income, expenses, and goals across your entire family —
            all in one clean, real-time dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-text-on-primary rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Get Started <ArrowRight size={18} />
            </Link>

            <button className="px-8 py-4 bg-surface border border-border text-text rounded-xl text-lg font-semibold hover:border-primary transition-all">
              Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-10 border-y border-border bg-surface">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-10 text-muted text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} /> Multi-user support
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} /> Secure & private
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} /> Real-time insights
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything your family needs
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 size={28} />}
              title="Real-time Analytics"
              desc="Understand spending patterns, track income sources, and make smarter decisions instantly."
            />

            <FeatureCard
              icon={<Bell size={28} />}
              title="Smart Alerts"
              desc="Get notified when expenses go high or budgets are close to limits."
            />

            <FeatureCard
              icon={<FileText size={28} />}
              title="Reports & Export"
              desc="Generate clean reports for your family discussions or financial planning."
            />
          </div>
        </div>
      </section>

      {/* STORY / VISUAL */}
      <section className="py-24 px-4 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Built from real problems
            </h2>

            <p className="text-muted mb-4 italic">
              "Every expense written in a notebook… every month the same struggle."
            </p>

            <p className="text-muted leading-relaxed">
              We built this to replace manual tracking with a smart, shared system —
              where every family member contributes, and everyone stays informed.
            </p>
          </div>

          {/* VISUAL CARD */}
          <div className="bg-bg border border-border rounded-2xl p-8 shadow-sm">
            <h4 className="text-sm font-semibold text-muted mb-6 uppercase tracking-wide">
              Monthly Overview
            </h4>

            <div className="space-y-6">
              <ProgressBar label="Income" value="70%" color="income" />
              <ProgressBar label="Expenses" value="45%" color="expense" />
              <ProgressBar label="Investments" value="30%" color="investment" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Start managing smarter today
          </h2>

          <p className="text-muted mb-10">
            Join your family, track everything together, and take control of your finances.
          </p>

          <Link
            to="/signup"
            className="px-10 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl text-lg font-semibold shadow-lg transition-all"
          >
            Create Your Family Account
          </Link>
        </div>
      </section>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-surface border border-border rounded-2xl hover:border-primary transition-all shadow-sm">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted">{desc}</p>
  </div>
);

const ProgressBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="text-text font-medium">{label}</span>
      <span className={`text-${color} font-semibold`}>{value}</span>
    </div>

    <div className="w-full h-3 bg-border rounded-full">
      <div
        className={`h-full rounded-full bg-${color}`}
        style={{ width: value }}
      />
    </div>
  </div>
);

export default Landing;