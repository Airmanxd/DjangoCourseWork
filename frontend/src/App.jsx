import './App.css';
import React, { useEffect } from 'react';
import { Header } from './components/header';
import { GifList } from './components/giflist';
import { useDispatch, useSelector } from 'react-redux';
import { changeAccess } from "./slices/tokenSlice";
import { activate } from "./slices/loginSlice";
import axios from 'axios';

function App() {
  const login = useSelector((state)=>state.login.value);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!login){
        const refresh = localStorage.getItem("refreshToken");
        if(refresh){
            axios.post(`${process.env.APP_URL}/auth/jwt/refresh/`, {refresh : refresh})
            .then((result)=>{
                    dispatch(changeAccess(result.data.access));
                    dispatch(activate());
            })
            .catch();
        }
    }
}, [dispatch, login]);

const backgroundUrl = "https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2"

  return (
    <div style={{backgroundImage: `url(${backgroundUrl})`, minHeight: "100vh"}}>
      <Header></Header>
      <GifList></GifList>
    </div>
  
  );
}

export default App;
