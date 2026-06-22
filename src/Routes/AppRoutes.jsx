import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../Page/Login/Login";
import Register from "../Page/Register/Register";
import ForgetPassword from "../Page/ForgetPassword/ForgetPassword";
import OTPVerification from "../Page/OTPVerification/OTPVerification";

import Dashboard from "../Page/Dashboard/Dashboard";
import Search from "../Page/Search/Search";
import TrendAnalytic from "../Page/TrendAnalytic/TrendAnalytic";
import MyLibrary from "../Page/MyLibrary/MyLibrary";
import Report from "../Page/Report/Report";

import PaperDetail from "../Page/PaperDetail/PaperDetail";
import AuthorDetail from "../Page/AuthorDetail/AuthorDetail";
import JournalDetail from "../Page/JournalDetail/JournalDetail";
import ResetPassword from "../Page/ResetPassword/ResetPassword";
import ChangePassword from "../Page/ChangePassword/ChangePassword";
import ProtectedRoute from "./ProtectedRoute";

import Sidebar from "../components/Sidebar/Sidebar";
import SearchBar from "../components/SearchBar/SearchBar";

function MainLayout({ children, showSearchInput = true }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "5px 0",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "80vw",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <SearchBar showInput={showSearchInput} />
          {children}
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ================= */}

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forget-password"
          element={<ForgetPassword />}
        />

        <Route
          path="/verify-email"
          element={<OTPVerification />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ================= MAIN ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <MainLayout showSearchInput={false}>
                <Search />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trend-analytic"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TrendAnalytic />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-library"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyLibrary />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= DETAIL ================= */}

        <Route
          path="/papers/:paperId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PaperDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/authors/:authorId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AuthorDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/journals/:journalId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <JournalDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ChangePassword />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Report />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;