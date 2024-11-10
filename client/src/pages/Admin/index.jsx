import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();
    const [outpassRequests, setOutpassRequests] = useState([]);

    useEffect(() => {
        fetchOutpassRequests();
    }, []);

    const fetchOutpassRequests = async () => {
        try {
            const response = await fetch('http://localhost:3000/student/pendingOutpasses');
            if (response.ok) {
                const data = await response.json();
                setOutpassRequests(data);
            }
        } catch (error) {
            console.error('Error fetching outpass requests:', error);
        }
    };

    const handleView = (outpassId) => {
        navigate("/admin-outpass-view", { state: { outpassId } });
    };

    return (
        <div>
            <div className="bg-gray-300 m-5 p-8 h-72 w-56">
                <img src="src/assets/images/security.jpg" alt="none" className="rounded-full"/>
                <h1 className="relative top-7 left-7 font-bold">Admin Desk</h1>
            </div>
            
            <button 
                onClick={() => navigate("/")}
                className="scale-100 relative top-12 bg-yellow-500 m-5 h-10 w-56 transition-duration-300 hover:scale-110 hover:bg-yellow-600 active:bg-yellow-950"
            >
                Home Page
            </button>

            <div className="sm:left-60 sm:h-[70%] inline-block bg-white absolute top-0.5 md:left-72 m-4 max-w-7xl w-[78%] md:h-[91%]">
                <ul className="relative mt-12 m-12">
                    {outpassRequests.map((request) => (
                        <li key={request._id} className="bg-gray-200 p-4 m-7">
                            <p className="inline-block">
                                Outpass Request - {request.studentName}
                            </p>
                            <p className="inline-block ml-4 text-gray-600">
                                Submitted: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => handleView(request._id)}
                                className="sm:block sm:w-36 bg-lime-500 sm:left-1/4 md:inline-block sticky md:left-3/4 md:w-52 h-8 text-center scale-100 transition-transform duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950"
                                type="button"
                            >
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default Admin