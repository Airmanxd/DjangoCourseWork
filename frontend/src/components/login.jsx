import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { activate } from "../slices/loginSlice";
import { FormGroup, Label, Modal, ModalHeader, ModalBody, Form, Input, ModalFooter, Button } from "reactstrap";
import { toggleLoginForm } from "../slices/formsSlice";

export const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [signUp, setSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const loginForm = useSelector((state)=>state.forms.loginForm);
    const login = useSelector((state)=>state.login.value);

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
        <div>
            <Modal
                centered
                isOpen={loginForm && !login}
                toggle={()=>dispatch(toggleLoginForm())}
            >
                <ModalHeader>
                    {signUp ? "Sign Up Form" : "Login Form"}
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={signUp ? handleSubmitSignUp : handleSubmitLogin}>
                        <FormGroup>
                            <Label for="usernameField">
                                Username
                            </Label>
                            <Input
                             type="username"
                             value={username}
                             onChange={(e)=>setUsername(e.target.value)}
                             id="usernameField">
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="passwordField">
                                Password
                            </Label>
                            <Input
                             type="password"
                             value={password}
                             onChange={(e)=>setPassword(e.target.value)}
                             id="passwordField">
                            </Input>
                        </FormGroup>
                        {signUp && <FormGroup>
                            <Label for="re_passwordField">
                                Confirm Password
                            </Label>
                            <Input
                             type="password"
                             value={passwordConf}
                             onChange={(e)=>setPasswordConf(e.target.value)}
                             id="re_passwordField">
                            </Input>
                        </FormGroup>}
                        <FormGroup>
                            <Button 
                            type="submit"
                            color="primary"
                            >
                                {signUp ? "Sign Up" : "Login"}
                            </Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {signUp ?
                        <Button color="secondary" onClick={()=>setSignUp(false)}>Change to Login Form</Button>
                        : <Button color="secondary" onClick={()=>setSignUp(true)}>Change to Sign Up Form</Button>}
                </ModalFooter>
            </Modal>
        </div>
    )
}