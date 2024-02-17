import React, {useState, useEffect, useLayoutEffect,useReducer, useRef } from "react";
import { Reload, Rocket, Stop } from "../assets";
import { Ads,Vision, New, NewVision } from "../components";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/vision";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import "./style.scss";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import {VisionMenu} from "../components";

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
  const { user } = useSelector((state) => state);
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
              res = await instance.get("/api/vision/saved", {
                params: {
                  visionId: id,
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
          <VisionMenu changeColorMode={changeColorMode} />
        </div>
      )}
    
    <div className="main">
    <div className="navbar">
      <NavLink to="/">
        <button className="option_button" ref={genRef} onClick={()=>{setOption("general"), genRef.current.classList.add("active"), noteRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>General LLM</button>
        <button className="option_button" ref={noteRef} onClick={()=>{setOption("notes"), noteRef.current.classList.add("active"),genRef.current.classList.remove("active"), letRef.current.classList.remove("active")}}>Clinical Notes</button>
        <button className="option_button" ref={letRef} onClick={()=>{setOption("letters"), letRef.current.classList.add("active"),noteRef.current.classList.remove("active"), genRef.current.classList.remove("active")}}>Pateint Letters</button>
        </NavLink>
        <NavLink to="/vision" className="option_button">Radiograp</NavLink>
      </div>
      {/* <NavLink to="/" className="vision_button">Switch to Dental Chat</NavLink> */}
      
      <div className="contentArea">
      <NewVision />
      </div>
      <InputArea status={status} chatRef={chatRef} stateAction={stateAction} />
      <div className="contentArea">
        {status.chat ? <Vision ref={chatRef} error={status.error} /> : <></>}
      </div>
      {/* <div className="ads_box">
      <img src={IMAGES.image2} className='ads-img' alt='second image' />
      <img src={IMAGES.image} className='ads-img' alt='first image' />
      <img src={IMAGES.image2} className='ads-img' alt='second image' />
      <img src={IMAGES.image} className='ads-img' alt='first image' />
      </div> */}
      <Ads/>
    </div>
    </>
  );
};

export default Main;

//Input Area
const InputArea = ({ status, chatRef, stateAction }) => {
  const [option, setOption] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imagePreview,setImagePreview]=useState();
  const [response, setResponse] = useState('');
  const handleRadiographTypeChange = (event) => {
    setOption(event.target.value);
  };
  const handleTextInputChange = (event) => {
    setPrompt(event.target.value);
  };
  const uploadImage = (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("myImage", image);
    axios({
      method: "post",
      url: "/api/upload-image",
      data: formData,
    })
     .then((response) => {
      const { data } = response;
      setImage(data.url);
      setUploadSuccess(true)
    })
     .catch((err) => {
    });
  }
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    
  };
  
  let textAreaRef = useRef();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { content, _id } = useSelector((state) => state.messages);
  useEffect(() => {
    textAreaRef.current?.addEventListener("input", (e) => {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    });
  });

  const FormHandle = async () => {
    // return 
    if (image) {
      stateAction({ type: "chat", status: true });
      let chatsId = Date.now();
      dispatch(insertNew({ id: chatsId, content: "",option, prompt,image }));
      chatRef?.current?.clearResponse();

      let res = null;

      try {
        if (_id) {
          res = await instance.put("/api/vision", {
            visionId: _id,
            option,
            prompt,
            image
          });
        } else {
          res = await instance.post("/api/vision", {
            option,
            prompt,
            image
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
          setResponse(content)
          dispatch(insertNew({ _id, fullContent: content, chatsId ,option, prompt,image}));

          chatRef?.current?.loadResponse(stateAction, content, chatsId,option, prompt,image);

          stateAction({ type: "error", status: false });
        }
      }
    }
  };
  

  return (
    <div className="vision">
      {!status.error ? (
        <>
          <div className="chatActionsLg">
          </div>

          <div className="app-container">
          {response && <><button className="browse-button" onClick={(e)=>{e.preventDefault();location.reload()}}>Add Vision</button><br/><br/></>}
            <div className="vision_box">
              <div className="radiograph-type-selector">
        <label htmlFor="radiograph-type">Choose radiograph type:</label>
        <select
          id="radiograph-type"
          value={option}
          onChange={handleRadiographTypeChange} className="type"
        >
          <option value="">Choose Radiograph type</option>
          <option value="Bitewing">Bitewing</option>
          {/* <option value="Periapical">Periapical</option> */}
          {/* <option value="Panoramic X-rays">Panoramic X-rays</option> */}
        </select>
      </div>
      <div className="additional-info">
        <label htmlFor="additional-info">Additional info:</label>
        <input
          id="additional-info"
          value={prompt}
          onChange={handleTextInputChange} className="type prompt" required
        />
      </div>
      
      <div className="image-upload">
      <div className="image-input">
  
    
    {!response && <>
    <p className="choose-image">Choose an image...</p>
    <label htmlFor="image-upload" className="image-input-inner">
    <p className="drag-drop">Drag and drop file here<br/>Limit 200MB per file. JPG, JPEG, PNG, TIFF, DICOM, TIF</p>
    <label htmlFor="image-upload" className="browse-button">Browse files</label>
    <input type="file" accept=".jpg, .jpeg, .png, .tiff, .dcm, .tif" onChange={handleImageUpload}  id="image-upload" hidden/>
  </label></>}
</div>

        {image && <> <br/><br/> <img src={imagePreview} className="upload_image"  alt="Uploaded Image" />
        <br/><br/>
       {!response && !uploadSuccess && <button className="browse-button" onClick={uploadImage}>Upload Image</button>}
        </>}
      </div>
      <br/>
<br/>

{!response && prompt &&
<button className="browse-button" onClick={FormHandle}> 
{!status?.loading ?   (
      
       <span>Tell me about the  radiograph</span>
      
      ): ( 
            
                <div className="loading">
                <span>Loading</span> <br/>
                  <div className="dot" />
                  <div className="dot-2 dot" />
                  <div className="dot-3 dot" />
                </div>
                
              )} </button>}
      <br/>
      {response && <div className="response-container">
        <h2 className="response-header">The Response is:</h2>
        <pre className="response-text"><ReactMarkdown>{response}</ReactMarkdown></pre>
        
      </div>}
      <br/>
<br/>
<br/>
<br/>

              {/* <textarea
                placeholder="Send a message..."
                ref={textAreaRef}
                value={prompt}
                onChange={(e) => {
                  dispatch(livePrompt(e.target.value));
                }}
              /> */}
              {/* {!status?.loading ? (
                <button onClick={FormHandle}>{<Rocket />}</button>
              ) : (
                <div className="loading">
                  <div className="dot" />
                  <div className="dot-2 dot" />
                  <div className="dot-3 dot" />
                </div>
              )} */}
            </div>
              {/* <h1>History</h1> */}
            {/* {status.chat && content?.length > 0 && status.actionBtns && (
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
            )} */}
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
