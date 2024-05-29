import React, { useCallback, useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
import { Reload, Rocket, Stop, Tick } from "../assets";
import { Ads,Chat, New } from "../components";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import "./audio.scss";
import {Menu} from "../components";
import ReactDOM from "react-dom/client";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import ReactMarkdown from 'react-markdown';
import Speech from "./speech";
import { AssemblyAI } from 'assemblyai'
import axios from "axios";
import {MediaRecorder, register} from 'extendable-media-recorder';
import {connect} from 'extendable-media-recorder-wav-encoder';
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

const Audio = () => {
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
  const audioRef=useRef();


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
  let answer=""
  const [sentiment,setSentiment]=useState("")
  const [transcript,setTranscript]=useState("")
  const [clinicalnotes,setClinicalnotes]=useState("")
  const [resulttype,setResulttype]=useState(2)
  const genRef = useRef(null)
  const noteRef = useRef(null)
  const letRef = useRef(null)
  const path=useLocation().pathname
  
  const FormHandle = async () => {
    let res;
    try {
      const _id=-1
        const url='http://server.dentaladvisor.ai/api/chat'
      const data = {
        chatId: _id,
        prompt: transcript,
        option: "notes",
        type: "Treatment Note"
      };
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    }
    res = await fetch(url, request)
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done, value;
        while (!done) {
          ({ value, done } = await reader.read());
          value = decoder.decode(value);
          if (done) {
            break
          }
          answer+=value
          setClinicalnotes(prev=>prev+value)
        }
        if(done){
         return
        }
      } 
     
     catch (err) {
      console.log("err",err)
    } finally {
      if (res) {
       
      }
    }
  }

  const action=async()=>{
    let res=""
    try{
      setSentiment("")
      const url='https://server.dentaladvisor.ai/api/audio/transcript'
      console.log(transcript)
      const data = {
        transcript: transcript
      };
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    }
    res = await fetch(url, request)
    const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done, value;
     
      while (!done) {
        ({ value, done } = await reader.read());
        value = decoder.decode(value);
        console.log("val:",value)
        if(value.includes("[stop]")){
        }else{
          answer+=value
          setSentiment(prev=>prev+value)
        }
        if (done) {
          break
        }
        console.log(answer)
        console.log(sentiment)
      }
      if(done){
       return
      }
        }
      
      catch(err){
        console.log("err",err)
      }
      finally{
        answer=""
      }
  }
  const [type,setType]=useState('1')
  const [audiofile,setAudiofile]=useState()
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const recorderControls = useAudioRecorder()
  const addAudioElement = async(blob) => {
    console.log("blob",blob)
    const url = URL.createObjectURL(blob);
    const audiobox=document.getElementById("audiobox")
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    audiobox.appendChild(audio);
    const formData = new FormData();
          formData.append('audioBlob', blob);
          try {
            const response = await instance.post('/api/audio/recording', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('Audio uploaded and processed successfully:', response.data);
            setTranscript(response.data.data.content)
          } catch (error) {
            console.error('Error uploading audio:', error);
          }
}
const uploadAudiofile=async(e)=>{
  const formData = new FormData();
          formData.append('audioBlob', audiofile);
          try {
            const response = await instance.post('/api/audio/uploadfile', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('Audio uploaded and processed successfully:', response.data);
            setTranscript(response.data.data.content)
          } catch (error) {
            console.error('Error uploading audio:', error);
          }
}
useEffect(()=>{
  action()
},[transcript])


  return (
    <>
    <div className="main">
      <div className="navbar">
        <button className="option_button" ref={genRef} onClick={()=>{setOption("general");if(path!='/')navigate("/"); genRef.current.classList.add("active"), noteRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Dental GPT</button>
        <button className="option_button" ref={noteRef} onClick={()=>{setOption("notes");if(path!='/')navigate("/");  noteRef.current.classList.add("active"),genRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Clinical Notes</button>
        <button className="option_button" ref={letRef} onClick={()=>{setOption("letters");if(path!='/')navigate("/"); letRef.current.classList.add("active"),noteRef.current.classList.remove("active"), genRef.current.classList.remove("active")}}>Patient Letters</button>
        {/* <button className="option_button"  onClick={()=>{navigate("/treatmentprice")}}>Treatment Price</button> */}
        {/* <button className="option_button"  onClick={()=>{navigate("/patient")}}>Patient Portal</button> */}
        {/* <button onClick={()=>{navigate("/vision")}} className="option_button">Radiograph</button> */}
         <button className="option_button active" ref={audioRef} onClick={()=>{navigate("/audio");
         }}>Dental Audio</button>
      </div>
    </div>
    <div className="contentAre">
    <div className="typebox">
    <label htmlFor="type">Select Input Type</label>
    <select className="form-control" onChange={handleTypeChange} id="type">
      <option value='1' >Record Session</option>
      <option value='2'>Input audio file</option>
      <option value='3'>Input session transcript</option>
    </select>
  </div>
  {type=='1' && <div id='audiobox' className="audiobox">
      <AudioRecorder 
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        showVisualizer={true}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }} 
        downloadFileExtension="mp3"
      />
    </div>}
    {type=='2' && <div className="upload">
    <label htmlFor="upload">Upload session audio</label>
<input type="file" id="upload" name="myfile" onChange={(e)=>{
  console.log(e.target.files[0])
  setAudiofile(e.target.files[0])
  console.log(e.target.result)
}}/>
<button onClick={uploadAudiofile}>Upload</button>

      </div>}
       {type=='3' && 
       <div className="inputbox">
        <textarea autoFocus placeholder="Input session audio transcript here..." type="text" onChange={(e)=>{
          setTranscript(e.target.value)
        }}/>
        <button onClick={action}>Submit</button>
       </div>}
       <div className="content">
       {/* <div className="resulttype">
        <button className="active">Transcript</button>
        <button >Sentiment Analysis</button>
        <button >Clinical Notes</button>
       </div> */}
       {transcript && 
    <div className="result">
      <div className="transcript">
      <h3>Transcript</h3>
       <p>{transcript}</p>
       </div>
       <div className="sentiment">
      <h3>Sentiment</h3>
       <p>{sentiment}</p>
       </div>
       {/* <div className="clinicalnotes">
      <h3>Clinical Notes</h3>
       <p>{clinicalnotes}</p>
       </div> */}
       
       </div>}
       </div>
       

      </div>
    </>
  );
};

export default Audio;


