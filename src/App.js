import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Professional theme configuration
const theme = createTheme({
  typography: {
    fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  },
  palette: {
    primary: {
      main: '#007AFF',
    },
    background: {
      default: '#FAFAFA',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAFA',
          fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#FAFAFA',
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
              <Route path="/:calendarId" element={<Calendar />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

