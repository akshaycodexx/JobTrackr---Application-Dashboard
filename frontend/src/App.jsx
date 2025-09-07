import React from 'react'
import { BrowserRouter ,Routes,Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import Analytics from './components/pages/Analytics'
import Applications from './components/pages/Applications'
import Dashboard from './components/pages/Dashboard'
import Setting from './components/pages/SettingsPage'
import HeroPage from './components/pages/HeroPage'
import './App.css'
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
          {/* NASTED ROUTES */}
          <Route path='/' element={<HeroPage/>}/>
        <Route path='/dashboard' element={<DashboardLayout/>}>
           <Route index element={<Dashboard/>}/>   {/* Diffault page becuse we write index */}
          <Route path='applications' element={<Applications/>}/>
          <Route path='analytics' element={<Analytics/>}/>
          <Route path='setting' element={<Setting/>}/>
        </Route>







      </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
