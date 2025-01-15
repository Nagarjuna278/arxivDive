import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log("outside index")
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
