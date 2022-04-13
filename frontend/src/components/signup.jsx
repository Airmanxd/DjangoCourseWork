import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { activate } from "../slices/loginSlice";

export const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loginForm, setLoginForm] = useState(true);
    const [checkBox, setCheckBox] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const dispatch = useDispatch();

    const handleSubmitSignUp = (event) =>
    {
        axios.post("/auth/users/", {username : event.target.username,
                password :  event.target.password,
                re_password :  event.target.passwordConf})
            .then(()=>{ 
                axios.post("/auth/jwt/create/", {username :  event.target.username, password :  event.target.password})
                .then(({access, refresh}) =>{
                    dispatch(changeAccess(access));
                    dispatch(changeRefresh(refresh));
                    dispatch(activate());
                })
                .catch();
            })
            .catch((errorMessage) =>{
                setErrorMessage(errorMessage);
            })
    };

    return(
        <div class="col-md-3 offset-md-5">
            <form onSubmit={handleSubmit}>
                <div class="form-outline mb-1">
                    <input type="username" class="form-control" value={username}/>
                    <label class="form-label">Username</label>
                </div>

                <div class="form-outline mb-1">
                    <input type="password" class="form-control" value={password}/>
                    <label class="form-label">Password</label>
                </div>
                
                <div class="form-outline mb-1">
                    <input type="password" class="form-control" value={passwordConf} />
                    <label class="form-label">Confirm Your Password</label>
                </div>
                <div class="row mb-1">
                    <div class="col d-flex">
                        <button type="sumbit" class="btn btn-primary">Sign Up</button>
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col d-flex">
                        <button type="button" class="btn btn-secondary">Sign Up</button>
                    </div>
                </div>
                <p>{errorMessage}</p>
            </form>
        </div>
    )
}