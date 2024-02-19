import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  Avatar, Bar, LogOut, Message, Plus, Settings, Tab, Tick, Trash, Xicon
} from '../../assets/'
import { emptyUser } from '../../redux/user'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { activePage, addHistory } from '../../redux/history'
import instance from '../../config/instance'
import './style.scss'

const Menu = ({ changeColorMode }) => {
  let path = window.location.pathname

  const menuRef = useRef(null)
  const btnRef = useRef(null)
  const settingRef = useRef(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let { history } = useSelector((state) => state)
  const [confirm, setConfim] = useState(false)

  const logOut = async () => {
    if (window.confirm("Do you want log out")) {
      let res = null
      try {
        res = await instance.get('/api/user/logout')
      } catch (err) {
        alert(err)
      } finally {
        if (res?.data?.status === 200) {
          alert("Done")
          dispatch(emptyUser())
          navigate('/login')
        }
      }
    }
  }
  const deleteChat=async(chatId)=>{
    let res=null
    try {
      if (chatId) {
        res = await instance.delete(`/api/chat/${chatId}`);
      } 
    } catch (err) {
    } finally {
      if(path=='/')
      navigate('/chat')
    else navigate('/')
    }
  }
  
  const clearHistory = async (del) => {
    if (del) {
      let res = null

      try {
        res = instance.delete('/api/chat/all')
      } catch (err) {
        alert("Error")
      } finally {
        if (res) {
          navigate('/chat')
          dispatch(addHistory([]))
        }

        setConfim(false)
      }
    } else {
      setConfim(true)
    }
  }

  const showMenuMd = () => {
    menuRef.current.classList.add("showMd")
    document.body.style.overflowY = "hidden"
  }

  //Menu

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (!menuRef?.current?.contains(e.target)
        && !btnRef?.current?.contains(e.target)) {
        menuRef?.current?.classList?.remove("showMd")
        document.body.style.overflowY = "auto"
      }
    })

    window.addEventListener('resize', () => {
      if (!window.matchMedia("(max-width:767px)").matches) {
        document.body.style.overflowY = "auto"
      } else {
        if (menuRef?.current?.classList?.contains('showMd')) {
          document.body.style.overflowY = "hidden"
        } else {
          document.body.style.overflowY = "auto"
        }
      }
    })
  })

  // History Get
  useEffect(() => {
    const getHistory = async () => {
      let res = null
      try {
        res = await instance.get('/api/chat/history')
      } catch (err) {
      } finally {
        if (res?.data) {
          console.log(res.data.data)
          dispatch(addHistory(res?.data?.data))
        }
      }
    }

    getHistory()
  }, [path])

  // History active
  useEffect(() => {
    setConfim(false)
    let chatId = path.replace('/chat/', '')
    chatId = chatId.replace('/', '')
    dispatch(activePage(chatId))
  }, [path, history])
  const history2=[...history]
  history2.sort((a, b) => a.lastUpdate - b.lastUpdate)
  history=history2
  
  return (
    <Fragment>
      <Modal
        changeColorMode={changeColorMode}
        settingRef={settingRef}
      />

      <header >
        <div className='start'>
          <button onClick={showMenuMd} ref={btnRef}><Bar /></button>
        </div>

        <div className='title'>
          {
            path.length > 6 ? history[0]?.prompt : 'New chat'
          }
        </div>

        <div className='end'>
          <button onClick={() => {
            if (path.includes('/chat')) {
              navigate('/')
            } else {
              navigate('/chat')
            }
          }}><Plus /></button>
        </div>
      </header>

      <div className="menu" ref={menuRef}>
        <div>
          <button
            type='button'
            aria-label='new'
            onClick={() => {
              if (path.includes('/chat')) {
                navigate('/')
              } else {
                navigate('/chat')
              }
            }}
          >
            <Plus />New chat
          </button>
        </div>

        <div className="history">
          {
            history?.map((obj, key) => {
              if (obj?.active) {
                return (
                  <div className='active conatiner' key={key}>
                  <button 
                    className=' msg-button'
                    onClick={() => {
                      navigate(`/chat/${obj?.chatId}`)
                    }}
                  ><Message />
                    {obj?.prompt}
                  </button>
                  <button className="del" onClick={()=>{deleteChat(obj.chatId)}}><Trash className="trash"/></button>
                  </div>
                )
              } else {
                return (
                  <div className='conatiner' key={key}>
                  <button className='msg-button' 
                    onClick={() => {
                      navigate(`/chat/${obj?.chatId}`)
                    }}
                  ><Message />{obj?.prompt}</button>
                  <button className='del' onClick={()=>{deleteChat(obj.chatId)}}><Trash className="trash"/></button></div>
                  )
              }
            })
          }
        </div>

        <div className="actions">
          {
            history?.length > 0 && (
              <>
                {
                  confirm ? <button onClick={() => clearHistory(true)}><Tick />Confirm clear conversations</button>
                    : <button onClick={() => clearHistory(false)}><Trash />Clear conversations</button>
                }
              </>
            )
          }
          {/* <button><Avatar />Upgrade to Plus <span>New</span></button> */}
          <button onClick={() => {
            if (settingRef?.current) {
              settingRef.current.classList.add("clicked")
              settingRef.current.style.display = 'flex'
            }
          }} ><Settings />Settings</button>
          {/* <button onClick={() => {
            window.open('https://help.openai.com/en/collections/3742473-chatgpt', '_blank')
          }}><Tab />Get help</button> */}
          <button onClick={logOut} >
            <LogOut />Log out
          </button>
        </div>
      </div >

      <div className="exitMenu">
        <button><Xicon /></button>
      </div>
    </Fragment>
  )
}

export default Menu

const Modal = ({ changeColorMode, settingRef }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const deleteAccount = async () => {
    if (window.confirm("Do you want delete your account")) {

      let res = null
      try {
        res = await instance.delete('/api/user/account')
      } catch (err) {
        if (err?.response?.data?.status === 405) {
          alert("Not Logged")
          dispatch(emptyUser())
          navigate('/login')
        } else {
          alert(err)
        }
      } finally {
        alert("Success")
        dispatch(emptyUser())
        navigate('/login')
      }
    }
  }

  return (
    <div className="settingsModal" ref={settingRef} onClick={(e) => {
      let inner = settingRef.current.childNodes
      if (!inner?.[0]?.contains(e.target)) {
        settingRef.current.style.display = 'none'
      }
    }}>
      <div className="inner">
        <div className='content top'>
          <h3>Settings</h3>
          <button onClick={() => {
            settingRef.current.style.display = 'none'
          }}><Xicon /></button>
        </div>
        <div className='content ceneter'>
          <p>Dark mode</p>
          <button
            onClick={() => {
              let mode = localStorage.getItem('darkMode')
              if (mode) {
                changeColorMode(false)
              } else {
                changeColorMode(true)
              }
            }
            }
            role='switch' type='button'>
            <div></div>
          </button>
        </div>
        <div className="bottum">
          <button>Export data</button>
          <button className='end' onClick={deleteAccount}>Delete account</button>
        </div>
      </div>
    </div>
  )
}