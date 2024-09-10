import React from 'react'
import AnimatedLoading from "../assets/images/logo-animated.gif"

const Loader = () => {
    return (
        <div className='loader'>
            <img className="logo" src={AnimatedLoading} alt="logo" />
        </div>
    )
}

export default Loader
