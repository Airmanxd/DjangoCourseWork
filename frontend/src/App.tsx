import './App.css';
import React, { useEffect } from 'react';
import { Header } from './components/header';
import { GifList } from './components/giflist';
import { changeAccess } from "./slices/tokenSlice";
import { activate } from "./slices/loginSlice";
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './hooks';

function App() {
  const login = useAppSelector((state)=>state.login.value);
  const dispatch = useAppDispatch();
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

  return (
    <div className='backgroundImage'>
      <Header></Header>
      <GifList></GifList>
    </div>
  
  );
}

export default App;
