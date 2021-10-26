import React from 'react';
import { render } from 'react-dom';
import './assets/application.scss';
import './assets/add.css';
import App from './components/App';

window.onload = () => {
    console.log(document.getElementById('root'))
    render(<App/>, document.getElementById('root'))
}