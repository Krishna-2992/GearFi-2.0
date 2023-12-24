import React, { useState } from 'react'
import { useEffect } from 'react'
import { ethers } from 'ethers'
import { BNPL_ABI } from '../assets/constants'
import MetaMaskAuthButton from '../components/metaskauth/metamask'

export default function Staking() {
    const [active, setActive] = React.useState('deposit')
    const [vaultBalance, setVaultBalance] = useState('')
    const [userBalance, setUserBalance] = useState()
    const [maxWithdraw, setMaxWithdraw] = useState()
    const [chainId, setChainId] = useState()
    const [accounts, setAccounts] = useState([])

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    useEffect(async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts',
            })
            setAccounts(accounts)
        }
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setChainId(chainId)
    }, [])

    useEffect(() => {
        getVaultBalance().then((res) => {
            setVaultBalance(res)
            setMaxWithdraw(res * 0.5)
        })

        getUserBalance().then((res) => {
            setUserBalance(res)
        })
    })

    async function switchChain() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }],
            })
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x13881',
                                chainName: 'Shardeum Sphinx DApp 1.X',
                                rpcUrls: ['https://dapps.shardeum.org/'],
                            },
                        ],
                    })
                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        }
    }

    async function getVaultBalance() {
        if (window.ethereum && chainId === '0x13881') {
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
                BNPL_ABI,
                signer
            )
            const vaultBalance = await contract.getVaultBalance()
            return parseInt(vaultBalance._hex, 16) / 10 ** 18
        }
    }

    async function getUserBalance() {
        if (window.ethereum && chainId === '0x13881' && accounts.length > 0) {
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
                BNPL_ABI,
                signer
            )
            const userBalance = await contract.getBalance(signer.getAddress())
            return parseInt(userBalance._hex, 16) / 10 ** 18
        }
    }

    async function deposit(amount) {
        if (window.ethereum && chainId === '0x13881' && accounts.length > 0) {
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
                BNPL_ABI,
                signer
            )
            console.log('amount: ', amount)
            const depositResponse = await contract.deposit({
                value: ethers.utils.parseEther(amount),
            })
            console.log('Deposit: ', depositResponse)
        }
    }

    async function withdraw(amount) {
        if (window.ethereum && chainId === '0x13881' && accounts.length > 0) {
            if (amount > maxWithdraw) {
                alert('Not enough balance in vault')
                return
            }
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
                BNPL_ABI,
                signer
            )

            const withdrawResponse = await contract.withdraw(
                ethers.utils.parseEther(amount)
            )
            console.log('withdraw: ', withdrawResponse)
        }
    }

    return (
        <div className='min-h-screen h-full'>
            {accounts.length === 0 ? (
                <div className=' text-white h-[100vh] flex flex-col justify-center items-center mx-auto text-3xl'>
                    <h>Please Connect Metamask Wallet to Access Vault</h>
                    <MetaMaskAuthButton />
                </div>
            ) : (
                <div>
                    {chainId !== '0x13881' ? (
                        <div className=' text-white h-[100vh] flex flex-col justify-center items-center mx-auto text-3xl'>
                            <h>Please Switch to Shardeum Testnet</h>
                            <button
                                className='text-[#0ea5e9] bg-gray-800 border-2 border-gray-900 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4'
                                onClick={switchChain}
                            >
                                Switch Network
                            </button>
                        </div>
                    ) : (
                        <div className=' flex-row justify-items-center py-28 text-white h-[100vh] w-1/2 mx-auto '>
                            <div className=' text-3xl text-center'>
                                GearFi Vault
                            </div>

                            {active === 'deposit' ? (
                                <div className='text-xl mt-4 text-center mb-4'>
                                    Deposit SHM into vault
                                </div>
                            ) : (
                                <div className='text-xl mt-4 text-center mb-4'>
                                    Withdraw SHM from vault
                                </div>
                            )}
                            <div className='border border-slate-500'>
                                <div className='flex justify-center '>
                                    <div
                                        className={`m-4  p-4 ${
                                            active === 'deposit'
                                                ? 'bg-slate-700 rounded-xl'
                                                : 'white-glassmorphism'
                                        } 
        cursor-pointer`}
                                        onClick={() => {
                                            setActive('deposit')
                                        }}
                                    >
                                        Deposit
                                    </div>
                                    <div
                                        className={`m-4  p-4 ${
                                            active === 'withdraw'
                                                ? 'bg-slate-700 rounded-xl'
                                                : 'white-glassmorphism'
                                        } 
        cursor-pointer`}
                                        onClick={() => {
                                            setActive('withdraw')
                                        }}
                                    >
                                        Withdraw
                                    </div>
                                </div>
                                {active === 'deposit' && (
                                    <div className='flex flex-col items-center h-48'>
                                        <div className='flex border border-white w-5/6 justify-between p-4 m-4 rounded-md'>
                                            <div className='flex flex-col '>
                                                <div>Amount</div>
                                                <div>
                                                    <input
                                                        type='text'
                                                        placeholder='0.0'
                                                        className=' bg-transparent border-white px-2'
                                                        id='depositAmount'
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div>
                                                    Your Balance: {userBalance}{' '}
                                                    SHM
                                                </div>
                                                <div>
                                                    Vault Balance:{' '}
                                                    {vaultBalance} SHM
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className='flex bg-slate-900 w-5/6 justify-center p-8 m-4 rounded-md'>
          Deposit ETH to GearFi Vault.
        </div> */}
                                        <div className='flex'>
                                            <button
                                                className='text-[#0ea5e9] bg-gray-800 border-2 border-gray-900 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4'
                                                onClick={() => {
                                                    deposit(
                                                        document.getElementById(
                                                            'depositAmount'
                                                        ).value
                                                    )
                                                }}
                                            >
                                                Deposit
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {active === 'withdraw' && (
                                    <div className='flex flex-col items-center h-48'>
                                        <div className='flex border border-white w-5/6 justify-between p-4 m-4 rounded-md'>
                                            <div className='flex flex-col'>
                                                <div>Amount</div>
                                                <div>
                                                    <input
                                                        type='text'
                                                        placeholder='0.0'
                                                        className='px-2 bg-transparent'
                                                        id='withdrawAmount'
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div>
                                                    Your Balance: {userBalance}{' '}
                                                    SHM
                                                </div>
                                                <div>
                                                    Max Withdraw : {maxWithdraw}{' '}
                                                    SHM
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className='flex bg-slate-500 w-5/6 justify-center p-4 m-4 rounded-md'>
            <input
              type='checkbox'
              name=''
              id=''
              className='mx-4 bg-transparent'
            />
            Withdraw all - Withdraw total deposited ETH
          </div> */}
                                        <div className='flex'>
                                            <button
                                                className='text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4'
                                                onClick={() => {
                                                    withdraw(
                                                        document.getElementById(
                                                            'withdrawAmount'
                                                        ).value
                                                    )
                                                    document.getElementById(
                                                        'withdrawAmount'
                                                    ).innerText = '0.0'
                                                }}
                                            >
                                                Withdraw
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
