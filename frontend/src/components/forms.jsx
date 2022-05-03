import React, { useCallback, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, Label, Modal, ModalHeader, ModalBody, Form, Input, Button, ModalFooter } from "reactstrap";
import ReactLoading from "react-loading";
import { toggleLoginForm, toggleUpdateForm, toggleUploadForm, toggleSignUpForm } from "../slices/formsSlice";
import { ActiveTags } from "./activeTags";
import { isLoading, isNotLoading } from "../slices/loadingSlice";
import { changeAccess, changeRefresh } from "../slices/tokenSlice";
import { activate } from "../slices/loginSlice";
import { addInfoAlert, addErrorAlert } from "../slices/alertsSlice";
import { SearchBar } from "./searchBar";
import { updateTags } from "../slices/tagsSlice";

export const Forms = ({id}) => {
    const [file, setFile] = useState();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setPasswordConf] = useState("");
    const [input, setInput] = useState("");
    const [uploadTags, setUploadTags] = useState([]);
    const [nameError, setNameError] = useState("");
    const [fileError, setFileError] = useState("");
    const [tagsError, setTagsError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfError, setPasswordConfError] = useState("");
    const [formInfo, setFormInfo] = useState({});
    const access = useSelector( state => state.token.access);
    const uploadForm = useSelector( state => state.forms.uploadForm);
    const loginForm = useSelector( state => state.forms.loginForm);
    const updateForm = useSelector( state => state.forms.updateForm);
    const signUpForm = useSelector( state => state.forms.signUpForm);
    const refresh = useSelector( state => state.token.refresh);
    const loading = useSelector( state => state.loading.value);
    const dispatch = useDispatch();

    const form = useMemo(()=>uploadForm || loginForm || updateForm || signUpForm, 
    [loginForm, updateForm, uploadForm, signUpForm]);

    const userForm = useMemo(()=>loginForm || signUpForm, [loginForm, signUpForm]);

    const toggleActiveForm = useCallback(()=>{
        switch (true) {
            case uploadForm:
                dispatch(toggleUploadForm());
                break;
            case updateForm:
                dispatch(toggleUpdateForm());
                break;
            case loginForm:
                dispatch(toggleLoginForm());
                break;
            case signUpForm:
                dispatch(toggleSignUpForm());
                break;
            default:
                break;
        }
    }, [dispatch, loginForm, signUpForm, updateForm, uploadForm])
    
    useEffect(()=>{
        setName("");
        setUploadTags([]);
        setInput("");
        setNameError("");
        setFileError("");
        setTagsError("");
        setFile(null);
    },[uploadForm]);

    const handleLoginToggle = useCallback(()=>()=>{
        console.log("login toggle");
        toggleActiveForm();
        dispatch(toggleLoginForm());
    }, [dispatch, toggleActiveForm]);

    const handleSignUpToggle = useCallback(()=>()=>{
        console.log("signup toggle");
        toggleActiveForm();
        dispatch(toggleSignUpForm());
    }, [dispatch, toggleActiveForm]);
    
    const handleNameChange = useCallback( e =>  setName(e.target.value), []);

    const handlePasswordChange = useCallback( e => setPassword(e.target.value), []);

    const handlePasswordConfChange = useCallback( e => setPasswordConf(e.target.value), []);

    const handleUploadSuccess = useCallback( response => {
        dispatch(isNotLoading());
        toggleActiveForm();
        dispatch(addInfoAlert("Successfully uploaded the gif!"));
        dispatch(updateTags(response.data.tags));
    }, [dispatch, formInfo, toggleActiveForm])

    const handleUploadError = useCallback( error => {
        dispatch(isNotLoading());
        setNameError(error.response.data.name);
        setFileError(error.response.data.file);
        setTagsError(error.response.data.tags);
    },[dispatch]);

    const handleSubmitUpload = useCallback( event => {
        event.preventDefault();
        console.log("Starting to upload the gif");
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        var tagsString = "[]";
        if(uploadTags.length===0){
            tagsString = `["${uploadTags.join('", "')}"]`;
            uploadTags.map( tag => tagsString.concat(tag, '", "'));
        }
        formData.append('tags', tagsString);
        dispatch(isLoading());

        axios.post(`/backend/api/v1/gifs/`, formData,
                {headers : {"Authorization" : `JWT ${access}`,"content-type" : "multipart/form-data"}})
                .then( response => handleUploadSuccess(response))
                .catch(error => {
                    if(error.response.status===401)
                        axios.post(`/backend/auth/jwt/refresh/`, {refresh : refresh})
                            .then( result => {
                                dispatch(changeAccess(result.data.access));
                                axios.post(`/backend/api/v1/gifs/`,formData,
                                    {headers : {"Authorization" : `JWT ${access}`,"content-type" : "multipart/form-data"}})
                                    .then( response => handleUploadSuccess(response))
                                    .catch(error => handleUploadError(error));
                                });
                    else
                        handleUploadError(error);

            });
    }, [access, dispatch, file, handleUploadError, handleUploadSuccess, name, refresh, uploadTags]);

    const handleSubmitLogin = useCallback( event =>
    {
        event.preventDefault();
        axios.post(`/backend/auth/jwt/create`, {username : name,
             password})
            .then((response)=>{
                toggleActiveForm();
                dispatch(changeAccess(response.data.access));
                dispatch(changeRefresh(response.data.refresh));
                dispatch(activate());
            })
            .catch(error => {
                setNameError(error.response.data.username);
                setPasswordError(error.response.data.password);
                dispatch(addErrorAlert(error.response.data.non_field_errors))
            });
                
    }, [name, password, dispatch, toggleActiveForm]); 

    const handleSubmitSignUp = useCallback( (event) =>
    {
        event.preventDefault();
        axios.post(`/backend/auth/users/`, {username : name,
                password,
                re_password :  re_password})
            .then(()=>{ 
                axios.post(`/backend/auth/jwt/create/`, {name,  password})
                .then((result) =>{
                    dispatch(changeAccess(result.data.access));
                    dispatch(changeRefresh(result.data.refresh));
                    dispatch(activate());
                })
                .catch();
            })
            .catch((error) =>{
                setNameError(error.response.data.username);
                setPasswordError(error.response.data.password);
                setPasswordConfError(error.response.data.non_field_errors);
            })
    }, [dispatch, password, re_password, name]);

    const handleSubmitUpdate = useCallback( event =>{
        event.preventDefault();
        console.log(`Starting to update the gif ${id}`);
        const formData = new FormData();
        formData.append('name', name);
        var tagsString = "[]";
        if(uploadTags.length!==0){
            tagsString = `["${uploadTags.join("\", \"")}"]`;
            uploadTags.map( tag => tagsString.concat(tag, '", "'));
        }
        formData.append('tags', tagsString);

        axios.patch(`/backend/api/v1/gifs/${id}/`, formData,
                {headers : {"Authorization" : `JWT ${access}`,"content-type" : "multipart/form-data"}})
                .then( response => handleUploadSuccess(response))
                .catch(error => {
                    if(error.response.status===401)
                        axios.patch(`/backend/auth/jwt/refresh/`, {refresh : refresh})
                                .then( result => {
                                    dispatch(changeAccess(result.data.access));
                                    axios.post(`/backend/api/v1/gifs/${id}/`,
                                        formData,
                                        {headers : {"Authorization" : `JWT ${access}`,"content-type" : "multipart/form-data"}})
                                        .then( response => handleUploadSuccess(response))
                                        .catch(error => handleUploadError(error));
                                    });
                    else
                        handleUploadError(error);

            });
    }, [access, dispatch, handleUploadError, handleUploadSuccess, id, name, refresh, uploadTags]);

    useEffect(()=>{
        switch (true) {
            case uploadForm:
                setFormInfo({method : "Upload",
                    nameField : "Name"});
                    break;
            case updateForm:
                setFormInfo({method : "Update",
                    nameField : "Name"});
                    break;
            case signUpForm:
                setFormInfo({method : "Sign Up",
                    nameField : "Username"});
                    break;
            case loginForm:
                setFormInfo({method : "Login",
                    nameField : "Username"});
                    break;
            default:
                break;
        }
    }, [uploadForm, loginForm, signUpForm, updateForm])

    const handleClickSuggestions = useCallback((tag)=>{
        setUploadTags([...uploadTags, tag]);
    },[uploadTags, setUploadTags]);

    const handleClickTags = useCallback((tag)=>{
        const temp = uploadTags.slice();
        temp.splice(temp.indexOf(tag), 1);
        setUploadTags(temp);
    },[uploadTags, setUploadTags]);

    const handleChangeFile = useCallback( e => setFile(e.target.files[0]), []);

    const onSubmit = useCallback((event)=>{
        switch (true) {
            case uploadForm:
                handleSubmitUpload(event);
                break;
            case updateForm:
                handleSubmitUpdate(event);
                break;
            case signUpForm:
                handleSubmitSignUp(event);
                break;
            case loginForm:
                handleSubmitLogin(event);
                break;
            default:
                break;
        }
    }, [handleSubmitLogin, handleSubmitSignUp, handleSubmitUpdate, handleSubmitUpload, loginForm, signUpForm, updateForm, uploadForm]);

    return(
        <div>
            <Modal
                centered
                isOpen={form}
                toggle={toggleActiveForm}
            >
                <ModalHeader>
                    {`${formInfo.method} Form`}
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <p className="text-danger">
                                {nameError}
                            </p>
                            <Label for="nameField">
                                {formInfo.nameField}
                            </Label>
                            <Input
                             type="text"
                             value={name}
                             onChange={handleNameChange}
                             id="nameField">
                            </Input>
                        </FormGroup>
                        {uploadForm && <FormGroup>
                            <p className="text-danger">
                                {fileError}
                            </p>
                            <Label for="uploadField">
                                Gif
                            </Label>
                            <Input
                             type="file"
                             onChange={handleChangeFile}
                             accept="image/gif"
                             id="uploadField">
                            </Input>
                        </FormGroup>}
                        {
                            userForm &&
                            <FormGroup>
                                <p className="text-danger">
                                    {passwordError}
                                </p>
                            <Label for="passwordField">
                                Password
                            </Label>
                            <Input
                             type="password"
                             value={password}
                             onChange={handlePasswordChange}
                             id="passwordField">
                            </Input>
                        </FormGroup>}
                        {signUpForm && <FormGroup>
                            <p className="text-danger">
                                {passwordConfError}
                            </p>
                            <Label for="re_passwordField">
                                Confirm Password
                            </Label>
                            <Input
                             type="password"
                             value={re_password}
                             onChange={handlePasswordConfChange}
                             id="re_passwordField">
                            </Input>
                        </FormGroup>}
                        {!userForm && <FormGroup >
                            <p className="text-danger">
                                {tagsError}
                            </p>
                            <Label>
                                Tags
                            </Label>
                            <SearchBar 
                                input={input} 
                                setInput={setInput} 
                                searchResultAction={handleClickSuggestions}
                                usedTags={uploadTags}
                            />
                        </FormGroup>}
                        <FormGroup>
                            <Button 
                            type="submit"
                            color="primary"
                            >
                                {formInfo.method}
                            </Button>
                        </FormGroup>
                        <div className="container-fluid d-flex justify-content-center">
                            {loading && <ReactLoading type="bars" color="black" width="60px" height="30px"/> }
                        </div>
                    </Form>
                <ActiveTags limit={5} tags={uploadTags} handleClick={handleClickTags}/>
                </ModalBody>
                {userForm && <ModalFooter>
                    {signUpForm ?
                        <Button color="secondary" onClick={handleLoginToggle()}>Change to Login Form</Button>
                        : <Button color="secondary" onClick={handleSignUpToggle()}>Change to Sign Up Form</Button>}
                </ModalFooter>}
            </Modal>
        </div>
    )
}