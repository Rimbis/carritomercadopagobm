import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TemaProvider } from './context/TemaProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <TemaProvider>
        <App />
    </TemaProvider>
);