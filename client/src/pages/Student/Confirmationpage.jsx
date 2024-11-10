import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const returnPath = location.state?.returnPath || '/student';
    const email = location.state?.email;

    const handleConfirm = () => {
        navigate(returnPath, { 
            replace: true,
            state: { 
                email,
                reload: true // Add this flag
            }
        });
    };

    const handleBack = () => {
        navigate(-1);
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <svg 
                            className="w-8 h-8 text-green-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Confirm Submission</h2>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to submit the outpass request? 
                        You won't be able to edit the details once submitted.
                    </p>
                </div>
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                    <button 
                        className="inline-flex justify-center items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        onClick={handleConfirm}
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Confirm Submission
                    </button>
                    
                    <button 
                        className="inline-flex justify-center items-center px-6 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        onClick={handleBack}
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Go Back
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Your outpass request will be reviewed by the authorities.</p>
                    <p>You can check the status in your dashboard.</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;