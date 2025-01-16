import { useEffect, useState } from 'react';
import orderImg from '../assets/order.svg';
import accountImg from '../assets/accBlue.svg';
import pinImg from '../assets/pin.svg';
import Info from './Account/Info';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { useAuth } from '../Contexts/AuthContext.';
const MyOrders = () => <div>Order Details Component</div>;
const ManageAddresses = () => <div>Address Management Component</div>;


const Account = () => {
  const {user, loadingUser, setUser} = useAuth()
  const [activeTab, setActiveTab] = useState('info');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loadingUser && !user) {
      setUser(null)
      navigate('/login');
    }
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768); 
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, [loadingUser, user, navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return user ? <Info user={user} isMobile ={isMobile}/> : null;
      case 'orders':
        return <MyOrders />;
      case 'addresses':
        return <ManageAddresses />;
      default:
        return null;
    }
  };

  if (loadingUser) return <Loading />;

  if(isMobile) return (
    <div className="flex min-h-screen max-w-[960px] mx-auto bg-gray-100">
      <div className="w-max  flex flex-col gap-3 p-3">
          <img
            src={
              user
                ? `${user.image}`
                : 'https://tse2.mm.bing.net/th?id=OIP.x7X2oAehk5M9IvGwO_K0PgHaHa&pid=Api&P=0&h=180'
            }
            alt="User"
            className="w-12 h-12 rounded-full"
          />
          
        <ul className="text-center w-max gap-3 py-2 flex flex-col rounded-sm">
          <li
            className={`font-semibold text-gray-700 rounded-full px-3 flex gap-2 items-center py-3 cursor-pointer ${
              activeTab === 'info' ? 'text-indigo-600 bg-indigo-100' : 'opacity-75'
            }`}
            onClick={() => setActiveTab('info')}
          >
            <img src={accountImg} alt="Profile Information" />
          </li>
          <li
            className={`font-semibold text-gray-700 px-3 rounded-full flex gap-2 items-center py-3 cursor-pointer ${
              activeTab === 'orders' ? 'text-indigo-600 bg-indigo-100 opacity-100' : 'opacity-75'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <img src={orderImg} alt="My Orders" />
          </li>
          <li
            className={`font-semibold text-gray-700 px-3 rounded-full flex gap-2 items-center py-3 cursor-pointer ${
              activeTab === 'addresses' ? 'text-indigo-600 bg-indigo-100 opacity-100' : 'opacity-75'
            }`}
            onClick={() => setActiveTab('addresses')}
          >
            <img src={pinImg} alt="Manage Addresses" />
          </li>
        </ul>
      </div>
      <div className="flex-1 bg-white p-5">{renderTabContent()}</div>
    </div>
  )

  return (
    <div className="flex min-h-screen max-w-[960px] mx-auto bg-gray-100">
      <div className="w-1/3 bg-white flex flex-col gap-5 p-5">
        <div className="text-center rounded-sm min-w-[192px] shadow-md px-4 py-2 flex items-center">
          <img
            src={
              user
                ? `${user.image}`
                : 'https://tse2.mm.bing.net/th?id=OIP.x7X2oAehk5M9IvGwO_K0PgHaHa&pid=Api&P=0&h=180'
            }
            alt="User"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col ml-3 items-start">
            <p className="text-sm">Hello</p>
            <p className="text-md font-semibold">
              {user ? `${user.name}` : ''}
            </p>
          </div>
        </div>

        <ul className="text-center min-w-[192px] shadow-md py-2 flex flex-col rounded-sm">
          <li
            className={`font-semibold text-gray-700 px-4 flex gap-2 items-center py-3 cursor-pointer ${
              activeTab === 'info' ? 'text-indigo-600 bg-indigo-100' : ''
            }`}
            onClick={() => setActiveTab('info')}
          >
            <img src={accountImg} alt="Profile Information" />
            Profile Information
          </li>
          <li
            className={`font-semibold text-gray-700 px-4 flex gap-2 py-3 cursor-pointer ${
              activeTab === 'orders' ? 'text-indigo-600 bg-indigo-100' : ''
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <img src={orderImg} alt="My Orders" />
            My Orders
          </li>
          <li
            className={`font-semibold text-gray-700 px-4 flex gap-2 items-center py-3 cursor-pointer ${
              activeTab === 'addresses' ? 'text-indigo-600 bg-indigo-100' : ''
            }`}
            onClick={() => setActiveTab('addresses')}
          >
            <img src={pinImg} alt="Manage Addresses" />
            Manage Addresses
          </li>
        </ul>
      </div>

      <div className="flex-1 bg-white p-5">{renderTabContent()}</div>
    </div>
  );
};

export default Account;
