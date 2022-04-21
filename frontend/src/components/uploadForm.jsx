import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, Label, Modal, ModalHeader, ModalBody, Form, Input, Button, InputGroup } from "reactstrap";
import { toggleUploadForm } from "../slices/formsSlice";
import { SearchResult } from "./searchResult";
import { ActiveTags } from "./activeTags";
import { isLoading, isNotLoading } from "../slices/loadingSlice";
import { addInfoAlert } from "../slices/alertsSlice";

export const UploadForm = ({update}) => {
    const ALLtags = useSelector((state)=>state.tags.tags);
    const [file, setFile] = useState();
    const [name, setName] = useState("");
    const [input, setInput] = useState("");
    const [focused, setFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [uploadTags, setUploadTags] = useState([]);
    const [nameError, setNameError] = useState("");
    const [fileError, setFileError] = useState("");
    const [tagsError, setTagsError] = useState("");
    const access = useSelector((state)=>state.token.access);
    const uploadForm = useSelector((state)=>state.forms.uploadForm);
    const dispatch = useDispatch();

    useEffect(()=>{
        setTags(ALLtags);
    }, [ALLtags, setTags]);

    useEffect(()=>{
        setName("");
        setUploadTags([]);
        setInput("");
        setNameError("");
        setFileError("");
        setTagsError("");
        setFile(null);
    },[uploadForm]);

    useEffect(()=>{
        setSuggestions(filterSuggestions(input));
    }, [tags, input]);

    const handleSubmit = useCallback((event)=>{
        event.preventDefault();
        console.log("Starting to upload the gif");
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        const tagsString = `[\"${uploadTags.join("\", \"")}\"]`;
        uploadTags.map((tag)=>{tagsString.concat(tag, "\", \"")});
        formData.append('tags', tagsString);
        dispatch(isLoading());

        axios.post(`${process.env.APP_URL}/api/v1/gifs/`, formData,
                {headers : {"Authorization" : `JWT ${access}`,"content-type" : "multipart/form-data"}})
                .then( response => handleUploadSuccess(response))
            .catch(error => {
                if(error.response.status===401)
                    axios.post(`${process.env.APP_URL}/auth/jwt/refresh/`, {refresh : refresh})
                                .then( result => {
                                    dispatch(changeAccess(result.data.access));
                                    axios.post(`${process.env.APP_URL}/api/v1/gifs/`,
                                        {'file' : file, 'name' : name, 'tags' : tags},
                                        {headers : {"Authorization" : `JWT ${access}`,"content-type" : "multipart/form-data"}})
                                        .then( response => handleUploadSuccess(response))
                                        .catch(error => handleUploadError(error));
                                    });
                else
                    handleUploadError(error);

            });
    }, [file, name, uploadTags]);

    const handleUploadSuccess = useCallback( response => {
        console.log("upload response: ", response);
        dispatch(isNotLoading());
        dispatch(toggleUploadForm());
        dispatch(addInfoAlert("Successfully Uploaded the Gif"));
        setTags([...tags, ...uploadTags]);
    }, [uploadTags, tags])

    const handleUploadError = useCallback( error => {
        dispatch(isNotLoading());
        setNameError(error.response.data.name);
        setFileError(error.response.data.file);
        setTagsError(error.response.data.tags);
    },[]);

    const removeFromTags = useCallback((tag)=>{
        const temp = tags.slice();
        temp.splice(tags.indexOf(tag), 1); 
        setTags(temp);
    }, [tags, setTags]);

    const addToTags = useCallback((tag) =>{
        const temp = tags.slice();
        temp.push(tag); 
        setTags(temp);
    },[tags, setTags]);

    const handleSpecialKeys = useCallback((event)=>{
        if(event.key==="Enter") {
            event.preventDefault();
            if(tags.includes(event.target.value))
                removeFromTags(event.target.value);
            setUploadTags([...uploadTags, event.target.value]);
            setInput("");
        }
        if(event.key==="Tab"){
            event.preventDefault();
            const tagsSuggestions = filterSuggestions(input);
            setInput(tagsSuggestions[0]);
        }
    }, [dispatch, input]);

    const handleChange = useCallback((e) => {
        setInput(e.target.value);
    }, [setInput]);

    const handleClickSuggestions = useCallback((tag)=>{
        removeFromTags(tag);
        setUploadTags([...uploadTags, tag]);
    },[uploadTags, setUploadTags, removeFromTags]);

    const handleClickTags = useCallback((tag)=>{
        addToTags(tag);
        const temp = uploadTags.slice();
        temp.splice(temp.indexOf(tag), 1);
        setUploadTags(temp);
    },[uploadTags, setUploadTags, addToTags]);

    const filterSuggestions = useCallback((inp) => {
        if(inp!==""){
            return tags.filter((tag) => {
                if(tag.toLowerCase().includes(inp.toLowerCase()))
                    return tag;
            });
        }
        else
            return tags;
    }, [tags]);
    return(
        <div>
            <Modal
                centered
                isOpen={uploadForm}
                toggle={()=>dispatch(toggleUploadForm())}
            >
                <ModalHeader>
                    Upload Form
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <p className="text-danger">
                                {nameError}
                            </p>
                            <Label for="nameField">
                                Name for the gif
                            </Label>
                            <Input
                             type="text"
                             value={name}
                             onChange={(e)=>setName(e.target.value)}
                             id="nameField">
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <p className="text-danger">
                                {fileError}
                            </p>
                            <Label for="uploadField">
                                Gif
                            </Label>
                            <Input
                             type="file"
                             onChange={(e)=>setFile(e.target.files[0])}
                             accept="image/gif"
                             id="uploadField">
                            </Input>
                        </FormGroup>
                        <FormGroup >
                            <p className="text-danger">
                                {tagsError}
                            </p>
                            <Label for="gifTagsField">
                                Tags
                            </Label>
                            <div onMouseOver={()=> setFocused(true)} onMouseLeave={() => setFocused(false)}>
                                <Input type="text"
                                value={input}
                                onChange={handleChange}
                                onKeyDown={handleSpecialKeys}
                                id="gifTagsField"
                                placeholder="Choose Tags"/>
                            {focused && 
                                <SearchResult limit={3} handleClick={handleClickSuggestions} filtered={suggestions} />}
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Button 
                            type="submit"
                            color="primary"
                            >
                                Upload
                            </Button>
                        </FormGroup>
                    </Form>
                <ActiveTags limit={5} tags={uploadTags} handleClick={handleClickTags}/>
                </ModalBody>
            </Modal>
        </div>
    )
}