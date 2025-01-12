import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const Prompt = ({ title, text, to, toValue, close }) => {
    const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="h-[100vh] w-[100vw] fixed top-0 left-0 flex items-center justify-center z-20">
      <div
        className="absolute bg-black opacity-50 h-full w-full"
        aria-hidden="true"
        onClick={close} // Close prompt when clicking outside
      ></div>

      <div
        className="relative w-[300px] sm:w-[350px] bg-white rounded-md p-5 px-9 z-40 shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <button
          className="absolute top-2 font-semibold right-3 text-gray-500 hover:text-gray-700"
          onClick={close}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-center text-xl font-bold mb-4">{title}</h2>

        <p className="text-gray-600 mb-6">{text}.</p>

        <div className="flex justify-center space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={close}
          >
            Cancel
          </button>
          <button onClick={()=> navigate(`/${to}`)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            {toValue}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
