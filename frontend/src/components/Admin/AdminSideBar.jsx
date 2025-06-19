import React, { useState ,useEffect} from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Phone as PhoneIcon,
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useSelector } from 'react-redux'

const AdminSidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});


 const user = useSelector(state => state?.user?.user); 

console.log("user details in admin sidebar",user)   

//  useEffect(() => {
//       // user Details
//       fetchUserDetails();
//       console.log("")
//       // total number of cart present
      
//     }, [])

  const isActive = (path) => location.pathname === path;

  const toggleSubmenu = (key) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpandMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon className="w-5 h-5" />,
      to: "/admin",
    },
    {
      text: "Upload Product",
      icon: <DashboardIcon className="w-5 h-5" />,
      to: "/admin/upload",
    },
    {
      text: "Payments",
      icon: <PaymentIcon className="w-5 h-5" />,
      to: "/admin/dashboard/payment",
    },
    {
      text: "All User",
      icon: <PaymentIcon className="w-5 h-5" />,
      to: "/admin/all-user",
    },
    {
      text: "All Product",
      icon: <PaymentIcon className="w-5 h-5" />,
      to: "/admin/all-product",    
    },
  ];

  const settingsItems = [
    { 
      text: "Settings", 
      icon: <SettingsIcon className="w-5 h-5" />, 
      to: "/admin/settings",
      subItems: [
        { text: "General", to: "/admin/settings/general" },
        { text: "Security", to: "/admin/settings/security" },
        { text: "Notifications", to: "/admin/settings/notifications" },
      ]
    },
  ];

  return (
    <div 
      className={`fixed inset-y-0 z-30 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transition-all duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
      style={{ width: drawerWidth }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">L</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Livoso
          </span>
        </div>
        
        <button
          onClick={handleDrawerToggle}
          className="p-1.5 rounded-lg hover:bg-gray-700 md:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="text-gray-300" />
        </button>
      </div>

      {/* User Profile */}
      <div className="p-6 flex flex-col items-center border-b border-gray-700">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        <h3 className="font-semibold text-lg">{user.role}</h3>
        <p className="text-gray-400 text-sm">{user.name}</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden  py-4 scrollbar-thin  s">
        <nav>
          <ul className="space-y-1 px-2">
            {[...navItems, ...settingsItems].map((item, index) => (
              <li key={index}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => {
                        toggleSubmenu(`item-${index}`);
                        toggleExpandMenu(`item-${index}`);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        isActive(item.to) 
                          ? "bg-indigo-600 text-white" 
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.text}</span>
                      </div>
                      <ExpandMoreIcon className={`transform transition-transform ${expandedMenus[`item-${index}`] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openSubmenus[`item-${index}`] && (
                      <ul className="pl-8 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.to}
                              className={`block p-3 rounded-lg transition-all ${
                                isActive(subItem.to)
                                  ? "bg-indigo-500/20 text-indigo-300"
                                  : "hover:bg-gray-700/50 text-gray-400"
                              }`}
                            >
                              {subItem.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.to}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive(item.to)
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Emergency Contact */}
      <div className=" border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <PhoneIcon className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Emergency Contact</p>
            <p className="font-medium">(555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;