import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Guard from "./pages/Guard";
import Outpass from "./components/Outpass";
import Admin from './pages/Admin';
import Login from "./pages/Login";
import Register from './pages/Register';
import Student from './pages/Student';
import StudentDetails from "./pages/Student/Studentdetails";
import ConfirmationPage from "./pages/Student/Confirmationpage";
import AdminOutpassView from "./pages/Admin/AdminOutpassView";


function App() {
  const [buttonValue, setButtonValue] = useState("");

  const getData = (data) => {
    setButtonValue(data);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/guard" element={<Guard onClick={getData} />} />
          <Route path="/outpass" element={<Outpass value={buttonValue} />} />
          <Route path="/admin" element={<Admin onClick={getData} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<StudentRoute onClick={getData} />} />
          <Route path="/studentdetails" element={<StudentDetails />} />
          <Route path="/confirmationpage" element={<ConfirmationPage />} />
          <Route path="/admin-outpass-view" element={<AdminOutpassView />} />
          
        </Routes>
      </div>
    </Router>
  );
}

function StudentRoute(props) {
  const location = useLocation();
  const { email, password } = location.state || {};

  return <Student email={email} password={password} onClick={props.onClick} />;
}

export default App;
