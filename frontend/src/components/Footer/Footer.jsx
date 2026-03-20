import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-text mb-4">FamFinance</h3>
            <p className="text-muted max-w-sm">
              Born from a mother's handwritten notebook to a digital SaaS. 
              Helping families stop wondering "where did the money go?"
            </p>
          </div>
          <div>
            <h4 className="font-bold text-text mb-4">Features</h4>
            <ul className="space-y-2 text-muted text-sm">
              <li>Individual Tracking</li>
              <li>Family Insights</li>
              <li>Goal Setting</li>
              <li>PDF/Excel Export</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-text mb-4">Tech</h4>
            <ul className="space-y-2 text-muted text-sm">
              <li>Real-time Dashboards</li>
              <li>Multi-tenant SaaS</li>
              <li>Production Logging</li>
              <li>Cron Job Alerts</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted text-sm">
          © {new Date().getFullYear()} FamFinance. Built for the family, by the family.
        </div>
      </div>
    </footer>
  );
};

export default Footer;