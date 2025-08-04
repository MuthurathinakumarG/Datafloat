// Import necessary dependencies
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './signup.css'; // Import custom CSS for signup styling

// Define the SignupPage component
const SignupPage = () => {
  const navigate = useNavigate(); // Hook for redirecting after successful registration

  // State for holding form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // State for error messages
  const [error, setError] = useState('');

  // Handle changes in form inputs and update state
  const handleChange = (e) => {
    setFormData({ 
      ...formData,                    // Keep existing form data
      [e.target.name]: e.target.value // Update the field being edited
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form refresh behavior

    const { name, email, phone, password, confirmPassword } = formData;

    // Basic validation: Check if all fields are filled
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    // Check if both passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send POST request to backend API to register the user
      const res = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }), // Send user details
      });

      if (res.ok) {
        navigate('/'); // Redirect to login page on successful signup
      } else {
        const data = await res.json();
        // Show error returned from server or generic error
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Server error'); // Handle fetch/network/server errors
    }
  };

  // JSX to render the form
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>

        {/* Display any error message */}
        {error && <p className="error">{error}</p>}

        {/* Full name input */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Phone input */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Confirm password input */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        {/* Submit button */}
        <button type="submit">Register</button>

        {/* Link to login if user already has an account */}
        <p>
          Already have an account?{' '}
          <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
