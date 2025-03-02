import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { prod_be_url } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../ToastMessage/ToastMessageComponent";
import { MdDeleteOutline } from "react-icons/md";

const Contact = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [contactData, setContactData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    try {
      const response = await axios.post(`${prod_be_url}/contact`, {
        email: formData.email,
        name: formData.name,
        message: formData.message.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response?.data?.success) {
        showSuccessToast(response?.data.message);
      }
      setLoading(false);
    } catch (error) {
      showErrorToast("An Error Occurred. Please try again later.");
      setLoading(false);
    }
  };

  const getAllContactDetails = async () => {
    setDataLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.get(`${prod_be_url}/contact`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsAdmin(false);
      if (response.data?.success) {
        setIsAdmin(true);
        setContactData(response.data.data);
      }
    } catch (error) {
      setIsAdmin(false);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    getAllContactDetails();
  }, []);
  const deleteHandler = async (id) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.delete(`${prod_be_url}/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      if (response.data?.success) {
        getAllContactDetails();
      }
    }
    catch (error) {
      console.log("Error : ",error)
    }
    
  }
  const deleteAllHandler = async() => {
    try{
      const token = localStorage.getItem("token") || "";
      const response = await axios.delete(`${prod_be_url}/contact`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(response.data?.success){
        getAllContactDetails();
      }
    }catch(error){
      console.log("Error : ",error);
    }
  }

  return (
    <div>
      {isAdmin ? (
        <div className="p-6 bg-gradient-to-b from-gray-900 to-black min-h-screen">
          <h2 className="text-white text-2xl font-bold mb-6 text-center">Contact Messages</h2>
          {dataLoading ? (
            <div className="flex justify-center items-center h-40">
              <motion.div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></motion.div>
            </div>
          ) :
            contactData.length > 0 ?
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contactData.map((data, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg border border-gray-600 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                    <button className="absolute top-2 right-2 text-red-500 transition hover:text-red-700" onClick={() => deleteHandler(data._id)}>
                      <MdDeleteOutline size={24} />
                    </button>
                    <ul className="text-white break-words">
                      <li className="mb-2 "><span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">Name:</span> {data?.name}</li>
                      <li className="mb-2"><span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">Email:</span> {data?.email}</li>
                      <li className="mb-2"><span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">Message:</span> {data?.message}</li>
                      <li className="text-gray-400"><span className="font-bold ">Posted at:</span> {data.time}</li>
                    </ul>

                    {/* <MdDeleteOutline className="" /> */}
                  </div>
                ))}
                <button
                  className="col-span-full mt-4 px-6 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-red-800 hover:shadow-lg"
                onClick={deleteAllHandler}
                >
                  Delete All
                </button>
              </div>
              :
              <p className="text-white text-center mt-10">No chat data found.</p>
          }
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-[90vh] bg-gradient-to-b">
          <motion.h1
            className="text-white text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
          <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700" onSubmit={handleSubmit}>
            {!isAuthenticated && (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-300">Name :</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Email :</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-300">Message :</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
                rows="4"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></motion.div> : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Contact;