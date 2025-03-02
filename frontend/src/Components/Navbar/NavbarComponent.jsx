import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FaHistory, FaSignInAlt, FaUserPlus, FaInfoCircle, FaEnvelope, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { CiLogout } from "react-icons/ci";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { PiNotePencilDuotone } from "react-icons/pi";
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';

const NavbarComponent = ({ closeSidebar }) => {
  const { logout, isAuthenticated, chatHistory,setChatHistory,isChatLoading,setIsChatLoading } = useAuth();
  const navigate = useNavigate();
  const historyData = [
    { id: '1', name: 'Very Long History Name Example 1' },
    { id: '2', name: 'Another Long History Entry 2' },
    { id: '3', name: 'Short Name' },
    { id: '4', name: 'Yet Another Very Long History Name 4' },
    { id: '5', name: 'Very Long History Name Example 1' },
    { id: '6', name: 'Another Long History Entry 2' },
    { id: '7', name: 'Short Name' },
    { id: '8', name: 'Yet Another Very Long History Name 4' },
    { id: '9', name: 'Very Long History Name Example 1' },
    { id: '10', name: 'Another Long History Entry 2' },
    { id: '11', name: 'Short Name' },
    { id: '12', name: 'Yet Another Very Long History Name 4' },
    { id: '13', name: 'Very Long History Name Example 1' },
    { id: '14', name: 'Another Long History Entry 2' },
    { id: '15', name: 'Short Name' },
    { id: '16', name: 'Yet Another Very Long History Name 4' }
  ];

  const handleLogout = () => {
    logout();
    closeSidebar();
  }
  const deleteHandler = async (chatHistoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${prod_be_url}/grammar-chat-history/${chatHistoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      chatHistoryApi();
    } catch (error) {
      if (error?.response?.data) {
        showErrorToast(error?.response?.data?.message);
      }
      else {
        showErrorToast(error.message);
      }
    }
  }
  const chatHistoryApi = async() => {
    try{
        setIsChatLoading(true);
        const token = localStorage.getItem("token") || "";
        const response = await axios.get(`${prod_be_url}/grammar-chat-history`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        setChatHistory(response?.data?.data);
        setIsChatLoading(false);
    }catch(error){
        console.log("Error :",error)
        if(error?.response?.data){
          showErrorToast(error?.response?.data?.message);
        }
        else{
          showErrorToast(error.message);
        }
        setIsChatLoading(false);
        setChatHistory([]);
        navigate("/chat/new")
      }
}
  return (
    <nav className="flex flex-col min-h-full w-full text-white z-40">
      {/* Chat History Section */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="flex items-center justify-between text-lg md:text-base sm:text-sm font-semibold mb-2 border-b border-gray-700 pb-2">
          Chat History
          {isAuthenticated && (
            <Link
              onClick={closeSidebar}
              to="/chat/new"
              className="relative group p-2 rounded transition hover:bg-gray-700"
            >
              <PiNotePencilDuotone className="w-5 h-5" />
              {/* <span  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-80 transition-opacity">
        New Chat
      </span> */}
            </Link>
          )}
        </h2>
        {isChatLoading ? (
          
          <div className="flex flex-col items-center justify-center py-4">
            {/* Loader Animation */}
            <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            
            {/* Loading Text */}
            <p className="text-sm md:text-base font-medium mt-2 text-gray-400">
              Loading Chats...
            </p>
          </div>):
          
        

        (<ul>
          {chatHistory.length>0 ? chatHistory.map((data) => (
            <li key={data._id} className="mb-2 flex justify-between items-center">
              <Link
                to={`/chat/${data._id}`}
                className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 truncate w-full text-sm md:text-sm sm:text-xs"
                onClick={closeSidebar}
              >
                <FaHistory />
                <span className="truncate max-w-[150px] block">{data.chatHistoryName}</span>
              </Link>
              <button
                onClick={() => deleteHandler(data._id)}
                className="p-2 transition text-white hover:text-red-100"
                aria-label="Delete chat"
              >
                <FaTrash />
              </button>
            </li>
          )):
          <li className="flex flex-col items-center justify-center py-6 text-gray-400">
        <p className="text-sm md:text-base font-medium">No Chat History Found</p>
      </li>
          }
        </ul>
        )}
      </div>

      {/* Navigation Links */}
      <div className="mt-auto">
        <h2 className="text-md md:text-sm sm:text-xs font-semibold mb-2 border-b border-gray-700 pb-2">Navigation</h2>
        <ul className="space-y-2">
          {!isAuthenticated ? (<><li>
            <Link
              to="/signin"
              className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-sm md:text-sm sm:text-xs"
              onClick={closeSidebar}
            >
              <FaSignInAlt /> Login
            </Link>
          </li>
            <li>
              <Link
                to="/signup"
                className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-sm md:text-sm sm:text-xs"
                onClick={closeSidebar}
              >
                <FaUserPlus /> Register
              </Link>
            </li>
          </>) :
            (
              <>
                <li>
                  <Link to="/signin"
                    className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-base md:text-sm sm:text-xs"
                    onClick={handleLogout}
                  >
                    <CiLogout /> Logout
                  </Link>
                </li>
                <li>
                  <Link to="/account"
                    className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-base md:text-sm sm:text-xs"
                    onClick={closeSidebar}
                  >
                    <RiAccountPinCircleFill /> Account
                  </Link>
                </li>
              </>
            )
          }
          <li>
            <Link
              to="/about"
              className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-base md:text-sm sm:text-xs"
              onClick={closeSidebar}
            >
              <FaInfoCircle /> About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-base md:text-sm sm:text-xs"
              onClick={closeSidebar}
            >
              <FaEnvelope /> Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>

  );
};

export default NavbarComponent;
