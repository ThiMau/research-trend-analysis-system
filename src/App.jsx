import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Page/Login/Login";
import Dashboard from "./Page/Dashboard/Dashboard";
import ForgetPassword from "./Page/ForgetPassword/ForgetPassword";
import Register from "./Page/Register/Register";
import OTPVerification from "./Page/OTPVerification/OTPVerification";
import TrendAnalytic from "./Page/TrendAnalytic/TrendAnalytic";
import Sidebar from "./components/Sidebar/Sidebar";
import SearchBar from "./components/SearchBar/SearchBar";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<OTPVerification />}/>
                <Route path="/trend-analytic" element={
                  <div style={{ display: "flex" }}>
                    <Sidebar />
                    <div className="main-content">
        <SearchBar />
                      <TrendAnalytic />
                    </div>
                  </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;