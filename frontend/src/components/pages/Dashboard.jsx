import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

function Dashboard() {
  // Sample initial data
  const initialApplications = [
    { id: 1, company: "Google", role: "Frontend Developer", appliedDate: "2023-05-15", status: "Interview", note: "Technical interview scheduled", resume: null },
    { id: 2, company: "Amazon", role: "Product Manager", appliedDate: "2023-06-02", status: "Applied", note: "Waiting for response", resume: null },
    { id: 3, company: "Microsoft", role: "UX Designer", appliedDate: "2023-05-28", status: "Rejected", note: "Not enough experience", resume: null },
    { id: 4, company: "Apple", role: "iOS Developer", appliedDate: "2023-06-10", status: "Offer", note: "Received offer letter", resume: null },
    { id: 5, company: "Netflix", role: "UI Engineer", appliedDate: "2023-06-05", status: "Interview", note: "Final round with design team", resume: null }
  ];

  // State management
  const [applications, setApplications] = useState(initialApplications);
  const [newApplication, setNewApplication] = useState({
    company: "", role: "", appliedDate: "", status: "Applied", note: "", resume: null
  });
  const [resumeName, setResumeName] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Calculate metrics
  const totalApplicants = applications.length;
  const offerReceived = applications.filter(app => app.status === "Offer").length;
  const rejected = applications.filter(app => app.status === "Rejected").length;
  const interviewStage = applications.filter(app => app.status === "Interview").length;
  const successRate = totalApplicants > 0 ? Math.round((offerReceived / totalApplicants) * 100) : 0;

  // Filter applications
  const filteredApplications = activeFilter === "All" 
    ? applications 
    : applications.filter(app => app.status === activeFilter);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication({ ...newApplication, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewApplication({ ...newApplication, resume: file });
      setResumeName(file.name);
      toast.success('Resume uploaded successfully!');
    }
  };

  const addApplication = () => {
    if (newApplication.company && newApplication.role && newApplication.appliedDate) {
      const newApp = { ...newApplication, id: Date.now() };
      setApplications([...applications, newApp]);
      setNewApplication({ company: "", role: "", appliedDate: "", status: "Applied", note: "", resume: null });
      setResumeName("");
      toast.success('Application added successfully!');
    } else {
      toast.error('Please fill in all required fields.');
    }
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
    toast.error('Application deleted.');
  };
  
  const handleStatusUpdate = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    toast.success('Status updated!');
  };

  // --- Helper Functions ---
  const getStatusClass = (status) => {
    switch (status) {
      case "Offer": return "bg-gradient-to-r from-emerald-500 to-teal-400 text-white";
      case "Rejected": return "bg-gradient-to-r from-rose-500 to-pink-400 text-white";
      case "Interview": return "bg-gradient-to-r from-amber-500 to-yellow-400 text-white";
      case "Applied": return "bg-gradient-to-r from-blue-500 to-indigo-400 text-white";
      default: return "bg-slate-200 text-slate-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Offer": return "🎉";
      case "Rejected": return "❌";
      case "Interview": return "📅";
      case "Applied": return "📤";
      default: return "📝";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Toaster component for notifications */}
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          className: 'bg-white shadow-lg rounded-xl border border-slate-200 text-lg',
          duration: 3000,
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Job Application Dashboard</h1>
            <p className="text-slate-600 mt-3 text-lg">Track and manage your job applications</p>
          </div>
          <div className="flex items-center space-x-5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search applications..." 
                className="pl-12 pr-5 py-3 text-lg bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 hover:bg-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </motion.header>

        {/* ===== Stats Section ===== */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Total Applicants Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50"
            variants={statVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-base font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-slate-800 mt-3">{totalApplicants}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </motion.div>
          
          {/* Interview Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50"
            variants={statVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-base font-medium">Interviews</p>
                <p className="text-3xl font-bold text-slate-800 mt-3">{interviewStage}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-100 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: totalApplicants > 0 ? `${(interviewStage / totalApplicants) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </motion.div>
          
          {/* Offer Received Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50"
            variants={statVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-base font-medium">Offers Received</p>
                <p className="text-3xl font-bold text-slate-800 mt-3">{offerReceived}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-100 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: totalApplicants > 0 ? `${(offerReceived / totalApplicants) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </motion.div>
          
          {/* Rejected Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50"
            variants={statVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-base font-medium">Rejected</p>
                <p className="text-3xl font-bold text-slate-800 mt-3">{rejected}</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-100 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: totalApplicants > 0 ? `${(rejected / totalApplicants) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </motion.div>
          
          {/* Success Rate Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50"
            variants={statVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-base font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-slate-800 mt-3">{successRate}%</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${successRate}%` }}></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== Add New Application Section ===== */}
          <motion.div 
            className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-7 border border-white/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-7 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Application
            </h2>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="company" className="block text-base font-medium text-slate-700 mb-3">Company</label>
                <input type="text" id="company" name="company" value={newApplication.company} onChange={handleInputChange} className="w-full px-5 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Google" />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-base font-medium text-slate-700 mb-3">Role</label>
                <input type="text" id="role" name="role" value={newApplication.role} onChange={handleInputChange} className="w-full px-5 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Frontend Developer" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="applied-date" className="block text-base font-medium text-slate-700 mb-3">Applied Date</label>
                  <input type="date" id="applied-date" name="appliedDate" value={newApplication.appliedDate} onChange={handleInputChange} className="w-full px-5 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-base font-medium text-slate-700 mb-3">Status</label>
                  <select id="status" name="status" value={newApplication.status} onChange={handleInputChange} className="w-full px-5 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="note" className="block text-base font-medium text-slate-700 mb-3">Notes</label>
                <textarea id="note" name="note" value={newApplication.note} onChange={handleInputChange} rows="3" className="w-full px-5 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Spoke with HR, waiting for technical round..."></textarea>
              </div>
              
              <div>
                <label htmlFor="resume-upload" className="block text-base font-medium text-slate-700 mb-3">Resume</label>
                <label htmlFor="resume-upload" className="w-full px-5 py-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:border-blue-500 hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className="text-blue-600 font-medium text-sm">Upload Resume</span>
                  {resumeName && <span className="text-sm text-slate-500 mt-1 text-center truncate max-w-xs">{resumeName}</span>}
                </label>
                <input type="file" id="resume-upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
              </div>
              
              <button onClick={addApplication} className="w-full px-5 py-4 text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-center mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Application
              </button>
            </div>
          </motion.div>

          {/* ===== Applications List Section ===== */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-7 border border-white/50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-7 gap-4">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Applications
              </h2>
              
              <div className="flex items-center space-x-3">
                <div className="flex bg-slate-100 p-1.5 rounded-lg">
                  {["All", "Applied", "Interview", "Offer", "Rejected"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-1.5 text-sm rounded-md transition-colors ${activeFilter === filter ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{filteredApplications.length} applications</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead className="text-left text-slate-600 uppercase text-sm">
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-5 font-medium">Company</th>
                    <th className="py-4 px-5 font-medium">Role</th>
                    <th className="py-4 px-5 font-medium">Date</th>
                    <th className="py-4 px-5 font-medium">Status</th>
                    <th className="py-4 px-5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <AnimatePresence>
                    {filteredApplications.length > 0 ? filteredApplications.map(app => (
                      <motion.tr 
                        key={app.id} 
                        layout
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="hover:bg-slate-50/50"
                      >
                        <td className="py-5 px-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                              <span className="font-semibold text-slate-700 text-lg">{app.company.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 text-lg">{app.company}</div>
                              <div className="text-sm text-slate-500 mt-1 line-clamp-1">{app.note}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-5 text-slate-700 text-lg">{app.role}</td>
                        <td className="py-5 px-5 text-slate-700 text-lg">{app.appliedDate}</td>
                        <td className="py-5 px-5">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl">{getStatusIcon(app.status)}</span>
                            <select 
                              value={app.status}
                              onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                              className={`text-sm py-2 pl-3 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50 ${getStatusClass(app.status)}`}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Interview">Interview</option>
                              <option value="Offer">Offer</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-5 px-5">
                          <div className="flex justify-end items-center space-x-3">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button onClick={() => deleteApplication(app.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center py-16 text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-lg">No applications found.</p>
                          <p className="text-base mt-2">Start by adding your first job application!</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;