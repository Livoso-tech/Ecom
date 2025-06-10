import { useState } from 'react';
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import convertImageToBase64 from '../helper/Imagetobase64';
import SummerApi from '../common';
import { toast } from 'react-toastify';
import loginIcons from '../assest/signin.gif';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilepic: ""
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(SummerApi.signup.url, {
        method: SummerApi.signup.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const dataApi = await response.json();
      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const image = await convertImageToBase64(file);
    setData(prev => ({
      ...prev,
      profilepic: image
    }));
  };

  return (
    <section className="flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Visual */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-6 flex flex-col justify-center relative">
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Us!</h2>
            <p className="text-indigo-100 mb-6 text-sm">
              Create an account to unlock exclusive features
            </p>
            {/* <div className="flex justify-center">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-filter backdrop-blur-sm border border-white border-opacity-30">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
            </div> */}

          </div>
          <div className="mt-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500 ">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaGoogle className="mr-2 text-red-500 text-sm" />
                Google
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaFacebookF className="mr-2 text-blue-600 text-sm" />
                Facebook
              </button>
            </div>

            <div className='text-center mt-4'>
              <p className="text-xs text-white">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-white0 hover:text-indigo-500">
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* <div className="mt-4 text-center">
            <p className="text-indigo-200 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-white hover:underline">
                Login now
              </Link>
            </p>
          </div> */}
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
            <p className="text-gray-500 mt-1 text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={data.profilepic || loginIcons}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUploadPic}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Form Fields in 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500 hover:text-indigo-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BiSolidHide size={16} /> : <BiSolidShow size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleOnChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500 hover:text-indigo-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {/* {showConfirmPassword ? <BiSolidHide size={16} /> : <BiSolidShow size={16} />} */}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className='text-center mt-4'>
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;