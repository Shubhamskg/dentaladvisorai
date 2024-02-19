import React, {
  forwardRef,
  Fragment,
  useImperativeHandle, useRef
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { insertNew } from '../../redux/messages'
import './style.scss'
import CopyButton from '../../assets/copy';
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
      return "Invalid timestamp";
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
                <span>{latest?.prompt}</span>
                <br/>
                  <span>{latest?.createdAt}</span>
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
                  <span>{obj?.prompt}<h4>{timeSince(obj.createdAt)}</h4></span>
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