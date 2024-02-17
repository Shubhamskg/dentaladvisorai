import React, {
    forwardRef,
    Fragment,
    useImperativeHandle, useRef
  } from 'react'
  import { useDispatch, useSelector } from 'react-redux'
  import { insertNew } from '../../redux/vision'
  import './style.scss'
  import CopyButton from '../../assets/copy';
  import ReactMarkdown from 'react-markdown';

  
  const Vision = forwardRef(({ error }, ref) => {
    const IMAGES = {
      image : new URL('../../../public/favicon.png', import.meta.url).href
  }
    const dispatch = useDispatch()
  
    const contentRef = useRef()
  
    const { user, radiograph } = useSelector((state) => state)
    const { latest, content, all } = radiograph
    console.log(radiograph)
    const loadResponse = (stateAction,
      response = content,
      chatsId = latest?.id) => {
  
      clearInterval(window.interval)
  
      stateAction({ type: 'resume', status: true })
  
      contentRef?.current?.classList?.add("blink")
  
      let index = 0
  
      window.interval = setInterval(() => {
        if (index < response.length && contentRef?.current) {
          if (index === 0) {
            dispatch(insertNew({ chatsId, content: response.charAt(index) }))
            contentRef.current.innerHTML = response.charAt(index)
          } else {
            dispatch(insertNew({ chatsId, content: response.charAt(index), resume: true }))
            contentRef.current.innerHTML += response.charAt(index)
          }
          index++
        } else {
          stopResponse(stateAction)
        }
      }, 0)
  
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
  
    return (
      <div className='Chat'>
        {
          all?.filter((obj) => {
            return !obj.id ? true : obj?.id !== latest?.id
          })?.map((obj, key) => {
            return (
              <Fragment key={key}>
                <div className='qs'>
                  <div className='acc'>
                    {user?.fName?.charAt(0)}
                  </div>
                  <div className="txtc">
                  <div className='txt'>
                    {obj?.option} Radiogarph - 
                  </div>
                  <div className='txt'>
                   <span> {obj?.prompt}</span>
                   {obj?.content && 
                <div className="copy">
                  <CopyButton text={obj?.content} />
                  </div>}
                  </div>
                  </div>
                </div>
  
                <div className="res">
                  <div className='icon'>
                    {/* <GptIcon /> */}
                    <img src={IMAGES.image} alt='first image'/>
  
                  </div>
                  <div>
                    <img className='img' src={`/api/${obj?.imageURL}`} />
                  </div>
                  <br/>
                  <div className='txt'>
                    <span>
                    <ReactMarkdown>{obj?.content}</ReactMarkdown>
                    </span>
                    {obj?.content && 
                <div className="copy">
                  <CopyButton text={obj?.content} />
                  </div>}
             
                  </div>
                </div>
              </Fragment>
            )
          })
        }
  
        {
          latest?.prompt?.length > 0 && (
            <Fragment>
              <div className='qs'>
                <div className='acc'>
                  {user?.fName?.charAt(0)}
                </div>
                <div className='txt'>
                  {latest?.prompt}
                  {latest?.prompt && 
                <div className="copy">
                  <CopyButton text={latest?.prompt} />
                  </div>}
                </div>
              </div>
  
              <div className="res">
                <div className='icon'>
                  {/* <GptIcon /> */}
                  <img src={IMAGES.image} alt='image'/>
                  {error && <span>!</span>}
                </div>
                <div>
                  {console.log(latest)}
                    <img className='img' src={`${latest?.image}`} />
                  </div>
                  <br/>
                <div className='txt'>
                  {
                    error ? <div className="error">
                      Something went wrong. If this issue persists please contact us through our help center at help.dentaladvisor.com.
                    </div> : <span ref={contentRef} className="blink" />
                  }
                  
                  {<ReactMarkdown>{latest?.content}</ReactMarkdown> && 
                <div className="copy">
                  <CopyButton text={latest?.content} />
                  </div>}
                  
                </div>
              </div>
            </Fragment>
          )
        }
      </div>
    )
  })
  export default Vision