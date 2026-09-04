import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser, clearError } from "../authSlice";
import { useEffect, useState } from 'react';


const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) }); // Using renamed schema

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(clearError());
    dispatch(loginUser(data));
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <NavLink to="/signup" className="inline-block font-display text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CODEARENA
            </span>
          </NavLink>
          <p className="text-base-content/50 text-sm mt-2">Sharpen your skills. Climb the ranks.</p>
        </div>

        <div className="card bg-base-200 border border-base-300 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
          <div className="card-body">
            <h2 className="font-display text-xl font-semibold mb-1">Welcome back</h2>
            <p className="text-base-content/50 text-sm mb-6">Log in to keep your streak going.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`}
                  {...register('emailId')}
                  onFocus={() => {
                    if (error) dispatch(clearError());
                  }}
                />
                {errors.emailId && (
                  <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
                )}
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-base-content/40 hover:text-base-content/70"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-error text-sm mt-1">{errors.password.message}</span>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-error/10 border border-error/30 text-error px-4 py-3 mt-4 text-sm">
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control mt-8">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? 'loading btn-disabled' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Logging in...
                    </>
                  ) : 'Log In'}
                </button>
              </div>
            </form>
            <div className="text-center mt-6">
              <span className="text-sm text-base-content/60">
                Don't have an account?{' '}
                <NavLink to="/signup" className="link link-primary font-medium">
                  Sign Up
                </NavLink>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;