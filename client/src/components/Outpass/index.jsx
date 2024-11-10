import React from 'react';
import { useNavigate } from 'react-router-dom';
import Guard from '../../pages/Guard';

import Admin from '../../pages/Admin';

function Outpass(props) {
    const navigate = useNavigate();

    const confirmreq = () => {
        alert("You have confirmed this request");
        navigate("/admin");
    };

    const rejectreq = () => {
        document.getElementById("confirm").style.display = "none";
        document.getElementById("reject").style.display = "none";
        const backButton = document.getElementById("back");
        backButton.innerText = "Confirm";
        backButton.onclick = () => {
            alert("You have successfully rejected the outpass request");
            navigate('/admin')
        };
    };

    const handle = () => {
        const backButton = document.getElementById("back");
        if (props.value.includes("a") && backButton.innerText.toLowerCase() === "back") {
            navigate('/admin');
        } else if (props.value.includes("g") && backButton.innerText.toLowerCase() === "back") {
            navigate('/guard');
        }
    };

    const isAdmin = props.value.includes("a");
    const isGuard = props.value.includes("g");

    const adminClasses = isAdmin ? "relative top-7 left-7 font-bold" : "hidden relative top-7 left-7 font-bold";
    const guardClasses = isGuard ? "relative top-7 left-11 font-bold" : "hidden relative top-7 left-11 font-bold";
    const rejectClasses = isAdmin ? "mb-8 text-white scale-100 relative top-20 bg-red-600 m-5 h-10 w-56 transition duration-300 hover:scale-110 hover:bg-red-700 active:bg-red-950" : "hidden";
    const confirmClasses = isAdmin ? "text-white scale-100 absolute bg-lime-500 m-5 h-10 w-56 transition duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950" : "hidden";

    console.log(props.value);

    return (
        <div>
            <div className="bg-gray-300 m-5 p-8 h-72 w-56">
                <img src="src/assets/images/security.jpg" alt="Security" className="rounded-full" />
                <h1 className={guardClasses}>Security</h1>
                <h1 className={adminClasses}>Admin Desk</h1>
            </div>

            <button onClick={confirmreq} id="confirm" className={confirmClasses}>
                Confirm request
            </button>

            <button onClick={rejectreq} id="reject" className={rejectClasses}>
                Reject
            </button>

            <button onClick={handle} id="back" className="block text-white scale-100 relative top-16 bg-red-600 m-5 h-10 w-56 transition duration-300 hover:scale-110 hover:bg-red-700 active:bg-red-950">
                Back
            </button>

            <div className="inline-block bg-gray-300 absolute top-0 left-72 m-2 max-w-7xl w-[80%] h-[100%]">
                <div className="w-[36%] h-12 bg-blue-950 absolute m-4 text-white pt-2 pl-4">
                    Outpass Details
                </div>
                <div className="flex flex-col bg-gray-100 w-[97%] h-[85%] absolute top-20 left-4">
                    <div className="flex flex-col absolute top-10 ml-4 gap-5 w-[97%] h-[75%]">
                        <div className="bg-gray-300 w-[95%]">Student Name:</div>
                        <div className="bg-gray-300 w-[95%]">Email ID:</div>
                        <div className="bg-gray-300 w-96">Contact Number:</div>
                        <div className="bg-gray-300 w-[95%]">Parent's Name:</div>
                        <div className="bg-gray-300 w-[95%]">Email ID:</div>
                        <div className="bg-gray-300 w-96">Contact Number:</div>
                    </div>
                    <div className="flex flex-col absolute top-80 ml-5 gap-3">
                        <div className="bg-gray-300 w-32">Leave From:</div>
                        <div className="bg-gray-300 w-44">Date:</div>
                        <div className="bg-gray-300 w-44">Time:</div>
                    </div>
                    <div className="flex flex-col absolute top-80 ml-5 left-2/4 gap-3">
                        <div className="bg-gray-300 w-32">To:</div>
                        <div className="bg-gray-300 w-44">Date:</div>
                        <div className="bg-gray-300 w-44">Time:</div>
                    </div>
                    <div className="inline bg-gray-300 w-44 absolute top-3/4 ml-5">Reason for leave</div>
                    <div className="bg-gray-300 w-[95%] h-14 absolute top-[83%] ml-5"></div>
                </div>
            </div>
        </div>
    );
}

export default Outpass;
