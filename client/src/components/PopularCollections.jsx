import React from 'react'
import data from '../assets/data.json'
import { useNavigate } from 'react-router-dom'

export default function PopularCollections() {
    const navigate = useNavigate()
    const handleRedirect = (address) => {
        navigate(`/collection/${address}`)
    }

    return (
        <div className='text-white font-semibold m-20'>
            <h1
                className='ml-20 p-4 text-2xl text-center'
                style={{
                    fontFamily: 'Inter, Arial',
                    fontWeight: '500',
                    letterSpacing: '0.2rem',
                    fontSize: '2rem',
                }}
            >
                Popular Collections
            </h1>

            <div className='flex justify-evenly mt-10 '>
                {data.slice(2, 6).map((coll) => {
                    return (
                        <div
                            className='flex m-4 h-72 card items-end cursor-pointer w-1/4'
                            style={{ backgroundImage: `url(${coll.img})` }}
                            onClick={() => handleRedirect(coll.address)}
                        >
                            <div className='flex flex-col m-4 blue-glassmorphism w-full p-2'>
                                <div className='font-bold mb-2 flex items-center justify-between'>
                                    <div>{coll.COLLECTION}</div>
                                </div>
                                <div className='flex'>
                                    <div className='w-24 text-sm'>
                                        FLOOR PRICE
                                        <br />
                                        {coll.FLOOR_PRICE} SHM
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
