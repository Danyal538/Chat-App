// import NavBar from "./components/NavBar";
// import { Routes, Route, Navigate } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import SignUpPage from "./pages/SignUpPage";
// import LoginPage from "./pages/LoginPage";
// import SettingPage from "./pages/SettingPage";
// import ProfilePage from "./pages/ProfilePage";
// import { useAuthStore } from "./store/useAuthStore";
// import { useEffect } from "react";
// import { Loader } from "lucide-react";
// import { Toaster } from "react-hot-toast"

// const App = () => {
//   const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth])
//   console.log({ authUser });

//   if (isCheckingAuth && !authUser) return (
//     <div className="flex items-center justify-center h-screen">
//       <Loader className="size-10 animate-spin" />
//     </div>
//   )
//   if (authUser) {
//     console.log("user is authenticated");
//     return (<NavBar />);
//   }
//   else if (!authUser) {
//     console.log("User is not authenticated")
//     return (<SignUpPage />)
//   }

//   return (
//     <div>
//       <NavBar />

//       <Routes>
//         <Route path="/" element={authUser ? <HomePage /> : Navigate(<LoginPage />)} />
//         <Route path="/signup" element={!authUser ? <SignUpPage /> : Navigate("/")} />
//         <Route path="/login" element={!authUser ? <LoginPage /> : Navigate("/")} />
//         <Route path="/settings" element={<SettingPage />} />
//         <Route path="/profile" element={authUser ? <ProfilePage /> : <LoginPage />} />
//       </Routes>

//       <Toaster />
//     </div>
//   );
// };

// export default App;


import NavBar from "./components/NavBar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const location = useLocation();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <div data-theme={theme}>
      {!isAuthPage && <NavBar />}

      <Routes>
        {/* ✅ Public Auth Routes */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />

        {/* ✅ Protected Routes */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingPage /> : <Navigate to="/signup" replace />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={authUser ? "/" : "/signup"} replace />}
        />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;

