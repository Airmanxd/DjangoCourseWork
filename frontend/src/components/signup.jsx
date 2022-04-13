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
        <div className="col-md-3 offset-md-5">
            <form onSubmit={handleSubmit}>
                <div className="form-outline mb-1">
                    <input type="username" className="form-control" value={username}/>
                    <label className="form-label">Username</label>
                </div>

                <div className="form-outline mb-1">
                    <input type="password" className="form-control" value={password}/>
                    <label className="form-label">Password</label>
                </div>
                
                <div className="form-outline mb-1">
                    <input type="password" className="form-control" value={passwordConf} />
                    <label className="form-label">Confirm Your Password</label>
                </div>
                <div className="row mb-1">
                    <div className="col d-flex">
                        <button type="sumbit" className="btn btn-primary">Sign Up</button>
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col d-flex">
                        <button type="button" className="btn btn-secondary">Sign Up</button>
                    </div>
                </div>
                <p>{errorMessage}</p>
            </form>
        </div>
    )
}