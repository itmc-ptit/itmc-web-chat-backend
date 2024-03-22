import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Registration = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); // State for date of birth
  const [gender, setGender] = useState(''); // State for gender
  const [errorMessage, setErrorMessage] = useState('');
  const create_at = new Date().toISOString();
  const delete_at = null;

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleDobChange = (event) => {
    setDob(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear any previous error message
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          dob,
          gender,
          create_at,
          delete_at,
        }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data); // Handle successful registration (e.g., redirect)

      // Clear registration form after successful registration (optional)
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setDob('');
      setGender('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={first_name}
            onChange={handleFirstNameChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={last_name}
            onChange={handleLastNameChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="date" value={dob} onChange={handleDobChange} required />
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={handleGenderChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <div>
        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Registration;
