import { ColorModeContext,useMode } from "./theme";
import { CssBaseline,ThemeProvider } from "@mui/material";
import { Routes,Route } from "react-router-dom";
import Topbar from "./scences/global/Topbar";
import React from "react";
import LoginPage from "./Security/Login";
import Apps from "./appd";
import { Toaster } from 'react-hot-toast';
import SignupPage from "./Security/reg";


function App() {
  const[theme,colorMode] = useMode();
  return (
 <React.Fragment>
    <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<Apps/>}/>
        <Route path="/reg" element={<SignupPage/>}/>

        </Routes>
 </React.Fragment>
  );
}

export default App;

// import { ColorModeContext,useMode } from "./theme";
// import { CssBaseline,ThemeProvider } from "@mui/material";
// import { Routes,Route } from "react-router-dom";
// import Topbar from "./scences/global/Topbar";
// import Dashboard from "./scences/Dashboard";
// import Sidebar from "./scences/global/Sidebar";
// import Team from "./scences/Team";
// import Contacts from "./scences/Contacts";
// import Invoices from "./scences/invoices";

// // import Bar from "./scences/bar";
// import Form from "./scences/form";
// import FAQ from "./scences/Faq";
// import Profile from "./Navbar/Profile/profile";


// function Apps() {
//   const[theme,colorMode] = useMode();
//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline/>
//     <div className="app">
 
//       <Sidebar/>
//       <main className="content">
//         <Topbar/>
        
//         <Routes>

//           <Route path="/*" element={<Dashboard/>}/>
//           <Route path="/team" element={<Team/>} />         
//            <Route path="/invoices" element={<Invoices/>}/>
//           <Route path="/contacts" element={<Contacts/>}/>
//           {/* <Route path="/bar" element={<Bar/>}/> */}
//           <Route path="/form" element={<Form/>}/>
//           {/* <Route path="/line" element={<Line/>}/> */}
//           {/* <Route path="/pie" element={<Pie/>}/> */}
//           <Route path="/faq" element={<FAQ/>}/>
//           {/* <Route path="/geography" element={<Geography/>}/> */}
//           {/* <Route path="/calendar" element={<Calendar/>}/> */}
//            <Route path="/Profile" element={<Profile/>}/> 

//         </Routes>
    
//       </main>
      
//     </div>
//     </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// export default Apps;
