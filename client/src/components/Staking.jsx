import React from 'react'
import { Link } from 'react-router-dom'

export default function Staking() {
  return (
    <div className='m-12 rounded-2xl white-glassmorphism'>
      <div className='flex flex-col items-center'>
        <div className='my-4 text-3xl text-red-200'>Introducing BNPL Vaults</div>
        <div className='my-4 text-xl'>
          Provide Liquidity into our Vaults against Top Blue-Chip NFT
          collections and earn exciting APR.
        </div>
        <div className='my-4'>
          <Link to={'/staking'}>
            <button className='text-[#0ea5e9] bg-gray-800 border-gray-900 border-2 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 '>
              Deposit SHM
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
