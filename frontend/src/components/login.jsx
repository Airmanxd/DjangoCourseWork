import React, { useCallback, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { activate } from "../slices/loginSlice";

export const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [signUp, setSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const dispatch = useDispatch();
    
    const handleSubmitLogin = (event) =>
    {
        console.log("username", username, "password",
         password, "passwordconf", passwordConf);
        event.preventDefault();
        axios.post(`${process.env.APP_URL}/auth/jwt/create`, {username : username,
             password :  password})
            .then((result)=>{
                console.log("access", result.data.access, "refresh", result.data.refresh, "data", result.data);
                dispatch(changeAccess(result.data.access));
                dispatch(changeRefresh(result.data.refresh));
                dispatch(activate());
            })
            .catch((errorMessage) => {
                setErrorMessage(errorMessage);
            });
    }; 
    const handleSubmitSignUp = (event) =>
    {
        console.log("username", username, "password",
         password, "passwordconf", passwordConf);
        event.preventDefault();
        axios.post(`${process.env.APP_URL}/auth/users/`, {username : username,
                password :  password,
                re_password :  passwordConf})
            .then(()=>{ 
                axios.post(`${process.env.APP_URL}/auth/jwt/create/`, {username :  username, password :  password})
                .then((result) =>{
                    console.log("access", result.data.access, "refresh", result.data.refresh, "data", result.data);
                    dispatch(changeAccess(result.data.access));
                    dispatch(changeRefresh(result.data.refresh));
                    dispatch(activate());
                })
                .catch();
            })
            .catch((errorMessage) =>{
                setErrorMessage(errorMessage);
            })
    };
    return(
        <div class="col-md-6 offset-md-3">
            <form onSubmit={signUp ? handleSubmitSignUp : handleSubmitLogin}>
                <div class="form-outline mb-1">
                    <input type="username" class="form-control" value={username}
                    onChange={(e)=>setUsername(e.target.value)} />
                    <label class="form-label">Username</label>
                </div>

                <div class="form-outline mb-1">
                    <input type="password" class="form-control" value={password}
                    onChange={(e)=>setPassword(e.target.value)} />
                    <label class="form-label">Password</label>
                </div>

                {signUp &&
                <div class="form-outline mb-1">
                    <input type="password" class="form-control" value={passwordConf}
                    onChange={(e)=>setPasswordConf(e.target.value)} />
                    <label class="form-label">Confirm Your Password</label>
                </div>
                }

                <div class="row mb-1">
                    <div class="col d-flex">
                        <button type="submit" class="btn btn-primary">{signUp ? "Sign Up" : "Login"}</button>
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col d-flex">
                        {signUp ?
                            <button type="button" class="btn btn-secondary" onClick={()=>setSignUp(false)}>Login</button>
                            : <button type="button" class="btn btn-secondary" onClick={()=>setSignUp(true)}>Sign Up</button>}
                    </div>
                </div>
                <p>{errorMessage}</p>
            </form>
        </div>
    )
}