import React, { Fragment, useEffect, useState} from 'react'
import './style.scss'
import  axios  from 'axios'
import Search from '../../assets/search'
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";


const Ads = ({ changeColorMode }) => {
  const IMAGES = {
    google : new URL('../../assets/img/google.png', import.meta.url).href,
    chatgpt : new URL('../../assets/img/chatgpt.png', import.meta.url).href,
    bardai : new URL('../../assets/img/bardai.png', import.meta.url).href,
  }
//   const [result,setResult]=useState({})
//   const GoogleSearch = async (term) => {
//     const { data } = await axios.get(
//       'https://www.googleapis.com/customsearch/v1',
//       {
//         params: {
//           key: import.meta.env.VITE_Google_Search_Api_Key,
//           cx: import.meta.env.VITE_Search_Engine_Id,
//           q: term,
//         },
//       }
//     );
//     return data;
//   };
//  const [val,setVal]=useState("Todays dental News and Events")
//  const setData = async (term) => {
//   const searches = await GoogleSearch(term);
//   setResult(searches);
// };
// useEffect(()=>{
//     setData(val)
// },[])

  return (
    <Fragment>
      <div className="container">
        <div className="box">
              {/* <div className="search">
                <div className="btn">
              <input type='text' value={val} onChange={(e)=>setVal(e.target.value)}
              onKeyDown={(evt)=>{
              var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
              if(keyCode==13){
                setResult({})
                if(val) {setData(val)}
              }
              }}
              />
              <button onClick={()=>{setResult({});if(val) { setData(val)}}}>
              <Search/>
              </button>
              </div>
              
              <div className="result">
              {result?.items?.map((item) => (
                
            <div key={item.title}>
              <a
                href={item.formattedUrl}
                target='_blank'
                className="font-weight-normal header-post text-dark text-decoration-none">
                {item.displayLink}

                <i className="fa fa-angle-down ml-1"></i>
              </a>

              <h5 className="link-heading">
                <a
                  href={item.formattedUrl}
                  target='_blank'
                  className="link-text"
                  dangerouslySetInnerHTML={{ __html: item.htmlTitle }}
                />
              </h5>
              <p
                className="paragraph"
                dangerouslySetInnerHTML={{ __html: item.htmlSnippet }}
                style={{ color: '#666' }}
              />
            </div>
          ))}
              </div> 
              </div> */}
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
