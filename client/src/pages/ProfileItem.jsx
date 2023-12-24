import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import { useParams } from 'react-router'
import { BNPL_ABI } from '../assets/constants'
import { ethers } from 'ethers'
import { BNPL_ADDRESS } from '../assets/constants'
import UserContext from '../context/userContext'

const ProfileItem = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL

    const [nftData, setNftData] = useState([])
    const { tokenAddress, tokenId } = useParams()
    const [popup, setPopup] = useState('')
    const [dueAmount, setDueAmount] = useState()
    const [chainId, setChainId] = useState()
    const [accounts, setAccounts] = useState([])

    const {
        address,
        getDueAmount,
        repay,
        marginList,
        claimNFT,
        cancelListing,
        listNFT,
    } = useContext(UserContext)

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const handleClick = async (e, data) => {
        let dueAmount = await getDueAmount(nftData)
        console.log('due amount is: ', dueAmount)
        setDueAmount(dueAmount)
        document.querySelector('#event_popup').classList.add('active')
        setPopup(data)
    }
    function closePopup(e) {
        console.log('closePopup')
        if (!e.target.matches('#event_popup_detail')) {
            e.target.classList.remove('active')
        }
    }

    useEffect(() => {
        axios(`${SERVER_URL}/assets/${tokenAddress}/${tokenId}`).then(
            ({ data }) => {
                console.log('datacollection', data[0])
                setNftData(data[0])
            }
        )

        // let dueAmount = await getDueAmount(nftData)
        // console.log('due amount is: ', dueAmount)
        // setDueAmount(dueAmount)
    }, [tokenAddress, tokenId])

    return (
        <>
            <div className='item flex px-6 text-white mb-0 min-h-screen h-full'>
                <div className='item-image flex flex-col mt-32 border-r border-gray-200 mb-0'>
                    <img
                        src={`https://ipfs.io/ipfs/${
                            nftData.metadata?.imageURI.split('//')[1]
                        }`}
                        alt=''
                        className='rounded-15 w-80 mb-5'
                    />
                    <div className='mx-auto item-content-title'>
                        <h1 className='font-bold text-28 '>
                            {nftData.metadata?.name} #{nftData?.tokenId}
                        </h1>
                    </div>
                </div>
                <div className='item-content flex justify-start items-center flex-col'>
                    <div className=' flex-col mt-4 w-full px-8'>
                        <div className='p-4 border border-white border-b-0 py-8'>
                            Description:{' '}
                            <span className='font-semibold'>
                                {nftData.metadata?.description}
                            </span>
                        </div>
                        <div className='p-4 border border-white border-b-0 py-8'>
                            Owner:{' '}
                            <span className='font-semibold'>
                                {nftData.owner}
                            </span>
                        </div>
                        <div className='p-4 border border-white text-white'>
                            <div className='flex justify-around my-4'>
                                <div className='flex flex-col items-center'>
                                    <div>Price</div>
                                    <div className='text-5xl font-bold'>
                                        {nftData.price} ETH
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div>Remaining Amount</div>
                                    <div className='text-5xl font-bold'>
                                        {dueAmount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mx-auto my-8 item-content-buy'>
                        {(() => {
                            if (nftData.state === 'LISTED') {
                                return (
                                    <button
                                        className='primary-btn'
                                        onClick={() => cancelListing(nftData, 'LISTED_CANCELLED')}
                                    >
                                        Cancel Listing
                                    </button>
                                )
                            } else if (nftData.state === 'MARGIN_LISTED') {
                                return (
                                    <div>
                                        <button
                                            className='primary-btn'
                                            onClick={() => cancelListing(nftData, 'BNPL_LOAN_ACTIVE')}
                                        >
                                            Cancel Listing
                                        </button>
                                        <button
                                            className='primary-btn'
                                            onClick={(e) => {
                                                handleClick(e, 'Repay')
                                            }}
                                        >
                                            Repay
                                        </button>
                                    </div>
                                )
                            } else if (nftData.state === 'BNPL_LOAN_ACTIVE') {
                                return (
                                    <div>
                                        <button
                                            className='primary-btn'
                                            onClick={(e) => {
                                                handleClick(e, 'Repay')
                                            }}
                                        >
                                            Repay
                                        </button>
                                        <button
                                            className='primary-btn'
                                            onClick={(e) => {
                                                handleClick(e, 'Margin_List')
                                            }}
                                        >
                                            Margin List for Sale
                                        </button>
                                    </div>
                                )
                            } else if (nftData.state === 'LOAN_REPAID') {
                                return (
                                    <button
                                        className='primary-btn'
                                        onClick={() => claimNFT(nftData)}
                                    >
                                        Claim NFT
                                    </button>
                                )
                            } else if (nftData.state === 'CLAIMED') {
                                return (
                                    <button
                                        className='primary-btn'
                                        onClick={(e) => {
                                            handleClick(e, 'listNft')
                                        }}
                                    >
                                        List NFT
                                    </button>
                                )
                            }
                        })()}
                    </div>
                </div>
                <div id='event_popup' onClick={closePopup}>
                    <div
                        id='event_popup_detail'
                        className='text-white border-2 shadow-lg shadow-cyan-500/50 border-sky-500/70 rounded-md'
                    >
                        {popup === 'Repay' && (
                            <div className='h-full flex flex-col justify-center items-center'>
                                <p className='text-xl mb-5'>
                                    Due Amount: {dueAmount} SHM
                                </p>
                                <input
                                    className=' mb-5 text-lg text-black px-5 rounded-xl'
                                    type='text'
                                    id='repayAmount'
                                />
                                <button
                                    className='text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4'
                                    onClick={() => {
                                        repay(
                                            nftData,
                                            document.getElementById(
                                                'repayAmount'
                                            ).value,
                                            dueAmount
                                        )
                                    }}
                                >
                                    Repay
                                </button>
                            </div>
                        )}
                        {popup === 'Margin_List' && (
                            <div className='h-full flex flex-col justify-center items-center'>
                                <div className='text-2xl mb-5'>
                                    Put your NFT's for margin sale
                                </div>
                                <input
                                    className=' text-lg text-black mb-5 px-5 rounded-xl'
                                    type='text'
                                    id='marginPrice'
                                />
                                <button
                                    className='text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4'
                                    onClick={() => {
                                        marginList(
                                            nftData,
                                            document.getElementById(
                                                'marginPrice'
                                            ).value
                                        )
                                    }}
                                >
                                    List for Sale
                                </button>
                            </div>
                        )}
                        {popup === 'listNft' && (
                            <div className='h-full flex flex-col justify-center items-center'>
                                <div className='text-2xl mb-5'>
                                    Put your NFT's for sale
                                </div>
                                <input
                                    className=' text-lg text-black mb-5 px-5 rounded-xl'
                                    type='text'
                                    id='listNft'
                                />
                                <button
                                    className='text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4'
                                    onClick={() => {
                                        listNFT(
                                            nftData,
                                            document.getElementById('listNft')
                                                .value
                                        )
                                    }}
                                >
                                    List for Sale
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileItem
