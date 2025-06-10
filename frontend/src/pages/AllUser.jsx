import React, { useEffect, useState } from 'react';
import SummerApi from '../common';
import { toast } from 'react-toastify';
import moment from "moment";
import { FiEdit2, FiSearch, FiChevronUp, FiChevronDown, FiUser, FiMail, FiShield, FiCalendar } from "react-icons/fi";
import { RiAdminFill, RiUserStarFill } from "react-icons/ri";
import { MdOutlineManageAccounts } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';

function AllUser() {
  const [alluser, setallUser] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [closeBar, setCloseBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: '',
    name: '',
    role: '',
    _id: ''
  });

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummerApi.allUser.url, {
        method: SummerApi.allUser.method,
        credentials: 'include'
      });
      const dataResponse = await response.json();
      
      if (dataResponse.success) {
        setallUser(dataResponse.data);
        setFilteredUsers(dataResponse.data);
      } else if (dataResponse.error) {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const results = alluser.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, alluser]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    
    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <span className="opacity-30"><FiChevronUp size={14} /></span>;
    return sortConfig.direction === 'asc' 
      ? <FiChevronUp size={14} className="text-blue-500" /> 
      : <FiChevronDown size={14} className="text-blue-500" />;
  };

  const toggleRowSelection = (userId) => {
    setSelectedRows(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin':
        return <RiAdminFill className="text-purple-500" size={18} />;
      case 'moderator':
        return <RiUserStarFill className="text-blue-500" size={18} />;
      default:
        return <MdOutlineManageAccounts className="text-green-500" size={18} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-1 md:pt-0 ">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
                <p className="text-blue-100 mt-1">Manage all registered users and their permissions</p>
              </div>
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-blue-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full bg-blue-700 bg-opacity-20 text-white placeholder-blue-200 rounded-lg focus:ring-2 focus:ring-white focus:bg-opacity-30 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {/* Select all checkbox */}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <FiUser size={14} className="text-gray-400" />
                        Name
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center gap-1">
                        <FiMail size={14} className="text-gray-400" />
                        Email
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => requestSort('role')}
                    >
                      <div className="flex items-center gap-1">
                        <FiShield size={14} className="text-gray-400" />
                        Role
                        {getSortIcon('role')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => requestSort('createAt')}
                    >
                      <div className="flex items-center gap-1">
                        <FiCalendar size={14} className="text-gray-400" />
                        Created Date
                        {getSortIcon('createAt')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers.length > 0 ? (
                    sortedUsers.map((el, index) => (
                      <tr 
                        key={el._id} 
                        className={`transition ${selectedRows.includes(el._id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(el._id)}
                            onChange={() => toggleRowSelection(el._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {el.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{el.name}</div>
                              <div className="text-xs text-gray-500">ID: {el._id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{el.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(el.role)}
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${el.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                el.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {el.role.charAt(0).toUpperCase() + el.role.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{moment(el.createAt).format('LL')}</div>
                          <div className="text-xs text-gray-500">{moment(el.createAt).fromNow()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setCloseBar(true);
                              setUpdateUserDetails(el);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4 transition transform hover:scale-110 p-2 rounded-full hover:bg-blue-50"
                            title="Edit user"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FiUser size={48} className="mb-4 opacity-30" />
                          <h3 className="text-lg font-medium">No users found</h3>
                          <p className="mt-1">Try adjusting your search query</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {sortedUsers.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{sortedUsers.length}</span> of{' '}
                <span className="font-medium">{alluser.length}</span> users
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={selectedRows.length === 0}
                >
                  Bulk Actions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {closeBar && (
        <ChangeUserRole
          onClose={() => setCloseBar(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userid={updateUserDetails._id}
          callfun={fetchAllUsers}
        />
      )}
    </div>
  );
}

export default AllUser;