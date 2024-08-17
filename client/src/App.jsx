import { useEffect, useLayoutEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import ProtectedRoute from "./protected";
import Loading from "./components/loading/loading";
import Error from "./page/error";

// Lazy load components
const Dashboard = lazy(() => import("./page/dashboard"));
const ChatView = lazy(() => import("./page/chatView"));
const VisionView = lazy(() => import("./page/visionView"));
const Forgot = lazy(() => import("./page/forgot"));
const Login = lazy(() => import("./page/login"));
const Main = lazy(() => import("./page/main"));
const Signup = lazy(() => import("./page/signup"));
const Vision = lazy(() => import("./page/vision"));
const Payment = lazy(() => import("./page/payment"));
const Audio = lazy(() => import("./page/audio"));
const Success = lazy(() => import("./page/success"));
const Patient = lazy(() => import("./page/patient"));
const Treatmentprice = lazy(() => import("./page/treatmentprice"));
const Patientportal = lazy(() => import("./page/patientportal"));
const SessionDashboard = lazy(() => import("./page/session_dashboard"));
const FeedbackRequestPage = lazy(() => import("./page/feedback"));

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