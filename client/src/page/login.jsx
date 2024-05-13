import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GptIcon } from "../assets";
import { LoginComponent } from "../components";
import { setLoading } from "../redux/loading";
import "./style.scss";
import FormFeild from '../components/auth/FormFeild'

const Login = () => {
  const IMAGES = {
    image : new URL('../../public/favicon.png', import.meta.url).href
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
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } else {
        setAuth(false);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      }
    }
  }, [location]);
  const types = ["dentists", "patients"];
  const [logintype, setLogintype] = useState("dentists");

  const switchType = (val) => {
    setLogintype(val);
  };

  return (
    <div className="Auth">
      <div className="inner">
      <div className="nav">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={logintype === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      </div>
      {logintype==="dentists"?<div>
        {auth ? (
          <LoginComponent />
        ) : (
          <div className="suggection">
            <br/>
            <br/>
            <div>
              <img src={IMAGES.image} alt='first image'/>
            </div>

            <div>
              <p>Welcome to Dental Advisor</p>
              <p>Log in with your Dental Advisor account to continue</p>
            </div>
            <br/>
            <br/>
            
        
            <div className="btns">
              <button
                onClick={() => {
                  navigate("/login/auth");
                }}
              >
                Log in
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </button>
            </div>
          </div>
        )}</div>
        :<div>
          <br/>
          <br/>
          <br/>
          <div className="form">
          <input type="text" placeholder="Patient name"/>
          <input type="text" placeholder="Patient Email Address"/>
          <input type="text" placeholder="Practice Name"/>
          <input type="text" placeholder="Dentist Name"/>
          <button onClick={()=>{
            navigate("/patientportal")
          }}>Submit</button>
          </div>

        </div>
      }
<br/>
<br/>
        <div className="bottum">
          <div className="start">
            <a href="" target="_blank">
              Terms of use
            </a>
          </div>
          <div className="end">
            <a
              href=""
              target="_blank"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
