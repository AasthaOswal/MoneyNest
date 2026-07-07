import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  BarChart3,
  Bell,
  FileText,
  Users,
  ShieldCheck,
  TrendingUp,
  Target,
  UserPlus,
  FileSpreadsheet,
  Brain

} from "lucide-react";

  const colorClasses = {
  income: {
    text: "text-income",
    bg: "bg-income",
  },
  expense: {
    text: "text-expense",
    bg: "bg-expense",
  },
  investment: {
    text: "text-investment",
    bg: "bg-investment",
  },
};


const features = [
  {
    icon: BarChart3,
    title: "Real-time Dashboard Updates System",
    desc: "Dashboard is updated in real-time via Socket.io when any family member makes changes to transactions.",
  },
  {
    icon: Brain,
    title: "AI Powered Monthly PDF Reports System",
    desc: "Receive AI-powered monthly PDF reports with financial insights through our automated email system.",
  },
  {
    icon: UserPlus,
    title: "Link-based Invite System",
    desc: "Invite family members using a shareable link, allowing them to join your family workspace instantly.",
  },
  {
    icon: Bell,
    title: "Weekly Goal Updates System",
    desc: "Receive automated weekly email and in-app notifications with detailed goal progress to help you stay on track.",
  },
  {
    icon: FileSpreadsheet,
    title: "Transactions Export & Email System",
    desc: "Filter and export transaction records via Excel download or send directly to your email, all on a single click.",
  },
  
  {
    icon: Target,
    title: "Personal Goals & Personal Dashboard",
    desc: "You get a personal dashbaord as well as you can create personal goals and track them even while being part of the family.",
  },
];

const Landing = () => {

  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white">

      {/* HERO */}
      <section className="py-12 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Manage family finances <br />
            <span className="text-primary">without the chaos</span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
            Track income, expenses, imvestments, pre-investment savings, savings and goals across your entire family —
            all in one clean, real-time dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
           <a
              href="#features"
              className="px-8 py-4 bg-surface border border-border text-text rounded-xl text-lg font-semibold hover:border-primary transition-all  flex items-center justify-center gap-2 shadow-lg"
            >
              Features <ArrowDown size={18} />
            </a>
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-text-on-primary rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Get Started <ArrowRight size={18} />
            </Link>


 
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
      <section className="py-24 px-4" id="features">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 mt-6">
            Collaborative Family Finance System Features
          </h2>

         
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <FeatureCard
                  key={index}
                  icon={<Icon size={28} />}
                  title={feature.title}
                  desc={feature.desc}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* STORY / VISUAL */}
      <section  id="about" className="py-24 px-4 bg-surface border-y border-border">
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
  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-text-on-primary shadow-lg transition-all duration-200 hover:bg-primary-hover hover:shadow-xl group"
>
  Start for Free
  <ArrowRight
    size={18}
    className="transition-transform duration-200 group-hover:translate-x-1"
  />
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

const ProgressBar = ({ label, value, color }) => {
  const colors = colorClasses[color];

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-text font-medium">{label}</span>
        <span className={`${colors.text} font-semibold`}>
          {value}
        </span>
      </div>

      <div className="w-full h-3 bg-border rounded-full">
        <div
          className={`${colors.bg} h-full rounded-full`}
          style={{ width: value }}
        />
      </div>
    </div>
  );
};
export default Landing;