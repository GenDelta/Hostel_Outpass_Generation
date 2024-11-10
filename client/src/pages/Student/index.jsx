import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Student({ email: propEmail }) {
    const location = useLocation();
    const [email, setEmail] = useState(propEmail || location.state?.email);
    const [listItems, setListItems] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Add key to track when to reload
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const loadListItems = async () => {
            try {
                if (!email) return;
                
                const response = await fetch(`http://localhost:3000/student/listItems?email=${email}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setListItems(data || []);
            } catch (error) {
                console.error('Error loading list items:', error);
                setError('Failed to load list items');
            }
        };

        loadListItems();
    }, [email, reloadKey]); // Add reloadKey to dependencies

    useEffect(() => {
        // If we're returning from confirmation page, reload the data
        if (location.state?.reload) {
            setReloadKey(prev => prev + 1);
        }
    }, [location.state]);

    const handle = (listItem) => {
        navigate('/studentdetails', { 
            state: { 
                listItemId: listItem.id,
                viewOnly: listItem.submitted,
                email: email
            }
        });
    };

    // Rest of the component remains the same...
    const createListItem = () => {
        const newItem = {
            id: Date.now().toString(),
            outpass: "Outpass",
            submitted: false
        };
        setListItems(prevItems => {
            const updatedItems = [newItem, ...prevItems];
            saveListItems(updatedItems);
            return updatedItems;
        });
    };

    const saveListItems = async (items) => {
        try {
            const response = await fetch('http://localhost:3000/student/listItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, listItems: items }),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving list items:', error);
            setError('Failed to save list items');
        }
    };

    const deleteListItem = async (id) => {
        try {
            const deleteDetailsResponse = await fetch(`http://localhost:3000/student/outpassDetails/${id}`, {
                method: 'DELETE',
            });
            
            if (!deleteDetailsResponse.ok) {
                throw new Error('Failed to delete outpass details');
            }

            const updatedItems = listItems.filter(item => item.id !== id);
            setListItems(updatedItems);
            await saveListItems(updatedItems);
        } catch (error) {
            console.error('Error deleting item:', error);
            setError('Failed to delete item');
        }
    };

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                    {error}
                </div>
            )}
            <div className="bg-gray-300 m-5 p-8 h-72 w-56">
                <img src="src/assets/images/security.jpg" alt="Student" className="rounded-full" />
                <h1 className="relative top-7 left-11 font-bold">Student</h1>
            </div>

            <button 
                onClick={() => navigate("/")} 
                className="scale-100 relative top-12 bg-yellow-500 m-5 h-10 w-56 transition duration-300 hover:scale-110 hover:bg-yellow-600 active:bg-yellow-950"
            >
                Home Page
            </button>
            <button 
                onClick={createListItem} 
                className="scale-100 relative top-32 -left-[16%] bg-green-500 h-10 w-56 transition duration-300 hover:scale-110 hover:bg-green-600 active:bg-green-950"
            >
                Create
            </button>

            <div className="sm:left-60 sm:h-[70%] inline-block bg-white absolute top-0.5 md:left-72 m-4 max-w-7xl w-[78%] md:h-[91%]">
                <ul className="relative mt-12 m-12">
                    {listItems.map(item => (
                        <li key={item.id} className="bg-gray-200 p-4 m-7">
                            <p className="inline-block">Outpass: </p>
                            <button
                                onClick={() => handle(item)}
                                className="sm:block sm:w-36 sm:left-1/4 bg-lime-500 md:inline-block sticky md:left-[90%] md:w-40 h-8 text-center scale-100 transition-transform duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950"
                                type="button"
                            >
                                {item.submitted ? 'View' : 'Enter'}
                            </button>
                            <button
                                onClick={() => deleteListItem(item.id)}
                                className="sm:block sm:w-36 sm:left-1/4 bg-red-500 md:inline-block sticky md:left-[70%] md:w-40 h-8 text-center scale-100 transition-transform duration-300 hover:scale-110 hover:bg-red-700 active:bg-red-950"
                                type="button"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default Student;