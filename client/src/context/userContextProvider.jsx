import React from 'react'

import UserContext from './userContext'
import { BNPL_ADDRESS, BNPL_ABI } from '../assets/constants'
import { ethers } from 'ethers'
import axios from 'axios'

const UserContextProvider = ({ children }) => {
    const [isConnected, setIsConnected] = React.useState(false)
    const [address, setAddress] = React.useState('')
    const [provider, setProvider] = React.useState(null)
    const [signer, setSigner] = React.useState(null)
    const [contract, setContract] = React.useState(null)

    async function bnplInitialize(nftData) {
        const tokenAddress = nftData.nftAddress
        const tokenId = nftData.tokenId

        console.log('BNPL_INITIALIZE_CALLED')
        if (!address) {
            alert('Please connect Wallet')
            return
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
        })

        const contract = new ethers.Contract(BNPL_ADDRESS, BNPL_ABI, signer)
        setContract(contract)

        const price = (nftData.price * 30) / 100
        console.log('price', typeof price)
        console.log('contract is: ', contract)

        const parsedPrice = ethers.utils.parseEther(price.toString())
        console.log(parsedPrice)

        console.log(tokenAddress, tokenId)

        const response = await contract.bnplInitiate(tokenAddress, tokenId, {
            value: ethers.utils.parseEther(price.toString()),
        })

        const confirmedTransaction = await provider.waitForTransaction(
            response.hash,
            1
        )

        if (confirmedTransaction.status === 1) {
            axios.patch(`${REACT_APP_SERVER_URL}/state`, {
                state: 'BNPL_LOAN_ACTIVE',
                owner: address,
                tokenId: tokenId,
                nftAddress: tokenAddress,
            })
        } else {
            console.log('Failed...')
        }
    }

    return (
        <UserContext.Provider
            value={{
                provider,
                setProvider,
                signer,
                setSigner,
                contract,
                setContract,
                isConnected,
                setIsConnected,
                address,
                setAddress,
                bnplInitialize,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
