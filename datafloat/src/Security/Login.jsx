// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Import custom CSS for styling

// LoginPage component definition
const LoginPage = () => {
  // State variables for user input and control flow
  const [email, setEmail] = useState('');         // Store entered email
  const [password, setPassword] = useState('');   // Store entered password
  const [error, setError] = useState('');         // Store error message
  const [users, setUsers] = useState([]);         // Store fetched user list from backend

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Fetch user list from backend API when component mounts
  useEffect(() => {
    fetch('/users') // Assuming Flask API returns registered users
      .then(res => res.json()) // Parse JSON response
      .then(data => setUsers(data)) // Store user data
      .catch(err => {
        console.error('Error fetching users:', err); // Log error
        setError('Unable to fetch users from server'); // Show error to user
      });
  }, []); // Empty dependency array → run only once on mount

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Find a user that matches the entered credentials
    const matchedUser = users.find(
      user => user.email === email && user.password === password
    );

    if (matchedUser) {
      // If user credentials are correct:
      setError(''); // Clear any previous errors

      // Save user details in sessionStorage for later use
      sessionStorage.setItem('userEmail', matchedUser.email);
      sessionStorage.setItem('userName', matchedUser.name);
      sessionStorage.setItem('userPhone', matchedUser.phone); // Corrected typo

      // Check for static admin user
      if (matchedUser.email === 'Static@Admin') {
        navigate('/dashboard'); // Redirect admin to dashboard
      } else {
        navigate('/feedback'); // Redirect normal user to feedback page
      }

    } else {
      // If no matching user found
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        {/* Show error message if any */}
        {error && <p className="error">{error}</p>}

        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login button */}
        <button type="submit">LOGIN</button>

        {/* Separator */}
        <h3 style={{ textAlign: "center", marginBottom: "-3px", marginTop: "-3px" }}>OR</h3>

        {/* Sign-up button (link to registration page) */}
        <Link to="/reg" style={{ textDecoration: 'none' }}>
          <button className="signup-button">SIGN UP</button>
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
