import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Header } from './components/header';
import { GifList } from './components/giflist';

function App() {

  return (
    <div>
      <Header></Header>
      <GifList></GifList>
    </div>
  
  );
}

export default App;
