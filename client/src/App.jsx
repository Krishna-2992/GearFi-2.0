import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'

import UserContextProvider from './context/userContextProvider'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Profile from './pages/Profile'
import Collection from './pages/Collection'
import Item from './pages/Item'
import ProfileItem from './pages/ProfileItem'
import Staking from './components/Staking'

function App() {
    return (
        <UserContextProvider>
            <div className='gradient-bg-welcome'>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/user/:userAddress' element={<Profile />} />
                    <Route
                        path='collection/:collAddress'
                        element={<Collection />}
                    />
                    <Route
                        path='/collection/:tokenAddress/:tokenId'
                        element={<Item />}
                    />
                    <Route
                        path='/account/:tokenAddress/:tokenId'
                        element={<ProfileItem />}
                    />
                    <Route path = '/staking' element={<Staking/>} />
                </Routes>
            </div>
        </UserContextProvider>
    )
}

export default App
