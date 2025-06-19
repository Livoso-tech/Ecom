import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import logo from "../assets/images/livosologo.png";
import DateRangeSelector from "./DateRangeSelector";

const AdminHeader = ({ toggleSidebar }) => {
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Toggle theme between dark and light
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Extract breadcrumb from path
  const pathSegments = location.pathname
    .split("/")
    .filter(segment => segment && segment !== "admin")
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1));
  
  // Theme-based styles
  const headerBg = isDarkMode 
    ? "bg-gradient-to-r from-gray-900 to-gray-800" 
    : "bg-gradient-to-r from-gray-100 to-gray-300";
    
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-white";
  const dropdownBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const dropdownHover = isDarkMode ? "hover:bg-gray-750" : "hover:bg-gray-100";
  const dropdownText = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const iconColor = isDarkMode ? "text-gray-300" : "text-gray-600";

  // Mock notifications
  const notifications = [/* ... */]; // Same as original

  return (
    <header className={`sticky top-0 z-20 shadow-xl ${headerBg} ${textColor}`}>
      {/* Top Navigation Bar */}
      <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
        {/* Left Section */}
         <nav className="flex items-center mb-3 md:mb-0">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <div className="flex items-center">
              <HomeIcon className="mr-1" />
              <span className="ml-1">Home</span>
            </div>
          </Link>
          
          {pathSegments.map((segment, index) => (
            <div key={index} className="flex items-center">
              <span className={`mx-2 ${secondaryText}`}>/</span>
              <span 
                className={`${
                  index === pathSegments.length - 1 
                    ? `${dropdownText} font-medium` 
                    : secondaryText
                } capitalize`}
              >
                {segment}
              </span>
            </div>
          ))}
        </nav>

        {/* Center Search */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${iconColor}`}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 ${inputBg} rounded-lg ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Right Section */}
         <div className="flex-shrink-0 w-full md:w-auto">
          <DateRangeSelector isDarkMode={isDarkMode} />
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${hoverBg}`}
          >
            {isDarkMode ? (
              <LightModeIcon className={iconColor} />
            ) : (
              <DarkModeIcon className={iconColor} />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`p-2 rounded-full relative ${hoverBg}`}
            >
              <NotificationsIcon className={iconColor} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Notifications Dropdown */}
            {notificationOpen && (
              <div className={`absolute right-0 mt-2 w-80 ${dropdownBg} rounded-xl shadow-2xl overflow-hidden z-50`}>
                <div className={`p-4 border-b ${borderColor}`}>
                  <h3 className={`font-semibold text-lg ${dropdownText}`}>Notifications</h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b ${borderColor} ${dropdownHover} transition-colors`}
                    >
                      {/* Notification content */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  isDarkMode 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gradient-to-r from-blue-200 to-purple-300 text-purple-800"
                }`}>
                  A
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
            </button>
            
            {/* User Dropdown */}
            {userMenuOpen && (
              <div className={`absolute right-0 mt-2 w-64 ${dropdownBg} rounded-xl shadow-2xl overflow-hidden z-50`}>
                <div className={`p-4 border-b ${borderColor}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      isDarkMode 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-gradient-to-r from-blue-200 to-purple-300 text-purple-800"
                    }`}>
                      A
                    </div>
                    <div>
                      <h3 className={`font-semibold ${dropdownText}`}>Admin User</h3>
                      <p className={`${secondaryText} text-sm`}>Administrator</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <div className={`p-3 rounded-lg mb-2 ${
                    isDarkMode ? "bg-gray-750" : "bg-gray-100"
                  }`}>
                    <p className={`text-xs ${secondaryText}`}>Total Earnings</p>
                    <p className={`${dropdownText} font-semibold`}>$24,568.00</p>
                  </div>
                  
                  <button 
                    onClick={() => console.log("Logout")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg ${dropdownHover} transition-colors`}
                  >
                    <LogoutIcon className="text-red-400" />
                    <span className={dropdownText}>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
     
    </header>
  );
};

export default AdminHeader;