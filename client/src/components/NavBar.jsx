import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo → landing */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/images/logo-outline.png"
              alt="TaskFlow Logo"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold text-primary">
              TaskFlow
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-primary">
            {!token ? (
              <>
                <Link to="/home" className="hover:text-primary/80">
                  Home
                </Link>
                <Link to="/features" className="hover:text-primary/80">
                  Features
                </Link>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="hover:text-primary/80">
                  Dashboard
                </Link>
                <Link to="/chat" className="hover:text-primary/80">
                  <MessageSquare className="h-5 w-5 " />
                </Link>
                <Link to="/notifications" className="relative hover:text-primary/80">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                    3
                  </span>
                </Link>


                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
