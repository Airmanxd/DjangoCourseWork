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
            axios.post(`/backend/auth/jwt/refresh/`, {refresh : refresh})
            .then((result)=>{
                    dispatch(changeAccess(result.data.access));
                    dispatch(activate());
            })
            .catch();
        }
    }
}, [dispatch, login]);

  return (
    <div className="backgroundImage">
      <Header></Header>
      <GifList></GifList>
    </div>
  
  );
}

export default App;
