import React, {
  forwardRef,
  Fragment,
  useImperativeHandle, useRef, useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { insertNew } from '../../redux/messages'
import './style.scss'
import CopyButton from '../../assets/copy';
import Listen from "../../assets/listen"
import Stop from "../../assets/stop"
import Pause from "../../assets/pause"
import Resume from "../../assets/resume"
import ReactMarkdown from 'react-markdown';


const Chat = forwardRef(({ error }, ref) => {
  const handleCopySuccess = () => {
    console.log('Text copied successfully');
  };
  const IMAGES = {
    image : new URL('../../../public/favicon.png', import.meta.url).href
}
  const dispatch = useDispatch()
  const contentRef = useRef()
  const { user, messages } = useSelector((state) => state)
  const { latest, content, all } = messages

  const loadResponse = (stateAction,
    response = content,
    chatsId = latest?.id) => {
    clearInterval(window.interval)
    stateAction({ type: 'resume', status: true })
    contentRef?.current?.classList?.add("blink")

    let index = 0

    // window.interval = setInterval(() => {
    //   if (  contentRef?.current) {
    //     if (index === 0) {
          dispatch(insertNew({ chatsId, content: response }))
          contentRef.current.innerHTML = response
        // } else {
        //   dispatch(insertNew({ chatsId, content: response.charAt(index), resume: true }))
        //   contentRef.current.innerHTML += `<ReactMarkdown>${response}</ReactMarkdown>`
        // }
        // index++
  //     } else {
        stopResponse(stateAction)
  //     }
  //   }, 0)

  }

  const stopResponse = (stateAction) => {
    if (contentRef?.current) {
      contentRef.current.classList.remove('blink')
    }
    stateAction({ type: 'resume', status: false })
    clearInterval(window.interval)
  }

  useImperativeHandle(ref, () => ({
    stopResponse,
    loadResponse,
    clearResponse: () => {
      if (contentRef?.current) {
        contentRef.current.innerHTML = ''
        contentRef?.current?.classList.add("blink")
      }
    }
  }))
  function timeSince(time) {
    const timestamp=new Date(time)
    const now = Date.now();
    if (isNaN(timestamp)) {
      return "";
    }
    const difference = now - timestamp;
    const seconds = difference / 1000;
    if (seconds > 31536000) {
      const years = Math.floor(seconds / 31536000);
      return years === 1 ? "1 year ago" : `${years} years ago`;
    } else if (seconds > 2592000) {
      const months = Math.floor(seconds / 2592000);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    const units = [
      { time: 31536000, label: "year" },
      { time: 2592000, label: "month" },
      { time: 86400, label: "day" },
      { time: 3600, label: "hour" },
      { time: 60, label: "minute" },
      { time: 1, label: "second" }
    ];
    for (const unit of units) {
      if (seconds >= unit.time) {
        const count = Math.floor(seconds / unit.time);
        return count === 1 ? `${count} ${unit.label} ago` : `${count} ${unit.label}s ago`;
      }
    }
    return "Just now";
  }
 
  const handleSpeech=(text,p)=>{
    let synth = window.speechSynthesis;
    let speech=new SpeechSynthesisUtterance();
    speech.text=text
    if(p==0){
      synth.speak(speech)
      setPlay(0)
    }
    else if(p==1){
      synth.pause();
      setPlay(1)
    }
    else if(p==2){
      synth.resume();
      setPlay(2)
    }
    else{
       synth.cancel();
       setPlay(3)
    }
  }
  const [play,setPlay]=useState(3)
  
  return (
    <div className='Chat'>
      

      {
        latest?.prompt?.length > 0 && (
          <Fragment>
            <div className='qs'>
              <div className='acc'>
                {user?.fName?.charAt(0)}
              </div>
              <div className='txt'>
                <span>
                <h4>{latest?.type}</h4>
                  <p>{latest?.prompt}</p>
                  <p>{latest?.createdAt}</p></span>
                {latest?.prompt && 
                <div className="copy">
                  <CopyButton text={latest?.prompt} onCopy={handleCopySuccess} />

                  </div>}
                  
              </div>
            </div>

            <div className="res">
              <div className='icon'>
                <img src={IMAGES.image} alt='image'/>
                {error && <span>!</span>}
              </div>
              <div className='txt'>
                {
                  error ? <div className="error">
                    Something went wrong. If this issue persists please contact us through our help center at help.dentaladvisor.com.
                  </div> : <span ref={contentRef} className="blink" />
                }
                {<ReactMarkdown>{latest?.content}</ReactMarkdown> && 
                <div className="copy">
                  <CopyButton text={latest?.content} onCopy={handleCopySuccess} />
                  </div>}
              </div>
            </div>
          </Fragment>
        )
      }
      {
        all?.filter((obj) => {
          return !obj.id ? true : obj?.id !== latest?.id
        })?.reverse().map((obj, key) => {
          return (
            <Fragment key={key}>
              <div className='qs'>
                <div className='acc'>
                  {user?.fName?.charAt(0)}
                </div>
                <div className='txt'>
                  <span>
                    <h4>{obj?.type}</h4>
                    <p>{obj.prompt}</p>
                    <p>{timeSince(obj.createdAt)}</p></span>
                  {obj?.prompt && 
                <div className="copy">
                  <CopyButton text={obj?.prompt} />
                  </div>}
                </div>
              </div>
              <div className="res">
                <div className='icon'>
                  <img src={IMAGES.image} alt='first image'/>
                </div>
                <div className='txt'>
    
                  <span>
                  <ReactMarkdown>{obj?.content}</ReactMarkdown>
                  </span>
                  <div className="copy">
                  <CopyButton text={obj?.content} onCopy={handleCopySuccess} />
                  {play==3 && <button className="playbtn" onClick={()=>{handleSpeech(obj?.content,0)}}><Listen/></button>}
                  {(play==0 || play==2) && <button className="playbtn" onClick={()=>{handleSpeech(obj?.content,1)}}><Pause/></button>}
                  {play==1 && <button className="playbtn" onClick={()=>{handleSpeech(obj?.content,2)}}><Resume/></button>}
                  {(play==0 || play==2) && <button className="playbtn" onClick={()=>{handleSpeech(obj?.content,3)}}><Stop/></button>}
                  </div>
                  
                </div>
              </div>
            </Fragment>
          )
        })
      }
    </div>
  )
})
export default Chat;