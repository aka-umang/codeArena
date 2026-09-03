import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser, clearError } from '../authSlice';
import { User, Mail, Lock } from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number"),
});


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth); // Removed error as it wasn't used
  console.log("Signup rendered, error =", error);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const emailRegister = register("emailId");
  //const firstNameRegister = register("firstName");
  const onSubmit = (data) => {
    dispatch(clearError());   // optional, but recommended
    dispatch(registerUser(data));
  };
  useEffect(() => {
    console.log("Signup Mounted");

    return () => {
      console.log("Signup Unmounted");
    };
  }, []);
  useEffect(() => {
    console.log("ERROR CHANGED:", error);
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200"> {/* Added a light bg for contrast */}
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-primary">
              CODEARENA
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Create your account and start solving problems.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="John"
                  className={`input input-bordered w-full pl-10 ${errors.firstName ? "input-error" : ""
                    }`}
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
                <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}

            {/* Email Field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered w-full pl-10 ${errors.emailId ? "input-error" : ""
                    }`}
                  {...register("emailId")}
                  onFocus={() => {
                    if (error) dispatch(clearError());
                  }}
                />
              </div>

              {errors.emailId && (
                <span className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <div className="relative">
                {/* Lock Icon */}
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? "input-error" : ""
                    }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>💡</span>
                <span>At least 8 characters, with an uppercase letter, a lowercase letter, and a number.</span>
              </p>

              {errors.password && (
                <span className="text-error text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3 mb-5">
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary w-full text-base ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6"> {/* Increased mt for spacing */}
            <span className="text-sm">
              Already have an account?{' '}
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;