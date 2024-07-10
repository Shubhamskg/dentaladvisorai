import React, { useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
import { Reload, Rocket, Stop } from "../assets";
import { Chat, New } from "../components";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import "./session_dashboard.scss";
import {Menu} from "../components";

const reducer = (state, { type, status }) => {
  switch (type) {
    case "chat":
      return {
        chat: status,
        loading: status,
        resume: status,
        actionBtns: false,
      };
    case "error":
      return {
        chat: true,
        error: status,
        resume: state.resume,
        loading: state.loading,
        actionBtns: state.actionBtns,
      };
    case "resume":
      return {
        chat: true,
        resume: status,
        loading: status,
        actionBtns: true,
      };
    default:
      return state;
  }
};

const Session_Dashboard = () => {
  const { loading, user } = useSelector((state) => state);
  const [data,setData]=useState([])
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

  let location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const chatRef = useRef();


  const { id = null } = useParams();

  const [status, stateAction] = useReducer(reducer, {
    chat: false,
    error: false,
    actionBtns: false,
  });

  useEffect(() => {
    if (true) {
      dispatch(emptyAllRes());
      setTimeout(() => {
        if (true) {
          const getSaved = async () => {
            let res = null;
            try {
              res = await instance.get("/api/session");
            } catch (err) {
              if (err?.response?.data?.status === 404) {
                navigate("/404");
              } else {
                alert(err);
                dispatch(setLoading(false));
              }
            } finally {
              if (res?.data) {
                dispatch(addList({ _id: id, items: res?.data?.data }));
                stateAction({ type: "resume", status: false });
                dispatch(setLoading(false));
                setData(res.data.data)
                console.log("data",res.data.data)
              }
            }
          };

          getSaved();
        } else {
          stateAction({ type: "chat", status: false });
          dispatch(setLoading(false));
        }
      }, 1000);
    }
  }, [location]);

  return (
    <div className="box">
    <h1 className="title">Dashboard</h1>
    <div className="box2">
    {
        data.map(item=>{
            const patient=JSON.parse(item.info)
            console.log("pa",patient.Personal)
            const personal=patient.Personal
            const session=patient.Session
            return (
            <div className="data">
            <h4>Personal</h4>
            <p>Age Group - {personal["Age Group"]}</p>
            <p>Attendance at Religious Events - {personal["Attendance at Religious Events"]}</p>
            <p>Children's Ages - {personal["Children's Ages"]}</p>
            <p>Children's Schools - {personal["Children's Schools"]}</p>
            <p>Degree Earned - {personal["Degree Earned"]}</p>
            <p>Dietary Preferences - {personal["Dietary Preferences"]}</p>
            <p>Education Level - {personal["Education Level"]}</p>
            <p>Employer Size (Small, Medium, Large) - {personal["Employer Size (Small, Medium, Large)"]}</p>
            <p>Fitness and Wellness Activities - {personal["Fitness and Wellness Activities"]}</p>
            <p>Gender - {personal["Gender"]}</p>
            <p>Hobbies and Interests - {personal["Hobbies and Interests"]}</p>
            <p>Home Ownership Status - {personal["Home Ownership Status"]}</p>
            <p>Household Size - {personal["Household Size"]}</p>
            <p>Income Bracket - {personal["Income Bracket"]}</p>
            <p>Industry - {personal["Industry"]}</p>
            <p>Insurance Provider - {personal["Insurance Provider"]}</p>
            <p>Location/Zip Code - {personal["Location/Zip Code"]}</p>
            <p>Marital Status - {personal["Marital Status"]}</p>
            <p>Membership in Local Organizations or Clubs - {personal["Membership in Local Organizations or Clubs"]}</p>
            <p>Number of Children - {personal["Number of Children"]}</p>
            <p>Occupation - {personal["Occupation"]}</p>
            <p>Online Review Activity - {personal["Online Review Activity"]}</p>
            <p>Participation in Loyalty Programs - {personal["Participation in Loyalty Programs"]}</p>
            <p>Personal interests - {personal["Personal interests"]}</p>
            <p>Preferred Brands (Products/Services) - {personal["Preferred Brands (Products/Services)"]}</p>
            <p>Preferred Travel Destinations - {personal["Preferred Travel Destinations"]}</p>
            <p>Religious Affiliation - {personal["Religious Affiliation"]}</p>
            <p>Smoking Status - {personal["Smoking Status"]}</p>
            <p>Social Media Usage - {personal["Social Media Usage"]}</p>
            <p>Special Health Conditions (e.g., Diabetes, Heart Conditions) - {personal["Special Health Conditions (e.g., Diabetes, Heart Conditions)"]}</p>
            <p>Technology Usage (e.g., Smartphone, Tablet) - {personal["Technology Usage (e.g., Smartphone, Tablet)"]}</p>
            <p>Travel Frequency - {personal["Travel Frequency"]}</p>
            <p>Type of Residence (Apartment, House, etc.) - {personal["Type of Residence (Apartment, House, etc.)"]}</p>
            <p>University Attended - {personal["University Attended"]}</p>
        
            <br/>
            </div>
        )
        }
        )
    }


    </div>
    </div>
  );
};

export default Session_Dashboard;
