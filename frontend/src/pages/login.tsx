import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext";

function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
   const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

  const newErrors: { email: string; password: string } = {
    email: '',
    password: ''
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    console.log(newErrors);
    const data = { email:email, password:password };
    console.log('Login successful:', data);
    if (!newErrors.email && !newErrors.password) {
        
    try {
      await login(data,'user-login');
      navigate('/home');
    } catch {
      setError("Login failed. Check your credentials.");
    } finally {
      // setLoading(false);
    }
        // handleUpdate(data);
        // navigate('/home');
    }
}

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-heading">
          <span className="login-mark">R</span>
          <p className="login-eyebrow">Welcome back</p>
          <h1>Sign in to your account</h1>
          <p className="login-subtitle">Enter your details to continue.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email && <p className="login-error">{errors.email}</p>}
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && <p className="login-error">{errors.password}</p>}
            {error&&<p className="login-error">{error}</p>}
          </div>

          <button className="login-button" type="submit">
            Sign in
            <span aria-hidden="true">&rarr;</span>
          </button>
        </form>

        <p className="login-link-row">
          New here?
          <Link to="/signup" className="login-link">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
export default Login;