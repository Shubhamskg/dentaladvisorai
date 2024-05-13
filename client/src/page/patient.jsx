import React, { useCallback, useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
import { Reload, Rocket, Stop, Tick } from "../assets";
import { Ads,Chat, New } from "../components";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import "./patient.scss";
import {Menu} from "../components";
import { categoryName } from "../lib/data"
import axios from "axios";
import { DensityChart } from "../components/charts/DensityChart";
import DataGridDemo from "../components/mui/patient";





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

const Patient = () => {
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
  const [option,setOption]=useState("general")
  const genRef = useRef(null)
  const noteRef = useRef(null)
  const letRef = useRef(null)
  const path=useLocation().pathname



  const [mini,setMini]=useState(0)
  const [maxi,setMaxi]=useState(0)
  const [avg,setAvg]=useState(0)
  const [postcode,setPostcode]=useState("AB101XG")
  const [distance,setDistance]=useState(300)
  const [category,setCategory]=useState("airflow")
  const [Data,setData]=useState([])
  const [show,setShow]=useState(false)
  const [fdata,setFdata]=useState({distance:0})
  const [latlong,setLatlong]=useState([51.5074,-0.1278])
  const [clinicsdata,setClinicsdata]=useState([])
  const [config,setConfig]=useState({size:5,sortby:0,sortin:0})

  const handleSubmit = async () => {
    let res = null;
    try {
      res = await axios.get("http://localhost:5001/api/data", {
        params: {
          categoryName: category,
          postcode:postcode.replaceAll(' ','').toUpperCase(),
          distance:distance
        },
      });
    } catch (err) {
      if (err?.response?.data?.status === 404) {
        alert("404")
      } else {
        alert(err)
        console.log("err",err)
      }
    } finally {
      if (res?.data) {
        let datas=[]
        let clinicsdatas=[]
        setFdata({category,distance,postcode})
        setCategory("")
        setPostcode("")
        setDistance("")
        setMini(res.data.mini!=1000000?res.data.mini:0)
        setMaxi(res.data.maxi)
        setAvg(Math.round(res.data.sum/(res.data.clinicsdata.length!=0?res.data.clinicsdata.length:1)))
        for(let i=0;i<res.data.clinicsdata.length;i++){
          datas.push(res.data.clinicsdata[i].price)
          clinicsdatas.push({
            price:res.data.clinicsdata[i].price,
            clinicName:res.data.clinicsdata[i].clinicName,
            treatment:res.data.clinicsdata[i].treatment,
            website:res.data.clinicsdata[i].website,
            postcode:res.data.clinicsdata[i].postcode,
            dist:res.data.clinicsdata[i].dist,
            ogdata:res.data.clinicsdata[i].ogdata
          })
        }
        setData(datas)
        console.log("data",clinicsdatas)
        setShow(true)
        setLatlong([res.data.lat1,res.data.long1])
        setClinicsdata(clinicsdatas)
      }
    }
} 



  return (
    <>
    {user && (
        <div>
          {/* <Menu changeColorMode={changeColorMode} /> */}
        </div>
      )}
    <div className="main">
      <div className="navbar">
        <button className="option_button" ref={genRef} onClick={()=>{setOption("general");if(path!='/')navigate("/"); genRef.current.classList.add("active"), noteRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Dental GPT</button>
        <button className="option_button" ref={noteRef} onClick={()=>{setOption("notes");if(path!='/')navigate("/");  noteRef.current.classList.add("active"),genRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Clinical Notes</button>
        <button className="option_button" ref={letRef} onClick={()=>{setOption("letters");if(path!='/')navigate("/"); letRef.current.classList.add("active"),noteRef.current.classList.remove("active"), genRef.current.classList.remove("active")}}>Patient Letters</button>
        <button className="option_button"  onClick={()=>{setOption("price"); navigate("/treatmentprice")}}>Treatment Price</button>
        <button className="option_button active"  onClick={()=>{navigate("/patient")}}>Patient Portal</button>

      </div>
      </div>
      
      <div className="contentsArea-patient">
        <div className="cover"></div>
   <DataGridDemo/>

    </div>

   
    
    </>
  );
};

export default Patient;


