// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { GptIcon } from "../assets";
// import { LoginComponent } from "../components";
// import { setLoading } from "../redux/loading";
// import "./style.scss";

// const Login = () => {
//   const IMAGES = {
//     image : new URL('../../public/favicon.png', import.meta.url).href
// }
//   const location = useLocation();

//   const [auth, setAuth] = useState(false);

//   const { user } = useSelector((state) => state);

//   const dispatch = useDispatch();

//   const navigate = useNavigate();
  

//   useEffect(() => {
//     if (!user) {
//       if (location?.pathname === "/login/auth") {
//         setAuth(true);
//         setTimeout(() => {
//           dispatch(setLoading(false));
//         }, 1000);
//       } else {
//         setAuth(false);
//         setTimeout(() => {
//           dispatch(setLoading(false));
//         }, 1000);
//       }
//     }
//   }, [location]);
//   const types = ["dentists", "patients"];
//   const [logintype, setLogintype] = useState("dentists");

//   const switchType = (val) => {
//     setLogintype(val);
//   };

//   return (
//     <div className="Auth">
//       <div className="inner">
//       <div className="nav">
//       <div className="type">
//         {types.map((type) => (
//           <button
//             key={type}
//             // onClick={() => switchType(type)}
//             className={logintype === type ? "active" : ""}
//           >
//             {type}
//           </button>
//         ))}
//       </div>
//       </div>
//       {logintype==="dentists"?<div>
//         {auth ? (
//           <LoginComponent />
//         ) : (
//           <div className="suggection">
//             <br/>
//             <br/>
//             <div>
//               <img src={IMAGES.image} alt='first image'/>
//             </div>

//             <div>
//               <p>Welcome to Dental Advisor</p>
//               <p>Log in with your Dental Advisor account to continue</p>
//               <br></br>
//               <br></br>
//               <p>by <b>Trajectory Health Limited</b></p>
//             </div>
//             <br/>
//             <br/>
            
        
//             <div className="btns">
//               <button
//                 onClick={() => {
//                   navigate("/login/auth");
//                 }}
//               >
//                 Log in
//               </button>
//               <button
//                 onClick={() => {
//                   navigate("/signup");
//                 }}
//               >
//                 Sign up
//               </button>
//             </div>
//           </div>
//         )}</div>
//         :<div>
//           <br/>
//           <br/>
//           <br/>
//           <div className="form">
//           <input type="text" placeholder="Patient name"/>
//           <input type="text" placeholder="Patient Email Address"/>
//           <input type="text" placeholder="Practice Name"/>
//           <input type="text" placeholder="Dentist Name"/>
//           <button 
//           // onClick={()=>{
//           //   navigate("/patientportal")
//           // }}
//           >Submit</button>
//           </div>

//         </div>
//       }
// <br/>
// <br/>
//         <div className="bottum">
//           <div className="start">
//             <a href="" target="_blank">
//               Terms of use
//             </a>
//           </div>
//           <div className="end">
//             <a
//               href=""
//               target="_blank"
//             >
//               Privacy Policy
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginComponent } from "../components";
import { setLoading } from "../redux/loading";
import "./Login.scss";

const Login = () => {
  const IMAGES = {
    logo: new URL('../../public/favicon.png', import.meta.url).href
  }

  const location = useLocation();
  const [auth, setAuth] = useState(false);
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (location?.pathname === "/login/auth") {
        setAuth(true);
      } else {
        setAuth(false);
      }
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 1000);
    }
  }, [location, user, dispatch]);

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <img src={IMAGES.logo} alt="Dental Advisor Logo" className="auth-logo" />
          <h1>Dental Advisor</h1>
        </div>
        
        {auth ? (
          <LoginComponent />
        ) : (
          <div className="auth-welcome">
            <h2>Welcome to Dental Advisor</h2>
            <p>Log in with your Dental Advisor account to continue</p>
            <div className="auth-buttons">
              <button onClick={() => navigate("/login/auth")} className="btn-primary">
                Log in
              </button>
              <button onClick={() => navigate("/signup")} className="btn-secondary">
                Sign up
              </button>
            </div>
            <p className="auth-footer">by <strong>Trajectory Health Limited</strong></p>
          </div>
        )}
        
        <div className="auth-links">
          <a href="#" target="_blank" rel="noopener noreferrer">Terms of use</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Login;