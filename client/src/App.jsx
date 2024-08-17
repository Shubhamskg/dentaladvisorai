import { useEffect, useLayoutEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard,ChatView,VisionView,Error, Forgot, Login, Main, Signup ,Vision, Payment,Audio, Success,Patient,Treatmentprice, Patientportal,SessionDashboard,FeedbackRequestPage} from "./page";
import { useSelector } from "react-redux";
import ProtectedRoute from "./protected";
import Loading from "./components/loading/loading";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
const App = () => {
  const [offline, setOffline] = useState(!window.navigator.onLine);

  const { loading, user } = useSelector((state) => state);

  const changeColorMode = (to) => {
    if (to) {
      localStorage.setItem("darkMode", true);

      document.body.className = "dark";
    } else {
      localStorage.removeItem("darkMode");

      document.body.className = "light";
    }
  };

  // Dark & Light Mode
  useLayoutEffect(() => {
    let mode = localStorage.getItem("darkMode");

    if (mode) {
      changeColorMode(true);
    } else {
      changeColorMode(false);
    }
  });

  // Offline
  useEffect(() => {
    window.addEventListener("online", (e) => {
      location.reload();
    });

    window.addEventListener("offline", (e) => {
      setOffline(true);
    });
  });

  return (
    <section className={user ? "main-grid" : null}>
    <Analytics/>
    <SpeedInsights/>
      
      {/* {loading && <Loading />} */}

      {offline && (
        <Error
          status={503}
          content={"Website in offline check your network."}
        />
      )}
      <Routes>
      <Route path="/session" element={<SessionDashboard/>}/>
        <Route element={<ProtectedRoute offline={offline} authed={true} />}>
          <Route exact path="/" element={<Main />} />
          <Route path="/chat" element={<Main />} />
          <Route path="/chat/:id" element={<Main />} />
          <Route path="/checkout" element={<Payment/>}/>
          <Route path="/return" element={<Success/>}/>
          <Route path="/vision" element={<Vision/>}/>
          <Route path="/vision/:id" element={<Vision/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/dashboard/chat/:id" element={<ChatView/>}/>
          <Route path="/dashboard/vision/:id" element={<VisionView/>}/>
          <Route path="/patient" element={<Patient/>}/>
          <Route path="/audio" element={<Audio/>}/>
          <Route path="/treatmentprice" element={<Treatmentprice/>}/>
        </Route>

        <Route element={<ProtectedRoute offline={offline} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login/auth" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/pending/:id" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/forgot/set/:userId/:secret" element={<Forgot />} />
          <Route path="/patientportal" element={<Patientportal/>}/>
          <Route path="/feedback" element={<FeedbackRequestPage/>}/>
          <Route path="/treatmentprice" element={<Treatmentprice/>}/>
        </Route>
        <Route
          path="*"
          element={
            <Error status={404} content={"This page could not be found."} />
          }
        />
      </Routes>
    </section>
  );
};

export default App;
