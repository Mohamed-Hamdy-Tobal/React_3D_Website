import React from 'react'
import Iphone from '../assets/images/iphone-14.jpg'
import HeadingIphone from '../assets/images/iphone-hand.png'

const Jumbotron = () => {
  return (
    <div className='jumbotron-section wrapper'>
      <h2 className='title'>New</h2>
      <img src={Iphone} alt='img'/>
      <p className="text">Big and bigger.</p>
      <span className="description">From 41.6/mo. for 24 mo. or $999 before trade-in</span>
      <ul className='links'>
        <li>
          <button className='button'>Buy</button>
        </li>
        <li>
          <a className='link'>Learn more</a>
        </li>
      </ul>
      <img className='iphone-img' src={HeadingIphone} alt='img'/>
    </div>
  )
}

export default Jumbotron