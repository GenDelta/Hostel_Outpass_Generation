import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GuardOutpassView = () => {
  const navigate = useNavigate();
  const [approvedOutpasses, setApprovedOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOutpass, setSelectedOutpass] = useState(null);

  useEffect(() => {
    fetchApprovedOutpasses();
  }, []);

  const fetchApprovedOutpasses = async () => {
    try {
      const response = await fetch('http://localhost:3000/student/approvedOutpasses');
      if (!response.ok) {
        throw new Error('Failed to fetch approved outpasses');
      }
      const data = await response.json();
      setApprovedOutpasses(data);
    } catch (err) {
      setError('Failed to load approved outpasses');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (outpass) => {
    setSelectedOutpass(outpass);
  };

  const handleClose = () => {
    setSelectedOutpass(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="bg-gray-300 rounded-lg p-4 mb-6">
            <img 
              src="/api/placeholder/200/200"
              alt="Security" 
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h1 className="text-center font-bold">Security</h1>
          </div>
          <button 
            onClick={() => navigate("/")} 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded transition duration-300"
          >
            Home Page
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6">Approved Outpasses</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            {approvedOutpasses.map((outpass) => (
              <div 
                key={outpass._id} 
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{outpass.studentName}</p>
                    <p className="text-sm text-gray-600">
                      Leave: {new Date(outpass.leaveFrom).toLocaleDateString()} {outpass.leaveFromTime} - 
                      {new Date(outpass.leaveTo).toLocaleDateString()} {outpass.leaveToTime}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(outpass)}
                    className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded transition duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOutpass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Outpass Details</h3>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold">Student Information</h4>
                <p>Name: {selectedOutpass.studentName}</p>
                <p>Email: {selectedOutpass.studentEmail}</p>
                <p>Contact: {selectedOutpass.studentContactNumber}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Parent Information</h4>
                <p>Name: {selectedOutpass.parentName}</p>
                <p>Email: {selectedOutpass.parentEmail}</p>
                <p>Contact: {selectedOutpass.parentContactNumber}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Leave Duration</h4>
              <p>From: {new Date(selectedOutpass.leaveFrom).toLocaleDateString()} {selectedOutpass.leaveFromTime}</p>
              <p>To: {new Date(selectedOutpass.leaveTo).toLocaleDateString()} {selectedOutpass.leaveToTime}</p>
            </div>

            <div>
              <h4 className="font-semibold">Reason for Absence</h4>
              <p className="mt-1">{selectedOutpass.reasonForAbsence}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardOutpassView;