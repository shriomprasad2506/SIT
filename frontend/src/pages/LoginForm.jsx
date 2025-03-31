import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { FaRedo, FaUser, FaLock, FaEyeSlash, FaEye, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const LoginForm = () => {
    useEffect(() => {
        document.title = "SIT | Admin Login";
    }, []);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); 

    // Initialize CAPTCHA engine
    useEffect(() => {
        loadCaptchaEnginge(6); // Generate a 6-character CAPTCHA
    }, []);

    // Function to reload the CAPTCHA
    const reloadCaptcha = () => {
        loadCaptchaEnginge(6); // Regenerate the CAPTCHA
        setCaptcha(''); // Clear the previous CAPTCHA input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Proceed with the API request only if both username and password are filled
        if (!username || !password) {
            toast.error('Username and Password are required');
            reloadCaptcha()
            return;
        }

        // Validate CAPTCHA
        if (!validateCaptcha(captcha)) {
            toast.error('Invalid CAPTCHA');
            reloadCaptcha()
            return;
        }
        setLoading(true); // Set loading to true when request starts

        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`, {
                username,
                password,
            });

            if (response.status === 200) {
                sessionStorage.setItem('authToken', response.data.token);
                toast.success('Login Successful!');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            // Handling the error correctly
            const message = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
            reloadCaptcha()
            toast.error(message);
        } finally {
            setLoading(false); // Reset loading after request completes (success or failure)
        }
    };

    return (
        <div className="relative flex items-center sm:justify-normal justify-center min-h-screen bg-[url('/bg.jpeg')] bg-cover bg-center">
            <div
                className="sm:block absolute hidden h-full w-full top-0 left-0"
                style={{ background: 'linear-gradient(to right, #f8f1e6 15%, rgba(0, 0, 0, 0.2))' }}
            />
            <div className="sm:hidden absolute h-full w-full top-0 left-0 blur-[200px] bg-[#f8f1e6a9]" />
            <form
                onSubmit={handleSubmit}
                className="p-6 rounded-3xl w-full max-w-md z-[1] m-2 sm:ml-[5%] flex flex-col backdrop-blur-[10px] sm:backdrop-blur-none"
                style={{ fontFamily: "'Baskervville', serif" }}
            >
                <h1 className="sm:text-5xl text-4xl font-bold mb-10 text-center text-gray-800">
                    Welcome back !
                </h1>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-lg font-medium text-gray-700">
                        Username
                    </label>
                    <div className="mt-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 sm:text-gray-400 border-r pr-2">
                            <FaUser />
                        </span>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username."
                            className="pl-12 mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-black sm:"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 sm:text-gray-400 border-r pr-2">
                            <FaLock />
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter the password."
                            className="pl-12 mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-black sm:"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 sm:text-gray-400 cursor-pointer"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show different icon */}
                        </span>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block font-medium text-gray-700">CAPTCHA</label>
                    <div className="flex justify-center items-center gap-2 h-full">
                        <div className="my-2">
                            <LoadCanvasTemplate />
                        </div>
                        <button
                            type="button"
                            onClick={reloadCaptcha}
                            className="text-xl text-blue-500 flex items-center hover:cursor-pointer"
                            tabIndex="-1"
                        >
                            <FaRedo className="mr-1" />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        placeholder="Enter the characters shown in the image."
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-black"
                    />
                </div>
                <div className="flex items-center justify-center mb-4">
                    <button
                        type="submit"
                        className={`bg-black w-full text-lg  text-white py-2 px-4 rounded-md transition-all duration-200 ${loading ? 'bg-gray-400 hover:cursor-not-allowed' : 'hover:bg-gray-800 hover:cursor-pointer'
                            }`}
                        disabled={loading} // Disable the button when loading
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin place-self-center" />
                        ) : (
                            'Log in'
                        )}
                    </button>
                </div>
            </form>
            <style>
                {`
                    #reload_href {
                        display: none;
                    }
                `}
            </style>
        </div>
    );
};

export default LoginForm;
