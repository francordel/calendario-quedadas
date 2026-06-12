import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CustomThemeProvider, useThemeMode } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

const Calendar = lazy(() => import("./pages/Calendar"));

// App content component that uses theme
function AppContent() {
  const { theme } = useThemeMode();
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          
          <Box
            component="main"
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:calendarId" element={
                <Suspense fallback={null}>
                  <Calendar />
                </Suspense>
              } />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </LanguageProvider>
  );
}

export default App;

