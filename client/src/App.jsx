import { useEffect, useLayoutEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import ProtectedRoute from "./protected";
import Loading from "./components/loading/loading";
import Error from "./page/Error";

// Lazy load components
const Dashboard = lazy(() => import("./page/Dashboard"));
const ChatView = lazy(() => import("./page/ChatView"));
const VisionView = lazy(() => import("./page/VisionView"));
const Forgot = lazy(() => import("./page/Forgot"));
const Login = lazy(() => import("./page/Login"));
const Main = lazy(() => import("./page/Main"));
const Signup = lazy(() => import("./page/Signup"));
const Vision = lazy(() => import("./page/Vision"));
const Payment = lazy(() => import("./page/Payment"));
const Audio = lazy(() => import("./page/Audio"));
const Success = lazy(() => import("./page/Success"));
const Patient = lazy(() => import("./page/Patient"));
const Treatmentprice = lazy(() => import("./page/Treatmentprice"));
const Patientportal = lazy(() => import("./page/Patientportal"));
const SessionDashboard = lazy(() => import("./page/SessionDashboard"));
const FeedbackRequestPage = lazy(() => import("./page/FeedbackRequestPage"));

const App = () => {
  const [offline, setOffline] = useState(!navigator.onLine);
  const { loading, user } = useSelector((state) => state);

  const changeColorMode = (isDark) => {
    localStorage.setItem("darkMode", isDark);
    document.body.className = isDark ? "dark" : "light";
  };

  useLayoutEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    changeColorMode(isDarkMode);
  }, []);

  useEffect(() => {
    const handleOnline = () => location.reload();
    const handleOffline = () => setOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (loading) return <Loading />;
  if (offline) return <Error status={503} content="Website is offline. Please check your network connection." />;

  return (
    <section className={user ? "main-grid" : null}>
      <Analytics />
      <SpeedInsights />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes that can be accessed with or without login */}
          <Route path="/treatmentprice" element={<Treatmentprice />} />
          <Route path="/feedback" element={<FeedbackRequestPage />} />
          
          <Route path="/session" element={<SessionDashboard />} />
          <Route element={<ProtectedRoute offline={offline} authed={true} />}>
            <Route path="/" element={<Main />} />
            <Route path="/chat" element={<Main />} />
            <Route path="/chat/:id" element={<Main />} />
            <Route path="/checkout" element={<Payment />} />
            <Route path="/return" element={<Success />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/vision/:id" element={<Vision />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/chat/:id" element={<ChatView />} />
            <Route path="/dashboard/vision/:id" element={<VisionView />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/audio" element={<Audio />} />
          </Route>
          <Route element={<ProtectedRoute offline={offline} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/pending/:id" element={<Signup />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/forgot/set/:userId/:secret" element={<Forgot />} />
            <Route path="/patientportal" element={<Patientportal />} />
          </Route>
          <Route path="*" element={<Error status={404} content="This page could not be found." />} />
        </Routes>
      </Suspense>
    </section>
  );
};

export default App;