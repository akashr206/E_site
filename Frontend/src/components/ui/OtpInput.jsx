import { useState, useRef } from "react";

const OtpInput = ({ length = 6, otp, setOtp }) => {
    const inputs = useRef([]);

    const handleChange = (e, index) => {
        const { value } = e.target;

        if (value.match(/^\d$/)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);


            if (index < length - 1) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            if (otp[index] === '') {
                if (index > 0) {
                    newOtp[index - 1] = '';
                    setOtp(newOtp);
                    inputs.current[index - 1].focus();
                }
            } else {
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
        
    };

    return (
        <div className="flex justify-center space-x-2">
            {otp.map((_, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputs.current[index] = el)}
                    className="w-10 h-10 text-center bg-transparent text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
            ))}
        </div>
    );
};

export default OtpInput;
