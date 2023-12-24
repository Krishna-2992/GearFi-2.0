import React from 'react'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { RiDiscordFill } from 'react-icons/ri'

const Footer = () => {
    return (
        <div className='footer section__padding'>
            <div className='footer-copyright'>
                <div>
                    <p>
                        {' '}
                        © {new Date().getFullYear()} GEARFI. All Rights Reserved
                    </p>
                </div>
                <div className='flex'>
                    <AiOutlineInstagram
                        size={25}
                        color='white'
                        className='footer-icon'
                    />
                    <AiOutlineTwitter
                        size={25}
                        color='white'
                        className='footer-icon'
                    />
                    <RiDiscordFill
                        size={25}
                        color='white'
                        className='footer-icon'
                    />
                </div>
            </div>
        </div>
    )
}

export default Footer
