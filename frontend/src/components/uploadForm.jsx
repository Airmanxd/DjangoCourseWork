import React, { useCallback, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { FormGroup, Label, Modal, ModalHeader, ModalBody, Form, Input, ModalFooter, Button, InputGroup } from "reactstrap";
import { toggleUploadForm } from "../slices/formsSlice";

export const UploadForm = () => {
    const [file, setFile] = useState();
    const [name, setName] = useState("");
    const [input, setInput] = useState("");
    const [gifTags, setGifTags] = useState();
    const [focused, setFocused] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    const access = useSelector((state)=>state.token.access);
    const tags = useSelector((state)=>state.tags.tags);
    const login = useSelector((state)=>state.login.value);
    const uploadForm = useSelector((state)=>state.forms.uploadForm);
    const dispatch = useDispatch();

    const handleSubmit = useCallback((event)=>{
        console.log("Starting to upload the gif");
        axios.post(`${process.env.APP_URL}/api/v1/gifs/`, {headers : {"Authorization" : `Bearer ${access}`}, })
    });

    const handleEnter = useCallback((event)=>{
        if(event.key==="Enter") {
            setGifTags(...gifTags, event.target.value);
        }
    });
    
    const addToTags = useCallback((tag)=>{
        setGifTags(...gifTags, tag);
    }, []);
    
    useEffect(()=>{
        setFiltered(filteredTags(input));
    }, [activeTags]);

    const handleChange = useCallback((e) => {
        setInput(e.target.value);
        setFiltered(filteredTags(e.target.value));
    }, [tags]);
    
    const filteredTags = (inp) => {
        if(inp!==""){
            return tags.filter((tag) => {
                if(tag.toLowerCase().includes(inp.toLowerCase()))
                    return tag;
            });
        }
        else
            return tags;
    };
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
                            <Label for="nameField">
                                Username
                            </Label>
                            <Input
                             type="text"
                             value={name}
                             onChange={(e)=>setName(e.target.value)}
                             id="nameField">
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="uploadField">
                                Gif
                            </Label>
                            <Input
                             type="file"
                             value={file}
                             onChange={(e)=>setFile(e.target.files[0])}
                             id="uploadField">
                            </Input>
                        </FormGroup>
                        <FormGroup onMouseOver={onFocus} onMouseLeave={onBlur}>
                            <Label for="gifTagsField">
                                Tags
                            </Label>
                            <InputGroup
                             type="text"
                             value={input}
                             onChange={handleChange}
                             onKeyDown={handleEnter}
                             id="gifTagsField">
                            </InputGroup>
                            {focused && 
                                <SearchResult action={addToTags} filtered={filtered} />}
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