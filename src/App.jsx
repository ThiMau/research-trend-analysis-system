import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Page/Login/Login";
import Dashboard from "./Page/Dashboard/Dashboard";
import ForgetPassword from "./Page/ForgetPassword/ForgetPassword";
import Register from "./Page/Register/Register";
import OTPVerification from "./Page/OTPVerification/OTPVerification";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<OTPVerification />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;