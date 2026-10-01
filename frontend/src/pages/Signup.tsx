import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export interface SignupFormData {
	name: string;
	mobile: string;
	email: string;
	password: string;
	confirmPassword: string;
}

function Signup() {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const submittingRef = useRef(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submittingRef.current) return;

		const formData = new FormData(event.currentTarget);
		const data: SignupFormData = {
			name: String(formData.get('name') ?? '').trim(),
			mobile: String(formData.get('mobile') ?? '').trim(),
			email: String(formData.get('email') ?? '').trim(),
			password: String(formData.get('password') ?? ''),
			confirmPassword: String(formData.get('confirmPassword') ?? ''),
		};
		if (!data.name || !data.mobile || !data.email) {
			setError('Please complete all required fields.');
			return;
		}

		if (data.password !== data.confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setError('');
		submittingRef.current = true;
		setIsSubmitting(true);
		try {
            console.log(data);
			await signup(data);
			navigate('/home', { replace: true });
		} catch (signupError) {
			setError(signupError instanceof DOMException && signupError.name === 'TimeoutError'
				? 'Signup service did not respond. Please try again later.'
				: signupError instanceof Error ? signupError.message : 'Could not create your account. Please try again.');
		} finally {
			submittingRef.current = false;
			setIsSubmitting(false);
		}
	};

	return (
		<main className="login-page signup-page">
			<section className="login-card signup-card">
				<div className="login-heading">
					<span className="login-mark" aria-hidden="true">R</span>
					<p className="login-eyebrow">Get started</p>
					<h1>Create your account</h1>
					<p className="login-subtitle">Enter your details to set up your expense tracker.</p>
				</div>

				<form className="login-form signup-form" onSubmit={handleSubmit}>
					<div className="login-field">
						<label htmlFor="signup-name">Full name</label>
						<input id="signup-name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
					</div>
					<div className="login-field">
						<label htmlFor="signup-mobile">Mobile number</label>
						<input id="signup-mobile" name="mobile" type="tel" autoComplete="tel" placeholder="Your mobile number" required />
					</div>
					<div className="login-field signup-field-wide">
						<label htmlFor="signup-email">Email address</label>
						<input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
					</div>
					<div className="login-field">
						<label htmlFor="signup-password">Password</label>
						<input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={6} placeholder="At least 6 characters" required />
					</div>
					<div className="login-field">
						<label htmlFor="signup-confirm-password">Confirm password</label>
						<input id="signup-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} placeholder="Re-enter your password" required />
					</div>
					{error && <p className="login-error signup-field-wide" role="alert">{error}</p>}
					<button className="login-button signup-field-wide" type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Creating account...' : 'Create account'}
						<span aria-hidden="true">&rarr;</span>
					</button>
				</form>

				<p className="login-link-row">
					Already have an account?
					<Link to="/" className="login-link">Sign in</Link>
				</p>
			</section>
		</main>
	);
}

export default Signup;