import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiUser, FiHome, FiShoppingBag, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { RiAdminLine } from 'react-icons/ri';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import ROLE from '../common/role';
import logo from '../assest/logo.svg'
import SummerApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import { useDispatch} from 'react-redux';




function AdminPanel() {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

    const dispatch = useDispatch()
  

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate('/');
    }
    // Set active tab based on current route
    setActiveTab(location.pathname.split('/').pop());
  }, [user, navigate, location]);

  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <FiHome size={20} /> },
    { name: 'All Users', path: 'all-user', icon: <FiUser size={20} /> },
    { name: 'Products', path: 'all-product', icon: <FiShoppingBag size={20} /> },
    { name: 'Settings', path: 'settings', icon: <FiSettings size={20} /> },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row md:mt-[-50px]">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <img src={logo} alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center">
          {user?.profilepic ? (
            <img 
              src={user.profilepic} 
              className="w-8 h-8 rounded-full" 
              alt={user.name} 
            />
          ) : (
            <FiUser size={20} className="text-gray-600" />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block bg-white shadow-lg w-full md:w-64 fixed md:relative  z-10 transition-all duration-300`}>
        <div className="p-4 flex flex-col h-full">
          {/* Logo/Brand */}
          {/* <div className="mb-8 p-4 hidden md:block">
            <img src={logo} alt="Logo" className="h-8" />
          </div> */}

          {/* User Profile */}
          <div className="flex flex-col items-center mb-8 p-4 border-b border-gray-100">
            <div className="relative mb-4">
              {user?.profilepic ? (
                <img 
                  src={user.profilepic} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" 
                  alt={user.name} 
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
                  <FiUser size={24} className="text-blue-500" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <RiAdminLine className="text-white" size={14} />
              </div>
            </div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{user?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg mb-1 transition-all ${activeTab === item.path ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={`mr-3 ${activeTab === item.path ? 'text-blue-500' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer/Sign Out */}
          <div className="mt-auto p-4 border-t border-gray-100">
            <button
              onClick={hendelLogout}
              className="flex items-center w-full p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <FiLogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ">
        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Content Header */}
        {/* <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab.replace('-', ' ') || 'Dashboard'}
          </h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div> */}

        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;