import React from 'react'

import UserContext from './userContext'
import { BNPL_ADDRESS, BNPL_ABI } from '../assets/constants'
import { ethers } from 'ethers'
import axios from 'axios'

const UserContextProvider = ({ children }) => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL

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
        }).then(()=>{
            axios.patch(`${SERVER_URL}/state`, {
                state: 'BNPL_LOAN_ACTIVE',
                owner: address,
                tokenId: tokenId,
                nftAddress: tokenAddress,
            })
        })
    }

    async function getDueAmount(nftData) {
        const tokenAddress = nftData.nftAddress
        const tokenId = nftData.tokenId

        console.log('GET DUE AMOUNT CALLED')
        if (!address) {
            alert('Please connect Wallet')
            return
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
        })
        const contract = new ethers.Contract(BNPL_ADDRESS, BNPL_ABI, signer)

        const repayments = await contract.getRepayments(tokenAddress, tokenId)
        const loanData = await contract.getLoanData(tokenAddress, tokenId)

        const dueAmount =
            parseInt(loanData.loanAmount._hex, 16) / 10 ** 18 -
            parseInt(repayments._hex, 16) / 10 ** 18

        console.log(dueAmount)
        return dueAmount
    }

    async function repay(nftData, amount, dueAmount) {
        const tokenAddress = nftData.nftAddress
        const tokenId = nftData.tokenId

        console.log('REPAY LOAN CALLED')
        if (!address) {
            alert('Please connect Wallet')
            return
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
        })

        if (amount <= 0) {
            alert('Amount should be greater than 0')
            return
        }

        if (amount > dueAmount) {
            alert('Amount is greater than Due Amount')
            return
        }

        const contract = new ethers.Contract(BNPL_ADDRESS, BNPL_ABI, signer)
        console.log('amount: ', amount)
        const depositResponse = await contract.repay(tokenAddress, tokenId, {
            value: ethers.utils.parseEther(amount),
        })
        await depositResponse.wait()
        if(amount == dueAmount) {
            console.log('yeeeahh!!')
            axios.patch(`${SERVER_URL}/state`, {
                state: 'LOAN_REPAID',
                owner: address,
                tokenId: tokenId,
                nftAddress: tokenAddress,
            })
        }
        console.log('repayResponse: ', depositResponse)
    }

    async function marginList(nftData, price) {
        const tokenAddress = nftData.nftAddress
        const tokenId = nftData.tokenId

        console.log('MARGIN LIST CALLED')
        if (!address) {
            alert('Please connect Wallet')
            return
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
        })

        if (price <= 0) {
            alert('Listing Price should be greater than 0')
            return
        }

        const contract = new ethers.Contract(BNPL_ADDRESS, BNPL_ABI, signer)
        const _price = ethers.utils.parseEther(price)

        await contract.marginList(tokenAddress, tokenId, _price).then(() => {
            axios.patch(`${SERVER_URL}/state`, {
                state: 'MARGIN_LISTED',
                price: price,
                owner: address,
                tokenId: tokenId,
                nftAddress: tokenAddress,
            })
        })
    }
    async function listNFT(nftData, price) {
        const tokenAddress = nftData.nftAddress
        const tokenId = nftData.tokenId

        console.log('LIST NFT CALLED')
        if (!address) {
            alert('Please connect Wallet')
            return
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
        })

        if (price <= 0) {
            alert('Listing Price should be greater than 0')
            return
        }

        const contract = new ethers.Contract(BNPL_ADDRESS, BNPL_ABI, signer)
        const _price = ethers.utils.parseEther(price)

        await contract.listItem(tokenAddress, tokenId, _price).then(() => {
            axios.patch(`${SERVER_URL}/state`, {
                state: 'LISTED',
                price: price,
                owner: address,
                tokenId: tokenId,
                nftAddress: tokenAddress,
            })
        })
    }

    async function cancelListing(nftData, state) {
        const tokenAddress = nftData.nftAddress
        const tokenId = nftData.tokenId

        console.log('CANCEL LISTING CALLED')
        if (!address) {
            alert('Please connect Wallet')
            return
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
        })

        const signer = provider.getSigner()
        const owner = await signer.getAddress()
        const contract = new ethers.Contract(BNPL_ADDRESS, BNPL_ABI, signer)

        if (nftData.state === 'LISTED') {
            await contract.cancelListing(tokenAddress, tokenId).then(() => {
                axios.patch(`${SERVER_URL}/state`, {
                    state: state,
                    price: 0,
                    owner: owner,
                    tokenId: tokenId,
                    nftAddress: tokenAddress,
                })
            })
        }

        if (nftData.state === 'MARGIN_LISTED') {
            await contract
                .cancelMarginListing(tokenAddress, tokenId)
                .then(() => {
                    axios.patch(`${SERVER_URL}/state`, {
                        state: 'LISTED_CANCELLED',
                        price: 0,
                        owner: owner,
                        tokenId: tokenId,
                        nftAddress: tokenAddress,
                    })
                })
        }
    }

    async function claimNFT(nftData) {
        const tokenAddress = nftData.nftAddress
        const tokenId = nftData.tokenId

        console.log('CLAIM NFT CALLED')
        if (!address) {
            alert('Please connect Wallet')
            return
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chainId must be in hexadecimal
        })

        const contract = new ethers.Contract(BNPL_ADDRESS, BNPL_ABI, signer)

        await contract.claimNFTbyBuyer(tokenAddress, tokenId).then(() => {
            axios.patch(`${SERVER_URL}/state`, {
                state: 'CLAIMED',
                price: 0,
                owner: address,
                tokenId: tokenId,
                nftAddress: tokenAddress,
            })
        })
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
                getDueAmount,
                repay,
                marginList,
                cancelListing,
                claimNFT,
                listNFT
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
