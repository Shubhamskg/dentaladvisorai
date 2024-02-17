import React, { Fragment} from 'react'
import './style.scss'
import { NavLink } from 'react-router-dom'

const Ads = ({ changeColorMode }) => {
  const IMAGES = {
    google : new URL('../../assets/img/google.png', import.meta.url).href,
    chatgpt : new URL('../../assets/img/chatgpt.png', import.meta.url).href,
    bardai : new URL('../../assets/img/bardai.png', import.meta.url).href,
  }
  return (
    <Fragment>
      <div className="container">
        <div className="box">
            <NavLink to="https://www.google.com/" target="_blank" className="link">
            <img src={IMAGES.google} className='ads-img' alt='first image' width={26} height={26}/>
              <div className="title">Google</div>
              </NavLink>
              <NavLink to="https://chat.openai.com/" target="_blank" className="link">
            <img src={IMAGES.chatgpt} className='ads-img gpt' alt='first image' width={26} height={26}/>
              <div className="title">ChatGpt</div>
              </NavLink>
              <NavLink to="https://bard.google.com/" target="_blank" className="link">
            <img src={IMAGES.bardai} className='ads-img' alt='first image' width={26} height={26}/>
              <div className="title">BardAI</div>
              </NavLink>
            
            
            
        </div>
      </div>
    </Fragment>
  )
}

export default Ads
