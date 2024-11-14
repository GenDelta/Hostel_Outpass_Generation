import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Student({ email: propEmail }) {
    
    const location = useLocation();
    const [email, setEmail] = useState(propEmail || location.state?.email);
    const [listItems, setListItems] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    const getListItems = async () => {
        try {
            if (!email) return;
            
            const response = await fetch(`http://localhost:3000/student/listItems?email=${email}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            
            const processedItems = data.map(item => ({
                ...item,
                submitted: item.submitted || false
            }));
            
            setListItems(processedItems);
        } catch (error) {
            console.error('Error loading list items:', error);
            setError('Failed to load list items');
        }
    };

    useEffect(() => {
        getListItems();
    }, [email, reloadKey]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setReloadKey(prev => prev + 1);
        }, 30000); 

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (location.state?.reload) {
            setReloadKey(prev => prev + 1);
        }
    }, [location.state]);

    const handle = (listItem) => {
        navigate('/studentdetails', { 
            state: { 
                listItemId: listItem.id,
                outpassId: listItem.outpassId,
                viewOnly: listItem.submitted,
                email: email
            }
        });
    };

    const createListItem = () => {
        const newItem = {
            id: Date.now().toString(),
            outpass: "Outpass",
            submitted: false,
            outpassId: null
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
            const itemToDelete = listItems.find(item => item.id === id);
            if (itemToDelete?.outpassId) {
                const deleteDetailsResponse = await fetch(
                    `http://localhost:3000/student/outpassDetails/${itemToDelete.outpassId}`,
                    { method: 'DELETE' }
                );
                
                if (!deleteDetailsResponse.ok) {
                    throw new Error('Failed to delete outpass details');
                }
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
                            <div className="mb-2">
                                <p className="inline-block">Outpass</p>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => handle(item)}
                                    className="bg-lime-500 px-4 py-2 rounded text-white scale-100 transition-transform duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950"
                                    type="button"
                                >
                                    {item.submitted ? 'View' : 'Enter'}
                                </button>
                                <button
                                    onClick={() => deleteListItem(item.id)}
                                    className="bg-red-500 px-4 py-2 rounded text-white scale-100 transition-transform duration-300 hover:scale-110 hover:bg-red-700 active:bg-red-950"
                                    type="button"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Student;