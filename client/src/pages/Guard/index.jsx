import React from 'react';
import { useNavigate } from 'react-router-dom';
import Outpass from '../../components/Outpass';

function Guard(props) {
    const navigate = useNavigate();

    const handle = (value) => {
        if (props.onClick) {
            props.onClick(value);
        }
        navigate('/outpass');
    };

    return (
        <div>
            <div className="bg-gray-300 m-5 p-8 h-72 w-56">
                <img src="src/assets/images/security.jpg" alt="Security" className="rounded-full" />
                <h1 className="relative top-7 left-11 font-bold">Security</h1>
            </div>

            <button onClick={() => { navigate("/") }} className="scale-100 relative top-12 bg-yellow-500 m-5 h-10 w-56 transition duration-300 hover:scale-110 hover:bg-yellow-600 active:bg-yellow-950">
                Home Page
            </button>

            <div className="sm:left-60 sm:h-[70%] inline-block bg-white absolute top-0.5 md:left-72 m-4 max-w-7xl w-[78%] md:h-[91%]">
                <ul className="relative mt-12 m-12">
                    <li className="bg-gray-200 p-4 m-7">
                        <p className="inline-block">Outpass: </p>
                        <button value="0" onClick={() => handle("g")} className="sm:block sm:w-36 sm:left-1/4 bg-lime-500 md:inline-block sticky md:left-3/4 md:w-52 h-8 text-center scale-100 transition-transform duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950" type="button">
                            View
                        </button>
                    </li>
                    <li className="bg-gray-200 p-4 m-7">
                        <p className="inline-block">Outpass: </p>
                        <button value="1" onClick={() => handle("g")} className="sm:block sm:w-36 bg-lime-500 sm:left-1/4 md:inline-block sticky md:left-3/4 md:w-52 h-8 text-center scale-100 transition-transform duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950" type="button">
                            View
                        </button>
                    </li>
                    <li className="bg-gray-200 p-4 m-7">
                        <p className="inline-block">Outpass: </p>
                        <button value="2" onClick={() => handle("g")} className="sm:block sm:w-36 bg-lime-500 sm:left-1/4 md:inline-block sticky md:left-3/4 md:w-52 h-8 text-center scale-100 transition-transform duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950" type="button">
                            View
                        </button>
                    </li>
                    <li className="bg-gray-200 p-4 m-7">
                        <p className="inline-block">Outpass: </p>
                        <button value="3" onClick={() => handle("g")} className="sm:block sm:w-36 bg-lime-500 sm:left-1/4 md:inline-block sticky md:left-3/4 md:w-52 h-8 text-center scale-100 transition-transform duration-300 hover:scale-110 hover:bg-lime-700 active:bg-lime-950" type="button">
                            View
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Guard;
