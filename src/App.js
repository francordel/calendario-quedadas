import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import { Container } from "@mui/material";

function App() {
  return (
    <Router>
      <Header />
      <Container
        disableGutters // Desactiva los márgenes predeterminados del Container
        sx={{ marginTop: 2, marginLeft:-1}}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:calendarId" element={<Calendar />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

