import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminOutpassView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [outpassDetails, setOutpassDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!location.state?.outpassId) {
            setError('No outpass ID provided');
            setLoading(false);
            return;
        }
        fetchOutpassDetails();
    }, [location.state?.outpassId]);

    const fetchOutpassDetails = async () => {
        try {
            const outpassId = location.state?.outpassId;
            if (!outpassId) {
                setError('No outpass ID provided');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:3000/student/outpassDetails/${outpassId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setOutpassDetails(data);
        } catch (error) {
            console.error('Error fetching outpass details:', error);
            setError(`Error loading outpass details: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (decision) => {
        try {
            const response = await fetch(`http://localhost:3000/student/admin/outpass/${location.state.outpassId}/decision`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ decision }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            navigate('/admin', { state: { message: `Outpass ${decision}ed successfully` } });
        } catch (error) {
            console.error('Error processing decision:', error);
            setError(`Error processing decision: ${error.message}`);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-xl">Loading...</div>
        </div>
    );
    
    if (error) return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
            <button
                onClick={() => navigate('/admin')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Back to Admin Dashboard
            </button>
        </div>
    );

    if (!outpassDetails) return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                No outpass details found
            </div>
            <button
                onClick={() => navigate('/admin')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Back to Admin Dashboard
            </button>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-primary-contrastText text-2xl font-bold mb-6">Outpass Request Details</h2>
            
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold">Student Information</h3>
                        <p>Name: {outpassDetails.studentName}</p>
                        <p>Email: {outpassDetails.studentEmail}</p>
                        <p>Contact: {outpassDetails.studentContactNumber}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold">Parent Information</h3>
                        <p>Name: {outpassDetails.parentName}</p>
                        <p>Email: {outpassDetails.parentEmail}</p>
                        <p>Contact: {outpassDetails.parentContactNumber}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold">Leave Details</h3>
                    <p>From: {outpassDetails.leaveFrom} {outpassDetails.leaveFromTime}</p>
                    <p>To: {outpassDetails.leaveTo} {outpassDetails.leaveToTime}</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold">Reason for Absence</h3>
                    <p className="mt-2">{outpassDetails.reasonForAbsence}</p>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        onClick={() => handleDecision('approve')}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => handleDecision('reject')}
                        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminOutpassView;