import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import ReactCalendar from "react-calendar";
import SummerApi from "../../common";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [userTrendData, setUserTrendData] = useState([]);
  const [productTrendData, setProductTrendData] = useState([]);
  const [paymentTrendData, setPaymentTrendData] = useState([]);
  const [userMonthlyChange, setUserMonthlyChange] = useState(0);
  const [productMonthlyChange, setProductMonthlyChange] = useState(0);
  const [paymentMonthlyChange, setPaymentMonthlyChange] = useState({ amount: 0, percentage: 0 });
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears] = useState([2023, 2024, 2025]);
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummerApi.allUser.url, {
        method: SummerApi.allUser.method,
        credentials: 'include'
      });
      const dataResponse = await response.json();
      
      if (dataResponse.success) {
        setAllUsers(dataResponse.data);
        processUserData(dataResponse.data);
      } else if (dataResponse.error) {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(SummerApi.getallProduct.url);
      const dataResponse = await response.json();
      setAllProducts(dataResponse?.data || []);
      processProductData(dataResponse?.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchTrainers = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch(SummerApi.getTrainers.url);
      const data = await response.json();
      setTrainers(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch trainers');
    }
  };

  const processUserData = (users) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const monthlyData = months.map(month => ({
      name: month,
      users: 0
    }));

    users.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].users += 1;
      }
    });

    setUserTrendData(monthlyData);
    calculateMonthlyChanges(monthlyData, 'users', setUserMonthlyChange);
  };

  const processProductData = (products) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const monthlyData = months.map(month => ({
      name: month,
      products: 0
    }));

    products.forEach(product => {
      if (product.createdAt) {
        const date = new Date(product.createdAt);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].products += 1;
      }
    });

    setProductTrendData(monthlyData);
    calculateMonthlyChanges(monthlyData, 'products', setProductMonthlyChange);
  };

  const processPaymentData = (payments) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const monthlyData = months.map(month => ({
      name: month,
      amount: 0,
      count: 0
    }));

    payments.forEach(payment => {
      if (payment.createdAt) {
        const date = new Date(payment.createdAt);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].amount += payment.amount || 0;
        monthlyData[monthIndex].count += 1;
      }
    });

    setPaymentTrendData(monthlyData);
    calculatePaymentMonthlyChanges(monthlyData);
  };

  const calculateTotalPayments = (payments) => {
    const total = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    setTotalPayments(total);
  };

  const calculateMonthlyChanges = (monthlyData, key, setChangeFunction) => {
    const currentMonth = new Date().getMonth();
    const currentMonthCount = monthlyData[currentMonth]?.[key] || 0;
    const prevMonthCount = monthlyData[currentMonth - 1]?.[key] || 0;
    setChangeFunction(currentMonthCount - prevMonthCount);
  };

  const calculatePaymentMonthlyChanges = (monthlyData) => {
    const currentMonth = new Date().getMonth();
    const currentMonthAmount = monthlyData[currentMonth]?.amount || 0;
    const prevMonthAmount = monthlyData[currentMonth - 1]?.amount || 0;
    
    const changeAmount = currentMonthAmount - prevMonthAmount;
    const changePercentage = prevMonthAmount > 0 ? 
      Math.round((changeAmount / prevMonthAmount) * 100) : 
      currentMonthAmount > 0 ? 100 : 0;
    
    setPaymentMonthlyChange({
      amount: changeAmount,
      percentage: changePercentage
    });
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleView = (member) => {
    navigate(`/user-profile/${member.id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleDelete = () => {
    toast.success("User deleted successfully");
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllProducts();
    fetchTrainers();
  }, [selectedYear]);

  // Mock data for demonstration
  useEffect(() => {
    // Mock members data
    setMembers([
      { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", createdAt: "2023-05-15", status: "ACTIVE", gender: "Male" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", createdAt: "2023-06-20", status: "ACTIVE", gender: "Female" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Trainer", createdAt: "2023-07-10", status: "INACTIVE", gender: "Male" },
      { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", createdAt: "2023-08-05", status: "ACTIVE", gender: "Female" },
    ]);

    // Mock payment data
    const mockPayments = [
      { id: 1, amount: 1500, createdAt: "2023-01-15" },
      { id: 2, amount: 2000, createdAt: "2023-02-20" },
      { id: 3, amount: 1800, createdAt: "2023-03-10" },
      { id: 4, amount: 2500, createdAt: "2023-04-05" },
      { id: 5, amount: 3000, createdAt: "2023-05-12" },
      { id: 6, amount: 2200, createdAt: "2023-06-18" },
      { id: 7, amount: 2800, createdAt: "2023-07-22" },
      { id: 8, amount: 3200, createdAt: "2023-08-08" },
    ];
    
    processPaymentData(mockPayments);
    calculateTotalPayments(mockPayments);
  }, []);

  // Chart colors
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
  
  // Status colors
  const getStatusColor = (status) => {
    return status === "ACTIVE" ? "bg-green-500" : "bg-red-500";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-indigo-50 mr-4">
                  <UsersIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{allUsers.length}</h3>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className={`flex items-center ${userMonthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <ArrowTrendingUpIcon className={`h-4 w-4 ${userMonthlyChange >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`} />
                  <span className="text-xs font-medium">
                    {userMonthlyChange >= 0 ? '+' : ''}{userMonthlyChange} this month
                  </span>
                </div>
              </div>
            </div>
            <div className="w-20 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userTrendData}>
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-emerald-50 mr-4">
                  <ShoppingBagIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{allProducts.length}</h3>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className={`flex items-center ${productMonthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <ArrowTrendingUpIcon className={`h-4 w-4 ${productMonthlyChange >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`} />
                  <span className="text-xs font-medium">
                    {productMonthlyChange >= 0 ? '+' : ''}{productMonthlyChange} this month
                  </span>
                </div>
              </div>
            </div>
            <div className="w-20 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productTrendData}>
                  <Line
                    type="monotone"
                    dataKey="products"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-amber-50 mr-4">
                  <CurrencyDollarIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalPayments)}</h3>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className={`flex items-center ${paymentMonthlyChange.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <ArrowTrendingUpIcon className={`h-4 w-4 ${paymentMonthlyChange.percentage >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`} />
                  <span className="text-xs font-medium">
                    {paymentMonthlyChange.percentage >= 0 ? '+' : ''}{paymentMonthlyChange.percentage}% this month
                  </span>
                </div>
              </div>
            </div>
            <div className="w-20 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentTrendData}>
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Members Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50 mr-4">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Members</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {members.filter(m => m.status === "ACTIVE").length}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ 
                        width: `${(members.filter(m => m.status === "ACTIVE").length / members.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {Math.round((members.filter(m => m.status === "ACTIVE").length / members.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Active", value: members.filter(m => m.status === "ACTIVE").length },
                      { name: "Inactive", value: members.filter(m => m.status !== "ACTIVE").length }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={30}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
            <div className="mt-2 md:mt-0">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                {availableYears.map(year => (
                  <button
                    key={year}
                    type="button"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      selectedYear === year
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleYearChange(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paymentTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value)}`, "Revenue"]}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Legend />
                <Bar dataKey="amount" name="Revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trainers & Calendar */}
        <div className="space-y-6">
          {/* Trainers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Available Trainers</h2>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {trainers.length} available
              </span>
            </div>
            
            <div className="space-y-4">
              {trainers.slice(0, 3).map(trainer => (
                <div key={trainer.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    <div className="bg-indigo-100 text-indigo-800 font-medium rounded-lg w-10 h-10 flex items-center justify-center">
                      {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {trainer.firstName} {trainer.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{trainer.email}</p>
                  </div>
                  <div className="text-sm text-gray-500">{trainer.phoneNumber}</div>
                </div>
              ))}
              
              {trainers.length > 3 && (
                <button className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-colors">
                  View all trainers
                </button>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                View all
              </button>
            </div>
            
            <div className="mb-4">
              <ReactCalendar
                className="w-full border-0"
                tileClassName={({ date, view }) =>
                  view === "month" &&
                  date.getDate() === new Date().getDate()
                    ? "bg-indigo-100 text-indigo-700 font-bold rounded-full"
                    : null
                }
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {[
                  { id: 1, title: "Team Meeting", date: "2024-06-15", time: "10:30 AM" },
                  { id: 2, title: "Client Review", date: "2024-06-21", time: "2:00 PM" },
                  { id: 3, title: "Monthly Report", date: "2024-06-29", time: "All Day" },
                ].map(event => (
                  <div key={event.id} className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 mr-3">
                      {new Date(event.date).getDate()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">User Trends</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Legend />
                <Bar dataKey="users" name="New Users" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Product Trends</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Legend />
                <Bar dataKey="products" name="New Products" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
            <div className="mt-3 md:mt-0">
              <input
                type="text"
                placeholder="Search users..."
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 text-indigo-700 font-medium rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                        {member.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(member.status)} text-white`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleView(member)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(member.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={handleDelete}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{members.length}</span> of{' '}
            <span className="font-medium">{members.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-800">All Products</h2>
            <div className="mt-3 md:mt-0">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allProducts.slice(0, 4).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || "Fitness"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.sellingPrice || 49.99)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={handleDelete}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">{allProducts.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;