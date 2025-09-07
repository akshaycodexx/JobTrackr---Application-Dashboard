import { useEffect, useState } from 'react'
import { Outlet, Link  } from "react-router-dom";
import axios from 'axios';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user,SetUser]=useState(null);

  useEffect(()=>{
    
        const fetchProfile=async()=>{
          const token= localStorage.getItem("token");
          if(!token){
            return ;
          }
                try {
                  const response= await axios.get("/api/auth/profile",{
                    headers:{Authorization:`Bearer ${token}`}
                  });
                  SetUser(response.data)

                } catch (error) {
                  console.log("Error in fetch Profile")
                }
        }
        fetchProfile();
  },[])


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-4 shadow-xl z-10 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-8 p-3">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <i className="fas fa-briefcase text-indigo-600 text-xl"></i>
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">JobTrack</h2>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:bg-white/10 hover:-translate-y-0.5"
          >
            <i className="fas fa-chart-pie w-5 text-center transition-transform group-hover:scale-110"></i>
            {isSidebarOpen && (
              <>
                <span className="transition-all">Dashboard</span>
                <i className="fas fa-chevron-right ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </>
            )}
          </Link>
          
          <Link 
            to="applications" 
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:bg-white/10 hover:-translate-y-0.5"
          >
            <i className="fas fa-file-alt w-5 text-center transition-transform group-hover:scale-110"></i>
            {isSidebarOpen && (
              <>
                <span>Applications</span>
                <i className="fas fa-chevron-right ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </>
            )}
          </Link>
          
          <Link 
            to="analytics" 
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:bg-white/10 hover:-translate-y-0.5"
          >
            <i className="fas fa-chart-line w-5 text-center transition-transform group-hover:scale-110"></i>
            {isSidebarOpen && (
              <>
                <span>Analytics</span>
                <i className="fas fa-chevron-right ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </>
            )}
          </Link>
          
          <Link 
            to="setting" 
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:bg-white/10 hover:-translate-y-0.5"
          >
            <i className="fas fa-cog w-5 text-center transition-transform group-hover:scale-110"></i>
            {isSidebarOpen && (
              <>
                <span>Settings</span>
                <i className="fas fa-chevron-right ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </>
            )}
          </Link>
        </nav>
        
        {isSidebarOpen && (
          <div className="mt-8 p-4 bg-white/10 rounded-lg animate-pulse">
            <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-white/80 mb-3">Unlock all features</p>
            <button className="bg-white text-indigo-600 py-2 px-4 rounded-lg text-sm font-medium w-full hover:-translate-y-0.5 hover:shadow-lg transition-all">
              Upgrade Now
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <i className="fas fa-bell text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"></i>
              <span className="absolute -top-1 -right-1 bg-purple-500 rounded-full w-3 h-3"></span>
            </div>
            
           <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                {user && user.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{user ? user.name?.charAt(0).toUpperCase() : "?"}</span>
                )}
              </div>
              <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                {user ? user.name : "Guest"}
              </span>
            </div>
            
          </div>
        </header>
        
        {/* Page content */}
        <div className="p-6">






          <Outlet />







          
          
          {/* Sample dashboard content */}
          {window.location.pathname === '/' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats cards */}
              <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg hover:scale-[1.02] border-l-4 border-indigo-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Total Applications</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">245</h3>
                    <p className="text-green-500 text-xs mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i> 12% from last month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="fas fa-file-alt text-indigo-600 text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg hover:scale-[1.02] border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Interviews</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">24</h3>
                    <p className="text-green-500 text-xs mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i> 8% from last month
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-handshake text-green-500 text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg hover:scale-[1.02] border-l-4 border-yellow-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Pending</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">42</h3>
                    <p className="text-red-500 text-xs mt-2 flex items-center">
                      <i className="fas fa-arrow-down mr-1"></i> 3% from last month
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <i className="fas fa-clock text-yellow-500 text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg hover:scale-[1.02] border-l-4 border-red-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Rejected</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">15</h3>
                    <p className="text-green-500 text-xs mt-2 flex items-center">
                      <i className="fas fa-arrow-down mr-1"></i> 5% from last month
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <i className="fas fa-times-circle text-red-500 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}

export default DashboardLayout;