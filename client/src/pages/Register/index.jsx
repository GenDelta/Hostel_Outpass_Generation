import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        prn: '',
        email: '',
        password: '',
        photo: null
    });

    const [errors, setErrors] = useState({
        name: '',
        prn: '',
        email: '',
        password: '',
        photo: ''
    });

    
    const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
    const validatePRN = (prn) => /^\d{11}$/.test(prn);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'name' && !validateName(value)) {
            setErrors({ ...errors, name: 'Only alphabetic letters allowed' });
        } else if (name === 'prn' && !validatePRN(value)) {
            setErrors({ ...errors, prn: 'PRN must be 11 digits' });
        } else if (name === 'email' && !validateEmail(value)) {
            setErrors({ ...errors, email: 'Invalid email address' });
        } else if (name === 'password' && value.length < 6) {
            setErrors({ ...errors, password: 'Password must be at least 6 characters' });
        } else {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 1048576) { // 1MB in bytes
            setFormData({ ...formData, photo: file });
            setErrors({ ...errors, photo: '' });
        } else {
            setErrors({ ...errors, photo: 'File size should be up to 1MB' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to send files
        const data = new FormData();
        data.append('name', formData.name);
        data.append('prn', formData.prn);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('photo', formData.photo);

        try {
            const response = await fetch('http://localhost:3000/student/register', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                console.log("Form submitted:", formData);
                // Redirect to the login page after successful registration
                navigate('/');
            } else {
                console.log("Error submitting form:", response.statusText);
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.log("Error submitting form:", error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" 
        style={{ backgroundImage: 'url("/path-to-your-image/image.png")' }}>
            <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Student Registration</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">PRN</label>
                    <input 
                        type="text" 
                        name="prn" 
                        value={formData.prn} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.prn && <span className="text-red-500 text-sm">{errors.prn}</span>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                    <input 
                        type="file" 
                        name="photo" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.photo && <span className="text-red-500 text-sm">{errors.photo}</span>}
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
