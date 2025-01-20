import React, { useState } from 'react';
import Logo from '../assets/logo.jpg';
import { sendOtp } from '../firebase/PhoneAuth';
import { initializeRecaptcha } from '../firebase/reCaptcha';

const IconButton = ({ icon, label, link }) => {
    const API_URL = import.meta.env.VITE_APIURL
    return (
        <a
            href={`${API_URL}/auth/${link}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-shadow shadow-sm"
        >
            <img src={icon} alt={`${label} logo`} className="w-5 h-5" />
            <span className="text-gray-700 font-medium">{label}</span>
        </a>
    );
};

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleSendOtp = async () => {
        if (!phoneNumber) {
            alert("Please enter a valid phone number");
            return;
        }
        try {
            const recaptchaContainer = document.getElementById("recaptcha-container");
            await initializeRecaptcha(recaptchaContainer); 
            const result = await sendOtp(phoneNumber, recaptchaContainer);
            setConfirmationResult(result);
            setIsOtpSent(true);
            alert("OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP. Please try again.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            alert("Please enter the OTP");
            return;
        }
        try {
            const result = await confirmationResult.confirm(otp);
            console.log("User signed in successfully:", result.user);
            alert("Phone number verified successfully!");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className='py-10'>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img alt="MR Fashions" src={Logo} className="mx-auto h-16 rounded-full w-auto" />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900">
                            Phone Number:
                        </label>
                        <div className="mt-2">
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                required
                                placeholder="+1234567890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    {isOtpSent && (
                        <div className="mt-4">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-900">
                                OTP:
                            </label>
                            <div className="mt-2">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>
                        </div>
                    )}
                    <div className="mt-4">
                        {isOtpSent ? (
                            <button
                                onClick={handleVerifyOtp}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                            >
                                Verify OTP
                            </button>
                        ) : (
                            <button
                                onClick={handleSendOtp}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                            >
                                Send OTP
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1 p-5 justify-center">
                        <div className="border w-[80px] h-0"></div>
                        <div>
                            <p className="from-neutral-800">or continue with</p>
                        </div>
                        <div className="border w-[80px] h-0"></div>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                        <IconButton
                            icon="http://pluspng.com/img-png/google-logo-png-open-2000.png"
                            label="Google"
                            link="google"
                        />
                        <IconButton
                            icon="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                            label="GitHub"
                            link="github"
                        />
                    </div>
                </div>
                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
};

export default Login;
