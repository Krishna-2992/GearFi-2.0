import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import MetaMaskAuthButton from './Metamask'

const Navbar = () => {
  return (
    <div className='h-20 flex blur-background justify-between items-center px-6 py-2'>
      <div className='flex w-full items-center justify-between'>  
        <div className='flex items-center text-lg '>
          <a href='https://discord.com/invite/PJp2DbX64U'>
            <li className='text-white mx-4 list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105'>
              Discover
            </li>
          </a>
          {/* <Link to={`/staking`}> */}
          <a href='https://discord.com/invite/PJp2DbX64U'>
            <li className='text-white mx-4 list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105'>
              Stake
            </li>
          </a>
          {/* </Link> */}
          <a href='#bnplComponent'>
            <li className='text-white mx-4 list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105'>
              BNPL
            </li>
          </a>
          <a href='https://armilaadarshs-organization.gitbook.io/gearfi_litepaper/welcome-to-gear_fi/abstract'>
            <li className='text-white mx-4  list-none capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105'>
              Docs
            </li>
          </a>
          <a href='https://discord.com/invite/PJp2DbX64U'>
            <li className='text-white mx-4 list-none  capitalize mr-1 cursor-pointer  hover:text-[#0ea5e9] hover:scale-105'>
              Discord
            </li>
          </a>
        </div>
        <div>
          <MetaMaskAuthButton/>
        </div>
      </div>
    </div>
  )
}

export default Navbar
