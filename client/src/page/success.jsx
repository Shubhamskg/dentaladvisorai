import './success.scss'; 
import React, { useCallback, useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

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
function Success() {
  const [statuss, setStatuss] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const { loading, user } = useSelector((state) => state);
  let location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const chatRef = useRef();


  const { id = null } = useParams();
  const changeColorMode = (to) => {
    if (to) {
      localStorage.setItem("darkMode", true);

      document.body.className = "dark";
    } else {
      localStorage.removeItem("darkMode");

      document.body.className = "light";
    }
  };

  useLayoutEffect(() => {
    let mode = localStorage.getItem("darkMode");

    if (mode) {
      changeColorMode(true);
    } else {
      changeColorMode(false);
    }
  });

  const [status, stateAction] = useReducer(reducer, {
    chat: false,
    error: false,
    actionBtns: false,
  });
  useEffect(() => {
    if (user) {
      dispatch(emptyAllRes());
      setTimeout(() => {
        if (id) {
          const getSaved = async () => {
            let res = null;
            try {
              res = await instance.get("/api/chat/saved", {
                params: {
                  chatId: id,
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
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    // console.log("sessionId",sessionId)
    fetch(`/api/session_status?session_id=${sessionId}`)
    .then((res) => res.json())
    .then((data) => {
      setStatuss(data.status);
      setCustomerEmail(data.customer_email);
    });
}, []);
const IMAGES = {
  check : new URL('../assets/img/check_mark.png', import.meta.url).href,
}
if (statuss === 'open') {
  return (
    <Navigate to="/checkout" />
  )
}
if (statuss === 'complete') {
  return (
    <section id="success">
      <div className="boxss">
        <div className="success">
      <img src={IMAGES.check} className='ads-img' alt='check image' width={150} height={150}/>
        <h1>Payment Successful</h1>
        </div>
        <div className="payinfo">
        <p>Amount Paid : 30 GBP</p>
        <p>Transaction Id : 55445121821</p>
        </div>
      <p>
        We appreciate your business! A confirmation email will be sent to {customerEmail}.

        If you have any questions, please email <a href="mailto:dentaladvisor.ai">dentaladvisor.ai</a>.
      </p>
      </div>
    </section>
  )
}

return null;


}

export default Success