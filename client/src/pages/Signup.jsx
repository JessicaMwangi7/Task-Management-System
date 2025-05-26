// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast.error("You must agree to the terms.");
      return;
    }
    setIsLoading(true);

    try {
      // 1) create the user
      await signup(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.password
      );

      // 2) immediately log them in
      await login(formData.email, formData.password);

      toast.success("Account created! Please complete setup.");
      navigate("/setup");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.error || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-1 text-primary">Sign Up</h1>
          <p className="text-gray-600 text-sm mb-6">Create your account below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["first_name", "last_name", "email", "password"].map(field => (
              <div key={field}>
                <label htmlFor={field} className="text-sm font-medium text-gray-700">
                  {field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
            <div className="flex items-start space-x-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={e => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the terms & policy
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:text-primary/90">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-200">
        <img
          src="/images/signup-photo.jpg"
          alt="Sign Up Visual"
          className="max-w-full min-h-auto object-fit"
        />
      </div>
    </div>
  );
}
