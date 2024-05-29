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
  const IMAGES = {
    image : new URL('../assets/img/ads.jpg', import.meta.url).href,
    image2 : new URL('../assets/img/ads2.jpg', import.meta.url).href
  }
  let answer=""
  const [result,setresult]=useState("")
  const [option,setOption]=useState("general")
  const genRef = useRef(null)
  const noteRef = useRef(null)
  const letRef = useRef(null)
  const path=useLocation().pathname
  const [transcript,setTranscript]=useState("")
  const FormHandle = async () => {
    try {
      const _id=-1
        const url='http://localhost:5000/api/chat'
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
          // console.log("value:",value);
          answer+=value
          chatRef?.current?.loadResponse(stateAction, answer, chatsId);
          chunks.push(value);
        }
        if(done){
        //  console.log("done",chunks)
         return
        }
      } 
     
     catch (err) {
      // console.log("error",err)
      if (err?.response?.data?.status === 405) {
        dispatch(emptyUser());
        dispatch(emptyAllRes());
        navigate("/login");
      } else {
        stateAction({ type: "error", status: true });
      }
    } finally {
      if (res) {
        // const { _id, content } = res?.data?.data;
        if(id!=-1)
         _id=id
        // console.log("id2",_id)
        dispatch(insertNew({ _id, fullContent: answer, chatsId }));
        // chatRef?.current?.loadResponse(stateAction, content, chatsId);
        stateAction({ type: "error", status: false });
      }
    }
  }

  const action=async()=>{
    let res=""
    try{
      setresult("")
      // res = await instance.post("/api/audio/", {
      //       transcript,
      //     })
      const url='http://localhost:5000/api/audio'
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
          // id=value.split(" ")[1]
          // console.log("id1",id)
        }else{
          answer+=value
          setresult(prev=>prev+value)
          // console.log("r",result)
        }
        if (done) {
          break
        }
        console.log(answer)
        console.log(result)
        // chatRef?.current?.loadResponse(stateAction, answer, chatsId);
        // chunks.push(value);
      }
      if(done){
       return
      }
        }
      
      catch(err){
        console.log("err",err)
      }
      finally{
        // console.log(res.data.data.content)
        answer=""
      }
  }
  const [type,setType]=useState('1')
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const recorderControls = useAudioRecorder()
  const addAudioElement = async(blob) => {
    console.log("blob",blob)
    const url = URL.createObjectURL(blob);
    console.log("url",url)
    const audio = document.createElement("audio");
    console.log("audio",audio)
    const params = {
      audio: url,
      speaker_labels: true
    }
    const transcript = await client.transcripts.transcribe(params)
    console.log(transcript.text)
    audio.src = url;
    audio.controls = true;
    audio.crossOrigin='cross-origin'
    document.body.appendChild(audio);
    
}
const client = new AssemblyAI({
  apiKey: 'f98b4c28f45a4a3e9ac1dc87190f904d' 
})

const audioUrl ='"C:/Users/shubh/OneDrive/Documents/Sound Recordings/Recording.m4a"'

const params = {
  audio: audioUrl,
  speaker_labels: true
}
const run = async () => {
  const transcript = await client.transcripts.transcribe(params)
  console.log(transcript.text)

  // for (let utterance of transcript.utterances!) {
  //   console.log(`Speaker ${utterance.speaker}: ${utterance.text}`)
  // }
}


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
  {type=='1' && <div className="audiobox">
      <AudioRecorder 
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        showVisualizer={true}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }} 
        downloadOnSavePress={true}
        downloadFileExtension="mp3"
      />
      {/* <button onClick={run}>run</button> */}
    </div>}
       {type=='3' && 
       <div className="inputbox">
        <textarea autoFocus placeholder="Input session audio transcript here..." type="text" onChange={(e)=>{
          setTranscript(e.target.value)
        }}/>
        <button onClick={action}>Session Analysis</button>
        <button onClick={FormHandle}>Clinical Notes</button>
       </div>}
       <div className="result">
       {/* <ReactMarkdown>{result}</ReactMarkdown> */}
       {result}
       </div>

      </div>
    </>
  );
};

export default Audio;


