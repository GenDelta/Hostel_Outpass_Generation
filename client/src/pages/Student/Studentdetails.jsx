import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function StudentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { listItemId, viewOnly, email } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: email || '',
    studentContactNumber: '',
    parentName: '',
    parentEmail: '',
    parentContactNumber: '',
    leaveFrom: '',
    leaveFromTime: '',
    leaveTo: '',
    leaveToTime: '',
    reasonForAbsence: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [outpassStatus, setOutpassStatus] = useState(null);

  useEffect(() => {
    if (viewOnly && listItemId) {
      const fetchOutpassDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:3000/student/outpassDetails/${listItemId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch outpass details');
          }
          const data = await response.json();
          setFormData(data);
          setOutpassStatus(data.status);
        } catch (error) {
          console.error('Error fetching outpass details:', error);
          setError('The Outpass has been deleted');
        } finally {
          setLoading(false);
        }
      };
      fetchOutpassDetails();
    }
  }, [listItemId, viewOnly]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBackButton = () => {
    navigate('/student', { state: { email: formData.studentEmail } });
  };

  const validateForm = () => {
    const requiredFields = [
      'studentName',
      'studentEmail',
      'studentContactNumber',
      'parentName',
      'parentEmail',
      'parentContactNumber',
      'leaveFrom',
      'leaveFromTime',
      'leaveTo',
      'leaveToTime',
      'reasonForAbsence',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.studentEmail)) {
      setError('Invalid student email format');
      return false;
    }
    if (!emailRegex.test(formData.parentEmail)) {
      setError('Invalid parent email format');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.studentContactNumber)) {
      setError('Student contact number should be 10 digits');
      return false;
    }
    if (!phoneRegex.test(formData.parentContactNumber)) {
      setError('Parent contact number should be 10 digits');
      return false;
    }

    return true;
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleConfirmAndNext = async () => {
    if (viewOnly && !isEditing) {
      navigate('/student', { state: { email: formData.studentEmail } });
      return;
    }

    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const outpassData = {
        listItemId: listItemId || undefined,
        ...formData,
        status: 'pending',
      };

      const detailsResponse = await fetch('http://localhost:3000/student/outpassDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outpassData),
      });

      if (!detailsResponse.ok) {
        const errorData = await detailsResponse.json();
        throw new Error(errorData.message || 'Failed to save outpass details');
      }

      navigate('/confirmationpage', {
        state: {
          returnPath: '/student',
          email: formData.studentEmail,
        },
      });
    } catch (error) {
      console.error('Error in submission:', error);
      setError(error.message || 'Failed to submit outpass details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/student/outpassDetails/${listItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete outpass details');
      }

      navigate('/student', { state: { email: formData.studentEmail } });
    } catch (error) {
      console.error('Error deleting outpass details:', error);
      setError('Failed to delete outpass details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-500 text-white',
      approved: 'bg-green-500 text-white',
      rejected: 'bg-red-500 text-white',
    };

    return (
      <span
        className={`${statusStyles[status]} px-3 py-1 rounded-full text-sm font-semibold`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isFormDisabled = (viewOnly && !isEditing) || loading;

  return (
    <div className="relative flex h-screen ">
      <div className="w-1/4 h-screen  text-white flex flex-col justify-start p-6">
        <div className="bg-gray-300 w-[286px] h-[340px] absolute top-[60px] left-[42px] p-4 border-2 border-blue-500 rounded-lg text-center opacity-100">
          <img
            src="https://s3-alpha-sig.figma.com/img/e5f6/9e92/6519f9b11503962de45e1905dcd86d59?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ORCbNiV-xpBohlrFfi8KtBX0sIWJxYcAGC3TcMBJruXZc8UivMWcO9jewSndOjAFFnli6rEHN3bqb3g5ITxf5Z~ifew8ZPfl8Up~9QKFJms~xukbJ~3luCqUaybikXMRvKfj-fwIHuc-A3~o2eWke7ORRhYcCmaqwodD3XSACLXJkLvTfWkTNYdSivgMFKzteoxRia16L-2W9JHBAbVEA0KFkFua0EpD7aKtHaTTqx3JCpr~V31WkINSt7FNXsKW9FCo8SHhCL64aRG8zxXC~y-AkyZ8M2-3yxYE-HzQj4wEBmTXw8rZh9nZgDTRucXccx1AZ7J5mpA1zd4R6MRiVw__"
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 bg-white p-2"
          />
          <div className="text-black rounded">
            <p className="overflow-auto font-semibold">Student Name: {formData.studentName}</p>
            <p className="overflow-auto font-semibold">Email:</p>
            <p className="font-semibold overflow-auto">{formData.studentEmail}</p>
            {viewOnly && outpassStatus && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Outpass Status:</p>
                {getStatusBadge(outpassStatus)}
              </div>
            )}
          </div>
        </div>

        <div className="h-screen space-y-4 mt-[480px]">
          <button
            onClick={handleBackButton}
            className="w-full py-2 bg-red-500 text-black rounded hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            Back
          </button>
          {(outpassStatus === 'pending' || outpassStatus === 'not submitted') && (
            <button
              onClick={handleDelete}
              className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              Delete
            </button>
          )}
          {viewOnly && outpassStatus === 'pending' && !isEditing && (
            <button
              onClick={handleUpdate}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              Update
            </button>
          )}
          {(!viewOnly || isEditing) && (
            <button
              onClick={handleConfirmAndNext}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Confirm and Next'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-100 min-h-fit p-10">
        <h2 className="bg-gray-900 inline-block text-2xl text-white font-semibold mb-6">
          Student Outpass Details
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col">
                        <label className="font-semibold">Student Name:</label>
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Email ID:</label>
                        <input
                            type="email"
                            name="studentEmail"
                            value={formData.studentEmail}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Contact Number:</label>
                        <input
                            type="tel"
                            name="studentContactNumber"
                            value={formData.studentContactNumber}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                            className="p-2 border rounded"
                            required
                            pattern="\d{10}"
                            title="Please enter a valid 10-digit phone number"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Parent's Name:</label>
                        <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Parent's Email ID:</label>
                        <input
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Parent's Contact Number:</label>
                        <input
                            type="tel"
                            name="parentContactNumber"
                            value={formData.parentContactNumber}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                            className="p-2 border rounded"
                            required
                            pattern="\d{10}"
                            title="Please enter a valid 10-digit phone number"
                        />
                    </div>
                    <div className="flex space-x-6">
                        <div className="flex-1 flex flex-col">
                            <label className="font-semibold">Leave From:</label>
                            <input
                                type="date"
                                name="leaveFrom"
                                value={formData.leaveFrom}
                                onChange={handleInputChange}
                                disabled={isFormDisabled}
                                className="p-2 border rounded mb-2"
                                required
                            />
                            <input
                                type="time"
                                name="leaveFromTime"
                                value={formData.leaveFromTime}
                                onChange={handleInputChange}
                                disabled={isFormDisabled}
                                className="p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="font-semibold">To:</label>
                            <input
                                type="date"
                                name="leaveTo"
                                value={formData.leaveTo}
                                onChange={handleInputChange}
                                disabled={isFormDisabled}
                                className="p-2 border rounded mb-2"
                                required
                            />
                            <input
                                type="time"
                                name="leaveToTime"
                                value={formData.leaveToTime}
                                onChange={handleInputChange}
                                disabled={isFormDisabled}
                                className="p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-8">
                        <label className="font-semibold">Reason For Absence:</label>
                        <textarea
                            name="reasonForAbsence"
                            value={formData.reasonForAbsence}
                            onChange={handleInputChange}
                            disabled={isFormDisabled}
                            className="p-2 border rounded resize-none h-32"
                            required
                        ></textarea>
                    </div>
        </form>
      </div>
    </div>
  );
}


export default StudentDetails;