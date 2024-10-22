import React from 'react'
import Avatar from 'react-avatar'
import { RiMenu3Line } from "react-icons/ri";
import logo from '../assets/logo.png'
import { BiSearchAlt } from "react-icons/bi";
import { RiMic2Line } from "react-icons/ri";
import { SiDarkreader } from "react-icons/si";
import { TbVideoPlus } from "react-icons/tb";
import { RiNotification2Line } from "react-icons/ri";
import Profile from '../assets/profile.png'


const navbar = () => {
  return (
    <div className='flex justify-between px-6 py-2'> 
        <div className='flex items-center space-x-4 '>
        <RiMenu3Line size ={"28px"} className='cursor-pointer hover:bg-gray-200 rounded-full p-1 duration-200'/>
        <img src={logo} alt="logo" className='w-8 cursor-pointer' />
        </div>
        <div className='flex w-[30%]'>
            <div className='w-[100%] px-3 py-2 rounded-l-full bg-gray-50'>
                <input type="text" placeholder='search' className='outline-none bg-gray-50'/> 
            </div>
            <button className='px-4 py-2  bg-gray-100 rounded-r-full'>
                <BiSearchAlt size={"20px"} />
            </button>
            <RiMic2Line size={"42px"}   className='ml-3 border rounded-full p-2 cursor-pointer hover:bg-gray-200 duration-200'/>
        </div>
        <div className='flex space-x-5 place-items-center'>
            <SiDarkreader size={"28px"} className='cursor-pointer hover:bg-gray-200 rounded-full p-1 duration-200' />
            <TbVideoPlus size={"28px"} className='cursor-pointer hover:bg-gray-200 rounded-full p-1 duration-200'/>
            <RiNotification2Line size={"28px"} className='cursor-pointer hover:bg-gray-200 rounded-full p-1 duration-200' />
            <Avatar src={Profile} size='32' round={true} className='cursor-pointer' />
        </div>
    </div>
    
  )
}

export default navbar