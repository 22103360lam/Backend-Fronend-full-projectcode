import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//admin component
import Nav from "./component/Admin/Nav";
import Header from "./component/Admin/Header";

//manager component
import Mnav from "./component/manager/Mnav";
import Mheader from "./component/manager/Mheader";  

// Staff component 
import Snav from "./component/Staff/Snav";
import Sheader from "./component/Staff/Sheader";

// Admin page imports 
import Adashboard from "./pages/Admin/Adashboard";
import Ausermanage from "./pages/Admin/Ausermanage";
import Amaterial from "./pages/Admin/Amaterial";
import Asupplier from "./pages/Admin/Asupplier";
import Ainventory from "./pages/Admin/Ainventory";
import Aproduction from "./pages/Admin/Aproduction";
import Areport from "./pages/Admin/Areport";
import Aalert from "./pages/Admin/Aalert";

//Manager page imports  
import Mdashboard from "./pages/Manager/Mdashboard";
import Mmaterial from "./pages/Manager/Mmaterial";
import Mproduction from "./pages/Manager/Mproduction";
import Minventory from "./pages/Manager/Minventory";
import Mreport from "./pages/Manager/Mreport";
import Malert from "./pages/Manager/Malert";

// staff pages import 
import Sdashboard from "./pages/Staff/Sdashboard";
import Smaterial from "./pages/Staff/Smaterial";  
import Sproduction from "./pages/Staff/Sproduction";
import Sinventory from "./pages/Staff/Sinventory";
import Salert from "./pages/Staff/Salert";

function App() {

  // Admin Layout
  function Admin({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      <Nav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
  }

   // Manager Layout
  function Manager({ children })
   {
     return (
     <div className="flex h-screen bg-gray-50 font-sans relative">
      <Mnav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Mheader />
        {children}
        
      </main>
      </div>
      );
    } 
   // Staff Layout
  function Staff({ children })
   {
     return (
     <div className="flex h-screen bg-gray-50 font-sans relative">
      <Snav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Sheader />
        {children}
        
      </main>
      </div>
      );
    } 


  return (
    <Router>
      
          <Routes>

              {/* Admin Page Content */}
            <Route path="/aalert" element={<Admin> <Aalert/> </Admin>} />
            <Route path="/areport" element={<Admin> <Areport /> </Admin>} />
            <Route path="/aproduction" element={<Admin> <Aproduction /> </Admin>} />
            <Route path="/ainventory" element={<Admin> <Ainventory /> </Admin>} />
            <Route path="/asupplier" element={<Admin> <Asupplier /> </Admin>} />
            <Route path="/amaterial" element={<Admin> <Amaterial /> </Admin>} />
            <Route path="/ausermanage" element={<Admin> <Ausermanage /> </Admin>} />
            <Route path="/adashboard" element={<Admin> <Adashboard /> </Admin> } />
              
            {/* Manager Page Content */}
            <Route path="/mdashboard" element={<Manager> <Mdashboard /> </Manager>} />
            <Route path="/mmaterial" element={<Manager> <Mmaterial /> </Manager>} />
            <Route path="/mproduction" element={<Manager> <Mproduction /> </Manager>} />
            <Route path="/minventory" element={<Manager> <Minventory /> </Manager>} />
            <Route path="/mreport" element={<Manager> <Mreport /> </Manager>} />
            <Route path="/malert" element={<Manager> <Malert /> </Manager>} />
            
            {/* Staff Page Content */}
            <Route path="/sdashboard" element={<Staff> <Sdashboard /> </Staff>} />
            <Route path="/smaterial" element={<Staff> <Smaterial /> </Staff>} />
            <Route path="/sproduction" element={<Staff> <Sproduction /> </Staff>} />
            <Route path="/sinventory" element={<Staff> <Sinventory /> </Staff>} />
            <Route path="/salert" element={<Staff> <Salert /> </Staff>} />
            

          </Routes>
        
    </Router>
  );
}

export default App;
