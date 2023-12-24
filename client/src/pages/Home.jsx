import React from 'react'

import Header from '../components/Header'
import TopCollection from "../components/TopCollections"
import Staking from '../components/Staking'
import PopularCollections from '../components/PopularCollections'
import EarlyAccess from '../components/EarlyAccess'
import ComingSoon from '../components/ComingSoon'
import Footer from '../components/Footer'

// import { Footer, PopularCollections, TopCollection } from '../../components'
// import Staking from '../../components/staking/Staking'
// import ComingSoon from '../../components/comingSoon/comingSoon'
// import EarlyAccess from '../../components/earlyAccess/EarlyAccess'

const Home = () => {
    return (
        <div>
            <Header />
            <TopCollection/>
            <Staking/>
            <PopularCollections/>
            <EarlyAccess/>
            <ComingSoon/>
            <Footer />
        </div>
    )
}

export default Home
