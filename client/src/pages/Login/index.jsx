import React from "react";
import { useNavigate } from 'react-router-dom';

import { Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    function Show(event) {
        event.preventDefault();
        const pass = document.getElementById("password");
        const show = document.getElementById("show");
        if (pass.type === "password") {
            pass.type = "text";
            show.innerText = "Hide";
        } else {
            pass.type = "password";
            show.innerText = "Show";
        }
    }

    async function Redirect(event) {
        event.preventDefault();

        const Admin = document.getElementById("Admin");
        const Student = document.getElementById("Student");
        const Security = document.getElementById("Security");
        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;

        if (email !== "" && pass !== "" && (Admin.checked || Student.checked || Security.checked)) {
            try {
                const response = await fetch('http://localhost:3000/student/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password: pass }),
                });

                const data = await response.json();

                if (response.ok) {
                    if (Admin.checked) {
                        navigate('/admin');
                    } else if (Student.checked) {
                        navigate('/student', { state: { email, password: pass } });
                    } else if (Security.checked) {
                        navigate('/guard');
                    }
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred. Please try again.');
            }
        } else {
            if (email === "") {
                alert("Please enter your email");
            }
            if (pass === "") {
                alert("Please enter your password");
            }
            if (!(Admin.checked || Student.checked || Security.checked)) {
                alert("Please select an option");
            }
        }
    }

    return (
        <div className="bg-sit bg-no-repeat bg-cover">
            <div className="w-screen h-screen"></div>
            <div className="shadow-xl shadow-black bg-green-100 absolute top-60 left-[36%] rounded-lg w-96 h-60">
                <form onSubmit={Redirect}>
                    <h1 className="relative top-4 left-[45%] font-bold">Login</h1>
                    <div className="flex gap-3 pt-6">
                        <label className="pl-4" htmlFor="Admin">Login as: </label>
                        <input className="" type="radio" name="Input" id="Admin" />Admin
                        <input type="radio" name="Input" id="Student" />Student
                        <input type="radio" name="Input" id="Security" />Security
                    </div>
                    <div className="pt-6 flex">
                        <label className="pl-4 inline pr-2" htmlFor="email">Enter your Email:</label>
                        <input className="inline w-[55%]" id='email' type="email" />
                    </div>
                    <div className="pt-6 flex">
                        <label className="pl-4 inline pr-2" htmlFor="password">Password:</label>
                        <input className="inline w-[48%]" id='password' type="password" />
                        <button onClick={Show} id="show" className="shadow-md shadow-black text-white ml-5 w-16 bg-slate-400 rounded-md transition-all duration-300 hover:scale-110 hover:bg-slate-600 active:bg-slate-800">Show</button>
                    </div>
                    <input className="shadow-md shadow-black absolute top-[76%] bg-red-400 left-[40%] w-20 rounded-md transition-all duration-300 hover:scale-110 hover:bg-red-600 active:bg-red-800" type="submit" value="Submit" />
                </form>
                <Link className="transition-all duration-300 hover:[text-shadow:_0_1px_0_var(--tw-shadow-color)] relative top-8 ml-4 underline" to="/register">Register</Link>
            </div>
        </div>
    );
}

export default Login;
