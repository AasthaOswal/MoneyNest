import React from 'react';

const Footer = () => {
  return (
    <footer className="p-6 text-center border-t mt-auto" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-muted)' }}>
      <p>&copy; {new Date().getFullYear()} WealthNest. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
