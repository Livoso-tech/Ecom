import React, { useContext, useState } from 'react'
import Logo from './Logo'
import { ImGrin, ImSearch } from "react-icons/im";
import { FaRegUserCircle } from "react-icons/fa";
import { FaShoppingCart, } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummerApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { useNavigate } from 'react-router-dom';
import Moglix from '../assest/Moglix.gif'
import { FaUserCircle } from "react-icons/fa";
import {  FaRegHeart, FaQuestionCircle, FaSignOutAlt, FaSignInAlt, FaUserShield } from "react-icons/fa";



const Header = () => {
  const [menudisplay, setmenudisplay] = useState(false)
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const searchInput = useLocation()
  const [searchdata, setSearchInput] = useState(searchInput.search.split('=')[1])
  console.log("searchInput", searchInput.search.split('=')[1])
  //console.log("user header", user)

  // here the context use for countAddProduct present in add to cart product (app.js featchUserAddtoCart)
  const context = useContext(Context)
  console.log('header add to cart count', context)

  const hendelLogout = async () => {
    const featchData = await fetch(SummerApi.logout_user.url, {
      method: SummerApi.logout_user.method,
      credentials: 'include',


    })
    const data = await featchData.json()
    if (data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
    }
    if (data.err) {
      toast.error(data.message)
    }
  }

  //for the search product ................................................................
  const handleSearch = (e) => {
    const { value } = e.target
    setSearchInput(value)
    if (value) {
      navigate(`/search?q=${value}`)
    } else {
      navigate("/search")
    }

    //for the search product ................................................................

  }
  return (
    <header className=' h-16 shadow-md bg-white fixed w-full z-40'>
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className="flex-shrink-0 flex items-center">
          {/* <Link to="/" className="text-xl font-bold text-indigo-600"> </Link> */}
          <Link to="/" className='flex items-center gap-2'>
            <img src={Moglix} alt="logo" className=' h-10' />
            
          </Link>
        </div>
        {/* <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Home
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Shop
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Categories
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            About
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Contact
          </a>
        </div> */}

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded '>
          <input type="text" placeholder='Search product here  ' className='w-full outline-none pl-4' value={searchdata} onChange={handleSearch} />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center  justify-center rounded-r-md text-white' >
            <ImSearch />
          </div>
        </div>

        <div className='flex gap-8 justify-center'>
          <div className=' cursor-pointer relative group justify-center'>
  {
    user?._id && (
      <div className='text-3xl ' onClick={() => { setmenudisplay(prev => !prev) }}>
        {
          user?.profilepic ? (
            <img src={user?.profilepic} className='w-10 h-10 rounded-full' alt={user?.name} />
          ) : (<FaRegUserCircle />)
        }
      </div>
    )
  }


{
  menudisplay && (
    <div className='absolute bg-white bottom-0 top-11 left-[-70px] h-fit p-2 shadow-lg rounded min-w-[180px]'>
      <nav className="flex flex-col gap-1">
        {user?.role === ROLE.ADMIN && (
          <Link
            to={"admin"}
            className='flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded transition-colors duration-150 font-medium'
          >
            <FaUserShield className="text-md" />
            Admin Panel
          </Link>
        )}
        <Link
          to="/wishlist"
          className='flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded transition-colors duration-150 font-medium'
        >
          <FaRegHeart className="text-lg" />
          Wishlist
        </Link>
        <Link
          to="/cart"
          className='flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded transition-colors duration-150 font-medium'
        >
          <FaShoppingCart className="text-lg" />
          Cart
        </Link>
        <Link
          to="/faq"
          className='flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded transition-colors duration-150 font-medium'
        >
          <FaQuestionCircle className="text-lg" />
          My FAQ
        </Link>
        <div className='border-t my-2'></div>
        {user?._id ? (
          <button
            onClick={hendelLogout}
            className='flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-red-700 px-3 py-2 transition-colors duration-150 font-medium'
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className='flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 px-3 py-2 transition-colors duration-150 font-medium'
          >
            <FaSignInAlt className="text-lg" />
            Login
          </Link>
        )}
      </nav>
    </div>
  )
}
</div>
          <Link to={"/Cart"} className='text-2xl  relative'>
           
            {
              user?._id && (
                <>
                 <span><FaShoppingCart /></span>
                <div className=' flex bg-indigo-600 text-white w-5 h-5 rounded-full p-1 items-center justify-center absolute -top-2 -right-3  '>
                  <p className='text-sm'>{context?.countProduct}</p>
                </div>
                </>
              )
            }

          </Link>
          <div>
            {
              user?._id ? (

                 <div onClick={hendelLogout} className='flex items-center gap-2 bg-red-600 text-white rounded-full hover:bg-red-700  px-3 py-1'>
                 <FaUserCircle />

                <Link to={"/Login"} className=''>Logout</Link>
               </div>
              ) : (
              <div className='flex items-center gap-2 bg-red-600 text-white rounded-full hover:bg-red-700  px-3 py-1'>
                 <FaUserCircle />

                <Link to={"/Login"} className=''>    login</Link>
               </div>
              )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
