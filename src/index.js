// src/index.js
import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";

// Importar estilos globales
import './index.css';

// No hace falta importar las variables aquí, ya las estamos usando en services/index.js

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


