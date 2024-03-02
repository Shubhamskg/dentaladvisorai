import React, { useEffect,useLayoutEffect, useReducer, useRef, useState } from "react";
import { Reload, Rocket, Stop, Tick,VoiceRecognitionButton } from "../assets";
import { Ads,Chat, New } from "../components";
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

const Main = () => {
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
  const IMAGES = {
    image : new URL('../assets/img/ads.jpg', import.meta.url).href,
    image2 : new URL('../assets/img/ads2.jpg', import.meta.url).href
  }
  const [option,setOption]=useState("general")
  const genRef = useRef(null)
  const noteRef = useRef(null)
  const letRef = useRef(null)
 

  return (
    <>
    {user && (
        <div>
          <Menu changeColorMode={changeColorMode} />
        </div>
      )}
    <div className="main">
      
      <div className="navbar">
        <button className="option_button active" ref={genRef} onClick={()=>{setOption("general"), genRef.current.classList.add("active"), noteRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Dental GPT</button>
        <button className="option_button" ref={noteRef} onClick={()=>{setOption("notes"), noteRef.current.classList.add("active"),genRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Clinical Notes</button>
        <button className="option_button" ref={letRef} onClick={()=>{setOption("letters"), letRef.current.classList.add("active"),noteRef.current.classList.remove("active"), genRef.current.classList.remove("active")}}>Patient Letters</button>
       
        {/* <NavLink to="/vision" className="option_button">Radiograph</NavLink> */}
      </div>
      
      <div className="contentArea">
        {status.chat ?<><InputArea status={status} chatRef={chatRef} option={option} stateAction={stateAction} /> 
        <hr/>
        <Chat ref={chatRef} error={status.error} /> </>:
        <> {option=='general'?<><hr/><New /></>:<hr/>}<InputArea status={status} chatRef={chatRef} option={option} stateAction={stateAction} />
        
        </>}
      </div>
      
      
      <Ads/>
    </div>
    </>
  );
};

export default Main;

//Input Area
const InputArea = ({ status, chatRef, stateAction,option }) => {
  let textAreaRef = useRef();
  let typeRef=useRef();
  const [type,setType]=useState('')
  const [q1,setQ1]=useState('')
  const [q2,setQ2]=useState('')
  const [q3,setQ3]=useState('')
  const [q4,setQ4]=useState('')
  const navigate = useNavigate();
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const dispatch = useDispatch();

  const { prompt, content, _id} = useSelector((state) => state.messages);

  useEffect(() => {
    textAreaRef.current?.addEventListener("input", (e) => {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    });
  });
  
    const FormHandle = async () => {
      // q2Ref.current.value=""
      // q3Ref.current.value=""
      // q4Ref.current.value=""
      console.log(prompt)
    setQ2('')
    setQ3('')
    setQ4('')
    if (prompt?.length > 0) {
      stateAction({ type: "chat", status: true });

      let chatsId = Date.now();

      dispatch(insertNew({ id: chatsId, content: "", prompt}));
      chatRef?.current?.clearResponse();
      textAreaRef.current.value="";
      typeRef="";
      let res = null;
      try {
        if (_id) {
          res = await instance.put("/api/chat", {
            chatId: _id,
            prompt,
            option,
            type
            
          });
        } else {
          res = await instance.post("/api/chat", {
            prompt,
            option,
            type
          });
          
        }
      } catch (err) {
        if (err?.response?.data?.status === 405) {
          dispatch(emptyUser());
          dispatch(emptyAllRes());
          navigate("/login");
        } else {
          stateAction({ type: "error", status: true });
        }
      } finally {
        if (res?.data) {
          const { _id, content } = res?.data?.data;

          dispatch(insertNew({ _id, fullContent: content, chatsId }));
          

          chatRef?.current?.loadResponse(stateAction, content, chatsId);
          
          stateAction({ type: "error", status: false });
        }
      }
    }
  };
  
  let placeholder='';
  if(option=='general') placeholder='Ask Dental Query'
  else if(option=='notes') placeholder='Please provide appointment details here'
  else placeholder='Please provide details of the letter you would like to write'
  const q2Ref = useRef();
  const q3Ref = useRef();
  const q4Ref = useRef();
  const speechToText=(q)=>{
    let recognition=new webkitSpeechRecognition();
    recognition.lang="en-GB";
    recognition.onresult=function(e){
      if(q=="q2"){
        setQ2(e.results[0][0].transcript)
        q2Ref.current.value=e.results[0][0].transcript
      }
      else if(q=="q3"){
        setQ3(e.results[0][0].transcript)
        q3Ref.current.value=e.results[0][0].transcript
      }
      else if(q=="q4"){
        setQ4(e.results[0][0].transcript)
        q4Ref.current.value=e.results[0][0].transcript
      }
      else {
      textAreaRef.current.value=e.results[0][0].transcript;
      dispatch(livePrompt(`${e.results[0][0].transcript} 
      ${q2?`. Additional Details to consider while writing clinical notes - Patient or dentist mention - 
      ${q2}`:''} ${q3?`, Materila or instrutment used - ${q3}`:''} 
      ${q4?`, plan for next appointment - ${q4}`:''} `))}
    }
    recognition.start()
  }

  return (
    <div className="inputArea">
    
      {!status.error ? (
        <>
          <div className="flexBody">
          
            {option==='general'?"":<div>
            {option==='notes'?<div className="space">
          <div className="type-selector">
        <select
          id="type"
          ref={typeRef}
          onChange={handleTypeChange} className="type"
        >
          <option value="" >Choose Notes type</option>
          <option value="Examination Note" >Examination Notes</option>
          <option value="Treatment Note">Treatment Notes</option>
          <option value="Review Note">Review Notes</option>
        </select>
      </div>
      {/* <div className="type-selector">
        <input onChange={(e)=>{setQ1(e.target.value)}} className="type" placeholder="What appointment should I write notes for?"/>
      </div> */}
      <div className="type-selector">
        <input ref={q2Ref} onChange={(e)=>{setQ2(e.target.value)}} className="type" placeholder="Did the patient mention anything specific or did the dentist discuss anything with the patient?"/>
        <VoiceRecognitionButton className="recorderq" onClick={()=>{speechToText("q2")}} />
      </div>
      <div className="type-selector">
        <input ref={q3Ref} onChange={(e)=>{setQ3(e.target.value)}} className="type" placeholder="Was any specific material or instruments used?"/>
        <VoiceRecognitionButton className="recorderq" onClick={()=>{speechToText("q3")}} />
      </div>
      <div className="type-selector">
        <input ref={q4Ref} onChange={(e)=>{setQ4(e.target.value)}} className="type" placeholder="What’s the plan for the next appointment?"/>
        <VoiceRecognitionButton className="recorderq" onClick={()=>{speechToText("q4")}} />
      </div>
      </div>:<div className="type-selector">
        <select
          id="type"
          ref={typeRef}
          onChange={handleTypeChange} className="type"
        >
          <option value="" >Choose Letter type</option>
          <option value="Patient Letter">Patient Letter</option>
          <option value="Dentist Letter">Dentist Letter</option>
        </select>
      </div>}</div>}
            <div className="box">
            
              <textarea  
                placeholder={placeholder}
                ref={textAreaRef}
                onChange={(e) => {
                  dispatch(livePrompt(`${e.target.value} ${q2?`. Additional Details to consider while writing clinical notes - Patient or dentist mention - ${q2}`:''} ${q3?`, Materila or instrutment used - ${q3}`:''} ${q4?`, plan for next appointment - ${q4}`:''} `))}}
                onKeyDown={(evt)=>{
                var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
                if(keyCode==13){
                  FormHandle()
                }
                }}
              />
              <VoiceRecognitionButton className="recorder" onClick={()=>{speechToText("text")}} />
              {!status?.loading ? (
                <>
                <button onClick={FormHandle}>{<Rocket />}</button>
                
                </>
              ) : (
                <div className="loading">
                  <div className="dot" />
                  <div className="dot-2 dot" />
                  <div className="dot-3 dot" />
                </div>
              )}
             
            </div>
            {status.chat && content?.length > 0 && status.actionBtns && (
              <>
                {!status?.resume ? (
                  <div className="chatActionsMd">
                    <button
                      onClick={() => {
                        chatRef.current.loadResponse(stateAction);
                      }}
                    >
                      
                      <Reload />
                    </button>
                  </div>
                ) : (
                  <div className="chatActionsMd">
                    <button
                      onClick={() => {
                        chatRef.current.stopResponse(stateAction);
                      }}
                    >
                      <Stop />
                    </button>
                  </div>
                )}
                 
              </>
            )}
          </div>
          
        </>
      ) : (
        <div className="error">
          <p>There was an error generating a response</p>
          <button onClick={FormHandle}>
            <Reload />
            Regenerate response
          </button>
        </div>
      )}
    </div>
  );
};
