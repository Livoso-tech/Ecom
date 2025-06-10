import React, { useState } from 'react';
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummerApi from '../common';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(SummerApi.signIn.url, {
        credentials: 'include',
        method: SummerApi.signIn.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      console.log(response)

      const dataApi = await response.json();
  
      if (dataApi.success) {
        toast.success(dataApi.message);
        localStorage.setItem('token', dataApi.data);
        // Cookies.set('token', dataApi.data, { expires: 7 }); 
        navigate('/');
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 ">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-500 hover:shadow-2xl">
        {/* Left Side - Visual */}
        <div 
          className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-10 flex flex-col justify-center relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${isHovered ? 'opacity-20' : 'opacity-10'}`}
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')" }}>
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Welcome Back!</h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Login to discover exclusive deals and personalized recommendations.
            </p>
            {/* <div className="flex justify-center">
              <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-filter backdrop-blur-sm border border-white border-opacity-30">
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div> */}
          </div>

             <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign in with
                </span>               
              </div>
              
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaGoogle className="mr-2 text-red-500" />
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaFacebookF className="mr-2 text-blue-600" />
                Facebook
              </button>
            </div>

            {/* <div className='flex justify-center mt-2'>
               <p className='text-white'>Don't have an account ? <Link to={"/sign-up"} className=' text-gray-300 hover:text-red-700'>Sign-up</Link></p>  
            </div> */}

            
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-indigo-200 text-sm">
              Not a member?{' '}
              <Link to="/sign-up" className="font-semibold text-white hover:underline">
                Join now
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
            <p className="text-gray-500 mt-2 text-sm">Access your account to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-indigo-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BiSolidHide size={20} /> : <BiSolidShow size={20} />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link 
                  to="/Forgot-Password" 
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Login'}
            </button>
          </form>

          {/* <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign in with
                </span>               
              </div>
              
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaGoogle className="mr-2 text-red-500" />
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaFacebookF className="mr-2 text-blue-600" />
                Facebook
              </button>
            </div>

            <div className='flex justify-center mt-2'>
               <p>Don't have an account ? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700'>Sign-up</Link></p>  
            </div>

            
          </div> */}
          
        </div>
      </div>
    </section>
  );
};

export default Login;