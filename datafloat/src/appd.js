import { ColorModeContext,useMode } from "./theme";
import { CssBaseline,ThemeProvider } from "@mui/material";
import { Routes,Route } from "react-router-dom";
import Topbar from "./scences/global/Topbar";
import Dashboard from "./scences/Dashboard";
import Sidebar from "./scences/global/Sidebar";



import Form from "./scences/form";
import FeedbackForm from "./scences/feedback/feedback";
import AdminDashboard from "./scences/analysis/analysis";



function Apps() {
  const[theme,colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
    <div className="app">
 
      <Sidebar/>
      <main className="content">
        <Topbar/>
        
        <Routes>
          <Route path="/*" element={<Dashboard/>}/>
      
          <Route path="/form" element={<Form/>}/>
         
          <Route path="/feedback" element={<FeedbackForm/>}/>
          <Route path="/analysis" element={<AdminDashboard/>}/>
           

        </Routes>
    
      </main>
      
    </div>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Apps;
