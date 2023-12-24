import { React, useEffect, useState } from 'react'

import axios from 'axios'
import { useParams } from 'react-router'
import data from '../assets/data.json'
import { Link } from 'react-router-dom'

export default function Collection() {
  const REACT_APP_SERVER_URL = import.meta.env.VITE_SERVER_URL
  const { collAddress } = useParams()
  const [nftData, setNftData] = useState([])

  useEffect(() => {
    axios(`${REACT_APP_SERVER_URL}/assets/${collAddress}`).then(
      ({ data }) => {
        setNftData(Object.values(data))
      }
    )
  }, [collAddress])
  console.log(nftData)

  const collData = data.find((obj) => {
    return obj.address === collAddress
  })

  return (
    <div className='text-white mt-20 h-full'>
      <div className='relative'>
        <img
          src={collData.banner_img}
          alt=''
          className='object-cover h-[40vh] relative top-0 left-0 w-full'
        />
        <img
          src={collData.img}
          alt=''
          className='b-4 absolute -bottom-4 left-20 border-4 w-20 sm:w-24 md:w-32 lg:w-40 border-white rounded-lg '
        />
      </div>
      <div>
        <div className='mx-4 mb-0 mt-8 text-3xl font-bold'>
          {collData.COLLECTION}
        </div>

        <div className='mx-4 text-lg m-4 w-2/3'>{collData.description}</div>
        <div className='flex'>
          <div className='flex-col ml-8 text-center'>
            <div>{collData.FLOOR_PRICE}ETH</div>
            <div className='text-sm mt-2'>Floor Price</div>
          </div>
          <div className='flex-col ml-8 text-center'>
            <div>{collData.SUPPLY}</div>
            <div className='text-sm mt-2'>Total Supply</div>
          </div>
          <div className='flex-col ml-8 text-center'>
            <div>{collData.OWNERS}</div>
            <div className='text-sm mt-2'>Unique Owners</div>
          </div>
          <div className='flex-col ml-8 text-center'>
            <div>0.75ETH</div>
            <div className='text-sm mt-2'>total volume</div>
          </div>
        </div>

        <div className='grid grid-cols-4 m-2 text-white'>
          {nftData.length === 0 && (
            <div className='flex flex-col items-center h-screen w-screen'>
              <div className='animate-spin rounded-full h-24 w-24 border-b-4 border-red-700 py-3'></div>
              <div className='text-center text-xl'>Loading....</div>
              <div className='text-center text-lg'>
                Server is overloaded. It may take a while to fetch NFTs, please
                wait.
              </div>
            </div>
          )}

          {nftData.map((nft) => {
            return (
              <div className='w-56 h-84 mx-auto'>
                <Link
                  to={`/collection/${nft.nftAddress}/${nft.tokenId}`}
                  state={{ data: nft }}
                >
                  <div className='flex flex-col m-2 mt-8 border-2 border-red-200 rounded-lg'>
                    <img
                      src={`https://ipfs.io/ipfs/${
                        nft.metadata.imageURI.split('//')[1]
                      }`}
                      alt=''
                      className='w-64 h-48 rounded-xl'
                    />
                    <div className='flex flex-col mt-0 p-4'>
                      <div className='font-bold mb-2 flex items-center justify-between'>
                        <div>
                          {nft.metadata.name} #{nft.tokenId}
                        </div>
                      </div>
                      <div className='flex'>
                        <div className='w-24 text-sm'>
                          Price
                          <br />
                          {nft.price} ETH
                        </div>
                        <div className='ml-2 w-30 text-sm text-center'>
                          DownPayment
                          <br />
                          30%
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}