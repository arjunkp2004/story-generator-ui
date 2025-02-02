import React from "react";
import { useRouter } from "next/navigation"; // Use for navigation, if needed

interface HeaderProps {
  userName?: string; // Optionally pass the user's name as a prop
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic here, like clearing auth tokens and redirecting
    // For example, if you're using localStorage for authentication:
    localStorage.removeItem("authToken"); // Or use your auth system to log out
    router.push("/login"); // Redirect to the login page after logout
  };

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md">
      <div className="flex items-center">
        {/* App logo */}
        <img src="/logo.png" alt="App Logo" className="h-16 w-16 mr-2" />
        {/* App Name */}
        <h1 className="text-xl font-semibold">Story Generator App</h1>
      </div>

      {/* User Profile and Logout */}
      <div className="flex items-center space-x-4">
        {userName && <span className="text-sm">{`Hello, ${userName}`}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
