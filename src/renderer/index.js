import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/application.scss';
import './assets/add.css';
import App from './components/App';

window.onload = () => {
    console.log(document.getElementById('root'))
    const root = createRoot(document.getElementById('root'));
root.render(<App/>);
}