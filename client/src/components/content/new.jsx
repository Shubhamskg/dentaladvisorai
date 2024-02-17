import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { livePrompt } from '../../redux/messages'
import './style.scss'

const New = memo(() => {
  const IMAGES = {
    image : new URL('../../../public/favicon.png', import.meta.url).href
  }
  const dispatch = useDispatch()
  return (
    <div className='New'>
      <img src={IMAGES.image} alt='first image'/>
      <div>
        <h1 className='title currentColor'>Dental Advisor</h1>
      </div>
      {/* <div className="flex">
        <div className='inner'>
          <div className='card'>
            <h4 className='currentColor'>Examples</h4>
          </div>

          <div className='card card-bg hover' onClick={() => {
            dispatch(livePrompt("Pain, pus, erythematous related to socket after extraction done a week ago. What's the diagnosis/condition? I was stuck between osteitis or osteomyelitis."))
          }}>
            <p className='currentColor'>"Pain, pus, erythematous related to socket after extraction done a week ago. What's the diagnosis/condition? I was stuck between osteitis or osteomyelitis." →</p>
          </div>

          <div className='card card-bg hover' onClick={() => {
            dispatch(livePrompt("Every denture... how long is the space between the major connector and the gingiva?"))
          }}>
            <p className='currentColor'>"Every denture... how long is the space between the major connector and the gingiva?" →</p>
          </div>

          <div className='card card-bg hover' onClick={() => {
            dispatch(livePrompt("5 principle features of every denture"))
          }}>
            <p className='currentColor'>"5 principle features of every denture" →</p>
          </div>

        </div>
      </div> */}
    </div>
  )
})

export default New