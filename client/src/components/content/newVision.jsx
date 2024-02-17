import React, { memo } from 'react'
import './style.scss'

const NewVision = memo(() => {
  const IMAGES = {
    image : new URL('../../../public/favicon.png', import.meta.url).href
  }
  return (
    <div className='New'>
      <img src={IMAGES.image} alt='first image'/>
      <div>
        <h1 className='title currentColor'>Dental Advisor</h1>
      </div>
    </div>
  )
})

export default NewVision