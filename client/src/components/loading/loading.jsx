import React from 'react'
import './style.scss'

const Loading = () => {
    const IMAGES = {
        image : new URL('../../../public/favicon.png', import.meta.url).href
    }
    return (
        <div data-for='Loading'>
            <div className="inner">
                <img src={IMAGES.image} alt='first image'/>
                <div data-for="text">Please stand by, while we are checking your browser...</div>
            </div>
        </div>
    )
}

export default Loading
