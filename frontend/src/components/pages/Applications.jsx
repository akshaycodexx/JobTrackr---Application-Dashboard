import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiSettings, FiPlus, FiFileText, FiCalendar, 
  FiEdit, FiTrash2, FiBriefcase, FiTrendingUp, FiX, 
  FiCheckCircle, FiAlertCircle, FiClock, FiAward, FiChevronRight,
  FiFilter, FiChevronDown
} from 'react-icons/fi';

const JobApplicationDashboard = () => {
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // --- DERIVED STATE & METRICS ---
  const totalApps = applications.length;
  const offers = applications.filter(app => app.status === "Offer").length;
  const rejections = applications.filter(app => app.status === "Rejected").length;
  const interviews = applications.filter(app => app.status === "Interview").length;
  const successRate = totalApps > 0 ? Math.round((offers / (offers + rejections)) * 100) || 0 : 0;

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
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredApps(filtered);
  }, [applications, activeFilter, searchQuery, sortConfig]);

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

  const deleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };
  
  const updateStatus = (id, status) => setApplications(apps => apps.map(app => app.id === id ? { ...app, status } : app));

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleNoteExpansion = (id) => {
    if (expandedNoteId === id) {
      setExpandedNoteId(null);
    } else {
      setExpandedNoteId(id);
    }
  };

  // --- UI HELPER CONFIG ---
  const statusConfig = {
    Offer: { icon: FiAward, color: "text-green-600", bg: "bg-green-100", border: "border-green-200" },
    Interview: { icon: FiClock, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" },
    Applied: { icon: FiBriefcase, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
    Rejected: { icon: FiAlertCircle, color: "text-red-600", bg: "bg-red-100", border: "border-red-200" },
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 12
      } 
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      transition: { 
        duration: 0.3 
      } 
    }
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14
      }
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: {
        duration: 0.2
      }
    },
    hover: {
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      transition: {
        duration: 0.2
      }
    }
  };

  // --- VIRTUAL COMPONENTS ---
  const StatCard = ({ icon: Icon, title, value, detail, colorClass }) => (
    <motion.div 
      variants={statCardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{detail}</p>
    </motion.div>
  );

  const ApplicationRow = ({ app }) => {
    const { icon: Icon, color, bg, border } = statusConfig[app.status] || {};
    const isNoteExpanded = expandedNoteId === app.id;
    
    return (
      <motion.tr 
        layout 
        variants={tableRowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        className="group border-b border-gray-100 hover:bg-blue-50/50"
      >
        <td className="p-4">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-lg shadow-inner"
            >
              {app.logo}
            </motion.div>
            <div>
              <p className="font-semibold text-gray-800">{app.company}</p>
              <p className="text-sm text-gray-600">{app.role}</p>
            </div>
          </div>
        </td>
        <td className="p-4 text-sm text-gray-700">{app.appliedDate}</td>
        <td className="p-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${bg} ${color} border ${border}`}
          >
            <Icon />
            {app.status}
          </motion.div>
        </td>
        <td className="p-4 text-sm text-gray-600 max-w-xs">
          <motion.div 
            className={`overflow-hidden ${isNoteExpanded ? '' : 'truncate'}`}
            animate={{ height: isNoteExpanded ? 'auto' : '1.5em' }}
            transition={{ duration: 0.3 }}
          >
            {app.note}
          </motion.div>
          {app.note && app.note.length > 50 && (
            <button 
              onClick={() => toggleNoteExpansion(app.id)}
              className="text-blue-500 text-xs mt-1 hover:underline"
            >
              {isNoteExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </td>
        <td className="p-4 text-right">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-md hover:bg-blue-100 text-gray-500 hover:text-blue-600"
            >
              <FiEdit className="h-4 w-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => deleteApplication(app.id)}
              className="p-2 rounded-md hover:bg-red-100 text-gray-500 hover:text-red-600"
            >
              <FiTrash2 className="h-4 w-4" />
            </motion.button>
          </motion.div>
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
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <FiX />
              </motion.button>
            </div>
            <form onSubmit={addApplication} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.input 
                  whileFocus={{ scale: 1.02 }}
                  name="company" 
                  value={newApplication.company} 
                  onChange={handleInputChange} 
                  placeholder="Company Name" 
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
                <motion.input 
                  whileFocus={{ scale: 1.02 }}
                  name="role" 
                  value={newApplication.role} 
                  onChange={handleInputChange} 
                  placeholder="Role / Position" 
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.input 
                  whileFocus={{ scale: 1.02 }}
                  type="date" 
                  name="appliedDate" 
                  value={newApplication.appliedDate} 
                  onChange={handleInputChange} 
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
                <motion.select 
                  whileFocus={{ scale: 1.02 }}
                  name="status" 
                  value={newApplication.status} 
                  onChange={handleInputChange} 
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                </motion.select>
              </div>
              <motion.textarea 
                whileFocus={{ scale: 1.01 }}
                name="note" 
                value={newApplication.note} 
                onChange={handleInputChange} 
                placeholder="Add a note..." 
                rows="3" 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <div>
                <motion.label 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  htmlFor="resume-upload" 
                  className="w-full text-center cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors block"
                >
                  <FiFileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-blue-500">
                    {resumeFile ? resumeFile.name : 'Upload Resume (Optional)'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 5MB</p>
                </motion.label>
                <input id="resume-upload" type="file" onChange={handleFileChange} className="hidden" />
              </div>
              <motion.button 
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" 
                }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                Add Application <FiChevronRight/>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <AddApplicationModal />

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Application Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, let's land that dream job! 🚀</p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div 
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 shadow-sm"
              />
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <FiPlus /> Add New
            </motion.button>
          </div>
        </motion.header>
        
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Applications</h2>
            <div className="flex bg-gray-100 p-1 rounded-md">
              {["All", "Applied", "Interview", "Offer", "Rejected"].map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors relative ${activeFilter === filter ? 'text-blue-600 bg-white shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  {activeFilter === filter && (
                    <motion.div 
                      layoutId="filter-active-bg" 
                      className="absolute inset-0 bg-white rounded-md shadow-sm" 
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    {filter} 
                    {filter !== "All" && (
                      <span className="ml-1 text-xs">
                        ({applications.filter(app => app.status === filter).length})
                      </span>
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {filteredApps.length > 0 ? (
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th 
                      className="p-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-gray-800"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center">
                        Company
                        <FiChevronDown className={`ml-1 transition-transform ${sortConfig.key === 'company' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-gray-800"
                      onClick={() => handleSort('appliedDate')}
                    >
                      <div className="flex items-center">
                        Date Applied
                        <FiChevronDown className={`ml-1 transition-transform ${sortConfig.key === 'appliedDate' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                      </div>
                    </th>
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
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-gray-500"
              >
                <FiBriefcase className="h-12 w-12 mx-auto mb-3" />
                <p className="font-semibold">No applications found.</p>
                <p className="text-sm mt-1">{activeFilter !== 'All' ? `Clear the filter or add a new application.` : 'Start by adding your first application!'}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FiPlus /> Add Application
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default JobApplicationDashboard;