import React, { useState, useEffect, useContext } from 'react'
import UserContext from '../context/userContext'
import { Link } from 'react-router-dom'
import userImage from '../assets/user.jpg'
import { ethers } from "ethers";

const MetaMaskAuthButton = () => {

    const {setProvider, setSigner ,setAddress, setIsConnected, address, isConnected} = useContext(UserContext)

    const sliceIt = (address) => {
        console.log('address issss', address)
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    const connectToMetamask = async () => {
        console.log("conecting to metamask");
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
    
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          // switching to correct network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
          });
          
          setProvider(provider)
          setSigner(signer)
          setIsConnected(true)
          setAddress(address);
        } catch (error) {
          console.log("the error that occured is: ", error);
        }
      };

    return (
        <div className='metamask-auth-wrapper z-2'>
            {isConnected ? (
                <div className='relative'>
                    <Link to={`/user/${address}`}>
                        <div className='flex flex-row cursor:pointer items-center'>
                            <p className='text-white text-xl mr-2'>
                                {sliceIt(address)}
                            </p>

                            <img
                                src={userImage}
                                alt=''
                                className='w-12 rounded-full'
                            />
                        </div>
                    </Link>
                </div>
            ) : (
                <button
                    onClick={connectToMetamask}
                    className='text-[#0ea5e9] bg-gray-800 border-2 border-gray-900 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 '
                >
                    Connect Wallet
                </button>
            )}
        </div>
    )
}

export default MetaMaskAuthButton
