import React, { useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
import { Reload, Rocket, Stop } from "../assets";
import { Chat, New } from "../components";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import "./style.scss";
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

const VisionView = () => {
    
  const { loading, user } = useSelector((state) => state);
  const [visions,setVisions]=useState()
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
              res = await instance.get("/api/dashboard/vision" ,{
              params: {
                id: id,
              },
            });
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
                setVisions(res.data.data)
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
    <div className="table">
    <h1>Vision View DashBoard</h1>
    <table>
      <thead>
  <tr>
  <th>Radiograph Type</th>
    <th>Input</th>
    <th>Radiograph</th>
    <th>Output</th>
    <th>Action</th>
  </tr>
  </thead>
  <tbody>
  {visions && visions.map(vision=>
        <tr key={vision.chatId}>
      <td>{vision.option.map(val=><><p>{val}</p><br/></>)}</td>
     <td>{vision.prompt.map(val=><><p>{val}</p><br/></>)}</td>
     <td>
     {vision.imageUrl.map(val=><><p><img src={`/api/${val}`} width={130} height={100}/></p><br/></>)}
     
     </td>
     <td>{vision.content.map(val=><><p>{val}</p><br/></>)}</td>
   </tr>
    )}
  </tbody>
</table>
    </div>
  );
};

export default VisionView;
