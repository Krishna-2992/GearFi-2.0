import React, { useState, useEffect } from 'react'
import earlyAccessImg from '../assets/EarlyAccess2.png'
import thumbsUpNFT from '../assets/thumbsUpNft.png'
import axios from 'axios'

export default function EarlyAccess() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL

  const [email, setEmail] = useState('')
  const [sentEmail, setSentEmail] = useState(false)

  const sendEmail = () => {
    console.log(email)
    axios.post(`${SERVER_URL}/subscriber/`, {
      "subscriber": email
  })
    setSentEmail(true)
  }

  const handleInputChange = (event) => {
    setEmail(event.target.value)
  }

  return (
    <div>
      {sentEmail ? (
        <div className='flex justify-around items-center w-5/6 mx-auto m-8'>
          <div className='w-1/3'>
            <img src={thumbsUpNFT} alt='' />
          </div>
          <div className='flex flex-col w-2/3 justify-center items-center'>
            <div className='text-4xl m-4 font-semibold'>Thanks!</div>
          </div>
        </div>
      ) : (
        <div className='flex justify-around items-center w-5/6 mx-auto m-8'>
          <div className='w-1/3'>
            <img src={earlyAccessImg} alt='' />
          </div>
          <div className='flex flex-col w-2/3 justify-center items-center'>
            <div className='text-4xl m-4 font-semibold'>Get Early Access</div>
            <div className='text-2xl m-4 text-center'>
              {' '}
              Be a part of NFT Revolution and get early access to our mainnet
              application
            </div>

            <div className='flex justify-center'>
              <input
                type='text'
                placeholder='Your email here'
                className='m-4 text-2xl p-2  rounded-md text-black'
                value={email}
                onChange={handleInputChange}
              />
              <button
                className='text-[#0ea5e9] bg-gray-800 border-2 border-gray-900 px-3 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800'
                onClick={sendEmail}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
