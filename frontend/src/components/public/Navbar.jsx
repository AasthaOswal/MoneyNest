import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';



const Navbar = () => {

  const {user,loading} = useAuth();


  const getDashboardPath = () => {
    if (!user) return "/login";

    if (user.role === "admin") {
      return "/admin-dashboard";
    }

    if (user.role === "member") {
      return user.familyId
        ? "/dashboard/family"
        : "/family/setup";
    }

    return "/dashboard/family";
  };
  return (
    <nav
  className="sticky top-0 z-50 border-b shadow-sm"
  style={{
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-surface)",
  }}
>
  <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-3">
    {/* Logo */}
    <div
      className="font-bold text-lg sm:text-xl shrink-0"
      style={{ color: "var(--color-primary)" }}
    >
      <Link to="/">WealthNest</Link>
    </div>

    {/* Right Side */}
<div className="relative h-10 flex items-center justify-end min-w-45 sm:min-w-55">

  {/* Guest Buttons */}
  <div
    className={`absolute right-0 flex items-center gap-2 sm:gap-4 transition-all duration-300 ease-in-out ${
      loading || !user
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2 pointer-events-none"
    }`}
  >
    <Link
      to="/login"
      className="max-[500px]:rounded-lg rounded-xl font-medium whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:bg-primary-hover bg-primary text-text-on-primary"
    >
      Login
    </Link>

    <Link
      to="/signup"
      className="hidden min-[500px]:inline-flex max-[500px]:rounded-lg rounded-xl font-medium whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:bg-primary-hover bg-primary text-text-on-primary"
    >
      Sign Up
    </Link>
  </div>

  {/* Dashboard Button */}
  <div
    className={`absolute right-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]t ${
      !loading && user
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-2 pointer-events-none"
    }`}
  >
    <Link
      to={getDashboardPath()}
      className="max-[500px]:rounded-lg rounded-xl font-medium whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:opacity-90 bg-primary text-text-on-primary hover:bg-primary-hover"
    >
      Go to Dashboard
    </Link>
  </div>

</div>
  </div>
</nav>
  );
};

export default Navbar;
