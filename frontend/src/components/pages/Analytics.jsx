import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiSettings, FiPlus, FiFileText, FiCalendar, 
  FiEdit, FiTrash2, FiBriefcase, FiTrendingUp, FiX, 
  FiCheckCircle, FiAlertCircle, FiClock, FiAward, FiChevronRight,
  FiBarChart2, FiPieChart, FiActivity, FiTarget, FiUserCheck
} from 'react-icons/fi';

// A "god level" UI for the Job Application Dashboard with Analytics
const Analytics = () => {
  // --- STATE MANAGEMENT ---
  const initialApplications = [
    { id: 1, company: "Vercel", role: "Frontend Engineer", appliedDate: "2025-08-15", status: "Interview", note: "Technical interview with the frontend team lead.", logo: "V" },
    { id: 2, company: "Linear", role: "Product Designer", appliedDate: "2025-08-02", status: "Offer", note: "Received an amazing offer!", logo: "L" },
    { id: 3, company: "Stripe", role: "Full-Stack Developer", appliedDate: "2025-07-28", status: "Rejected", note: "Feedback suggests focusing more on system design.", logo: "S" },
    { id: 4, company: "Figma", role: "UX Researcher", appliedDate: "2025-08-10", status: "Applied", note: "Referred by a friend.", logo: "F" },
    { id: 5, company: "Notion", role: "Backend Engineer", appliedDate: "2025-07-05", status: "Interview", note: "Completed the final round, awaiting decision.", logo: "N" }
  ];

  const [applications, setApplications] = useState(initialApplications);
  const [filteredApps, setFilteredApps] = useState(initialApplications);
  const [newApplication, setNewApplication] = useState({ company: "", role: "", appliedDate: "", status: "Applied", note: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- DERIVED STATE & METRICS ---
  const totalApps = applications.length;
  const offers = applications.filter(app => app.status === "Offer").length;
  const rejections = applications.filter(app => app.status === "Rejected").length;
  const interviews = applications.filter(app => app.status === "Interview").length;
  const applied = applications.filter(app => app.status === "Applied").length;
  const successRate = totalApps > 0 ? Math.round((offers / (offers + rejections)) * 100) || 0 : 0;
  
  // Analytics data
  const monthlyData = [
    { month: 'Jan', applications: 12, interviews: 4, offers: 1 },
    { month: 'Feb', applications: 8, interviews: 3, offers: 0 },
    { month: 'Mar', applications: 15, interviews: 6, offers: 2 },
    { month: 'Apr', applications: 10, interviews: 5, offers: 1 },
    { month: 'May', applications: 18, interviews: 7, offers: 3 },
    { month: 'Jun', applications: 22, interviews: 9, offers: 2 },
    { month: 'Jul', applications: 14, interviews: 5, offers: 1 },
    { month: 'Aug', applications: 9, interviews: 4, offers: 1 },
  ];

  // --- EFFECTS ---
  useEffect(() => {
    let filtered = applications;
    if (activeFilter !== "All") {
      filtered = filtered.filter(app => app.status === activeFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(query) || 
        app.role.toLowerCase().includes(query)
      );
    }
    setFilteredApps(filtered);
  }, [applications, activeFilter, searchQuery]);
  
  // --- HANDLERS ---
  const handleInputChange = (e) => setNewApplication({ ...newApplication, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const addApplication = (e) => {
    e.preventDefault();
    if (newApplication.company && newApplication.role && newApplication.appliedDate) {
      const newApp = { 
        ...newApplication, 
        id: Date.now(),
        logo: newApplication.company.charAt(0).toUpperCase()
      };
      setApplications([newApp, ...applications]);
      setNewApplication({ company: "", role: "", appliedDate: "", status: "Applied", note: "" });
      setResumeFile(null);
      setIsModalOpen(false);
    }
  };

  const deleteApplication = (id) => setApplications(applications.filter(app => app.id !== id));
  
  const updateStatus = (id, status) => setApplications(apps => apps.map(app => app.id === id ? { ...app, status } : app));

  // --- UI HELPER CONFIG ---
  const statusConfig = {
    Offer: { icon: FiAward, color: "text-green-500", bg: "bg-green-500/10" },
    Interview: { icon: FiClock, color: "text-amber-500", bg: "bg-amber-500/10" },
    Applied: { icon: FiBriefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    Rejected: { icon: FiAlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }
  };

  // --- VIRTUAL COMPONENTS ---
  const StatCard = ({ icon: Icon, title, value, detail, colorClass }) => (
    <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{detail}</p>
    </motion.div>
  );

  const ApplicationRow = ({ app }) => {
    const { icon: Icon, color, bg } = statusConfig[app.status] || {};
    return (
      <motion.tr layout variants={itemVariants} initial="hidden" animate="visible" exit="exit" className="group border-b border-gray-100 hover:bg-gray-50">
        <td className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-lg">
              {app.logo}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{app.company}</p>
              <p className="text-sm text-gray-600">{app.role}</p>
            </div>
          </div>
        </td>
        <td className="p-4 text-sm text-gray-700">{app.appliedDate}</td>
        <td className="p-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
            <Icon />
            {app.status}
          </div>
        </td>
        <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={app.note}>
          {app.note}
        </td>
        <td className="p-4 text-right">
          <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600"><FiEdit className="h-4 w-4" /></button>
            <button onClick={() => deleteApplication(app.id)} className="p-2 rounded-md hover:bg-red-100 text-gray-500 hover:text-red-600"><FiTrash2 className="h-4 w-4" /></button>
          </div>
        </td>
      </motion.tr>
    );
  };
  
  const AddApplicationModal = () => (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Application</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <FiX />
              </button>
            </div>
            <form onSubmit={addApplication} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="company" value={newApplication.company} onChange={handleInputChange} placeholder="Company Name" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input name="role" value={newApplication.role} onChange={handleInputChange} placeholder="Role / Position" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" name="appliedDate" value={newApplication.appliedDate} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <select name="status" value={newApplication.status} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <textarea name="note" value={newApplication.note} onChange={handleInputChange} placeholder="Add a note..." rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div>
                <label htmlFor="resume-upload" className="w-full text-center cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <FiFileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-blue-500">
                    {resumeFile ? resumeFile.name : 'Upload Resume (Optional)'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 5MB</p>
                </label>
                <input id="resume-upload" type="file" onChange={handleFileChange} className="hidden" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                Add Application <FiChevronRight/>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // --- ANALYTICS COMPONENTS ---
  const AnalyticsCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      {children}
    </motion.div>
  );

  const StatusPieChart = () => {
    const data = [
      { status: 'Applied', value: applied, color: 'bg-blue-500' },
      { status: 'Interview', value: interviews, color: 'bg-amber-500' },
      { status: 'Offer', value: offers, color: 'bg-green-500' },
      { status: 'Rejected', value: rejections, color: 'bg-red-500' },
    ];
    
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
            <span className="text-sm text-gray-600 flex-1">{item.status}</span>
            <span className="text-sm font-medium text-gray-800">{item.value}</span>
          </div>
        ))}
        <div className="relative w-40 h-40 mx-auto mt-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{totalApps}</span>
            <span className="text-xs text-gray-500 block mt-8">Total Apps</span>
          </div>
          <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
            {data.map((item, index) => {
              const percent = (item.value / totalApps) * 100;
              const offset = data.slice(0, index).reduce((acc, curr) => acc + (curr.value / totalApps) * 100, 0);
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${percent} ${100 - percent}`}
                  strokeDashoffset={-offset}
                  className={`text-${item.color.split('-')[1]}-500`}
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const MonthlyBarChart = () => {
    const maxValue = Math.max(...monthlyData.map(d => d.applications));
    
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-40">
          {monthlyData.map((month, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative flex flex-col items-center flex-1 w-full">
                <div 
                  className="w-3/4 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${(month.applications / maxValue) * 80}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{month.month}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Applications</span>
          </div>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ title, value, max, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{title}</span>
        <span className="font-medium text-gray-800">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // --- RENDER FUNCTION ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <AddApplicationModal />

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Application Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, let's land that dream job! 🚀</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 shadow-sm"
              />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <FiPlus /> Add New
            </button>
          </div>
        </motion.header>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "dashboard" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "analytics" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Analytics
          </button>
        </div>
        
        {activeTab === "dashboard" ? (
          <>
            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <StatCard icon={FiBriefcase} title="Total Applications" value={totalApps} detail={`${interviews} are in interview stage`} colorClass="text-blue-500" />
              <StatCard icon={FiAward} title="Offers Received" value={offers} detail="Keep up the great work!" colorClass="text-green-500" />
              <StatCard icon={FiAlertCircle} title="Rejections" value={rejections} detail="Every 'no' is a step closer to 'yes'" colorClass="text-red-500" />
              <StatCard icon={FiTrendingUp} title="Success Rate" value={`${successRate}%`} detail="Offers / (Offers + Rejections)" colorClass="text-purple-500" />
            </motion.div>
            
            {/* Applications Table Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Your Applications</h2>
                <div className="flex bg-gray-100 p-1 rounded-md">
                  {["All", "Applied", "Interview", "Offer", "Rejected"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors relative ${activeFilter === filter ? 'text-blue-600 bg-white shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      {activeFilter === filter && <motion.div layoutId="filter-active-bg" className="absolute inset-0 bg-white rounded-md shadow-sm" />}
                      <span className="relative z-10">{filter}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {filteredApps.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">Company</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Date Applied</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Notes</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredApps.map(app => <ApplicationRow key={app.id} app={app} />)}
                      </AnimatePresence>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <FiBriefcase className="h-12 w-12 mx-auto mb-3" />
                    <p className="font-semibold">No applications found.</p>
                    <p className="text-sm mt-1">{activeFilter !== 'All' ? `Clear the filter or add a new application.` : 'Start by adding your first application!'}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <AnalyticsCard title="Application Status" icon={FiPieChart}>
                <StatusPieChart />
              </AnalyticsCard>
              
              <AnalyticsCard title="Monthly Applications" icon={FiBarChart2}>
                <MonthlyBarChart />
              </AnalyticsCard>
              
              <AnalyticsCard title="Performance Metrics" icon={FiActivity}>
                <ProgressBar title="Application Completion" value={totalApps} max={30} color="bg-blue-500" />
                <ProgressBar title="Interview Rate" value={interviews} max={totalApps || 1} color="bg-amber-500" />
                <ProgressBar title="Offer Rate" value={offers} max={totalApps || 1} color="bg-green-500" />
              </AnalyticsCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnalyticsCard title="Success Rate Over Time" icon={FiTrendingUp}>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Line chart visualization would go here
                </div>
              </AnalyticsCard>
              
              <AnalyticsCard title="Application Sources" icon={FiTarget}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">LinkedIn</span>
                    <span className="text-sm font-medium text-gray-800">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: '42%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Company Website</span>
                    <span className="text-sm font-medium text-gray-800">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '28%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Referral</span>
                    <span className="text-sm font-medium text-gray-800">18%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '18%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Other</span>
                    <span className="text-sm font-medium text-gray-800">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </AnalyticsCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-6"
            >
              <AnalyticsCard title="Recent Activity" icon={FiUserCheck}>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiPlus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Added new application at Vercel</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <FiClock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Moved Linear to Interview stage</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiAward className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Received offer from Stripe</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </li>
                </ul>
              </AnalyticsCard>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;