import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUser, FiLock, FiMail, FiArrowRight, FiAward, FiBarChart2, FiUsers, FiCheck, FiCamera, FiX } from 'react-icons/fi';
import axios from 'axios';
import { Toaster,toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const HeroPage = () => {
    const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: null
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePic: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = () => {
    setFormData({
      ...formData,
      profilePic: null
    });
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        if(isLogin){
            // login api
            const res=await axios.post("/api/auth/login",{
                email:formData.email,
                password:formData.password
            },{withCredentials:true})
                 toast.success("Login Successfull")
                 localStorage.setItem("token",res.data.token)
                 navigate("/dashboard");

        }else{
            const signupData= new FormData();
            signupData.append("name",formData.name);
            signupData.append("email",formData.email);
            signupData.append("password",formData.password);
            signupData.append("confirmPassword",formData.confirmPassword);
            if(formData.profilePic){
                signupData.append("profilePic",formData.profilePic)
            }

            const res= await axios.post("/api/auth/signup",signupData,{
                withCredentials:true,
                headers:{"Content-Type":"multipart/form-data"}
            })
            toast.success("Signup successfully");
            localStorage.setItem("token",res.data.token)
            navigate("/dashboard");

        }
   
    } catch (error) {
  toast.error(error.response?.data?.message || "Something went wrong in Auth");
}

    
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const featureAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <FiBriefcase className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-800">JobTrackr</span>
        </motion.div>
        
        
      </nav>

      {/* Hero Content */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center px-6 py-12 md:py-24">
        {/* Left Column - Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Track Your Job 
            <span className="text-indigo-600"> Applications</span> 
            Like Never Before
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl text-gray-600 mb-8 max-w-lg"
          >
            Organize, track, and analyze your job search process with our powerful dashboard. Get hired faster with JobTrackr.
          </motion.p>
          
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Get Started Free <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/demo" 
              className="px-8 py-4 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium shadow-md flex items-center justify-center"
            >
              View Demo
            </Link>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="flex items-center space-x-2 text-gray-500"
          >
            <FiCheck className="text-green-500" />
            <span>No credit card required</span>
            <span className="mx-2">•</span>
            <FiCheck className="text-green-500" />
            <span>Free forever plan</span>
          </motion.div>
        </motion.div>
        
        {/* Right Column - Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="md:w-1/2 max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 font-medium text-center rounded-lg transition-colors ${isLogin ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-indigo-600'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 font-medium text-center rounded-lg transition-colors ${!isLogin ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-indigo-600'}`}
                >
                  Sign Up
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    {/* Profile Picture Upload */}
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6 flex justify-center"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                          {profilePreview ? (
                            <>
                              <img 
                                src={profilePreview} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={removeProfilePic}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <FiUser className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        
                        <label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md cursor-pointer">
                          <FiCamera className="h-4 w-4" />
                          <input
                            id="profile-pic"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </motion.div>

                    {/* Name Field */}
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4"
                    >
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          <FiUser />
                        </span>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter your name"
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  </>
                )}
                
                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <FiMail />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <FiLock />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                {/* Confirm Password Field (Signup only) */}
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6"
                  >
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <FiLock />
                      </span>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Confirm your password"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
                
                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
                >
                  {isLogin ? 'Login to Dashboard' : 'Create Account'}
                </motion.button>
              </form>
            </div>
            
            <div className="px-8 py-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why JobTrackr Stands Out</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={featureAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <FiBarChart2 className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Track your application success rate, response times, and optimize your job search strategy.</p>
            </motion.div>
            
            <motion.div 
              variants={featureAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <FiAward className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customizable Workflow</h3>
              <p className="text-gray-600">Tailor the application stages to match your process and stay organized at every step.</p>
            </motion.div>
            
            <motion.div 
              variants={featureAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Preparation</h3>
              <p className="text-gray-600">Access resources, track company research, and prepare effectively for each interview.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <FiBriefcase className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold">JobTrackr</span>
              </div>
              <p className="text-gray-400 mt-2">The ultimate job application management system</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>Made with ❤️ by akshaycodex</p>
            <p className="mt-2">© {new Date().getFullYear()} JobTrackr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroPage;