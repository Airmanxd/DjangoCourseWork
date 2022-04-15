import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { SearchResult } from "./searchResult";
import { useDispatch, useSelector } from "react-redux";
import { activate, deactivate } from "../slices/loginSlice";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { LoginForm } from "./login";
import { fillTags, addToActive } from "../slices/tagsSlice";
import { ActiveTags } from "./activeTags";
import { toggleLoginForm, toggleUploadForm } from "../slices/formsSlice";
import { Collapse, Input, InputGroup, Navbar, NavItem, Button, Nav, NavLink, NavbarBrand } from "reactstrap";

export const Header = () => {
    const [input, setInput] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [focused, setFocused] = useState(false);
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    const dispatch = useDispatch();
    const login = useSelector((state) => state.login.value);
    const activeTags = useSelector((state) => state.tags.activeTags);
    const tags = useSelector((state) => state.tags.tags)

    useEffect(
        () =>{
            axios.get(`${process.env.APP_URL}/api/v1/gifs/tags/`)
            .then(res =>{
                dispatch(fillTags(res.data));
                setFiltered(res.data);
            });
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

    const handleLogOut = useCallback(() =>{
        dispatch(deactivate());
        dispatch(changeAccess(""));
        dispatch(changeRefresh(""));
        
    }, [dispatch]);

    return(
        <div>
            <Navbar
            className="sticky-top"
            color="dark"
            dark
            expand="md">
                <NavbarBrand href="/">
                    Main Page
                </NavbarBrand>
                <NavItem onMouseOver={onFocus} onMouseLeave={onBlur}>
                    <InputGroup>
                        <ActiveTags/>
                        <Input
                        type="text"
                        placeholder="Choose Tags"
                        onChange={handleChange}
                        value={input}>
                        </Input>
                    </InputGroup>
                    {focused && 
                        <SearchResult action={addToActive} filtered={filtered} />}
                </NavItem>
                <Collapse navbar>
                    <Nav className="mr-auto"
                    navbar>
                        {login && <>
                            <NavItem>
                                <NavLink onClick={()=>dispatch(toggleUploadForm())}>
                                    Upload
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={()=>dispatch(addToActive('Liked'))}>
                                    Favourites
                                </NavLink>
                            </NavItem>
                        </>}
                        {login ? <NavItem>
                                <NavLink type="button" color="primary"
                                        onClick={handleLogOut} >Log Out</NavLink> 
                                </NavItem>
                                : <NavItem>
                                    <NavLink onClick={()=>dispatch(toggleLoginForm())}>
                                        Login
                                    </NavLink>
                                </NavItem>}
                    </Nav>
                </Collapse>
            </Navbar>
            <LoginForm></LoginForm>
            {/* <div className="sticky-top mb-2 bg-light" >
                <div className="col-md-6 offset-md-3" >
                    <div className="row">
                        <div className="col-md-10" onMouseOver={onFocus} onMouseLeave={onBlur}>
                            <div className="input-group ">
                                <ActiveTags></ActiveTags>
                                <input className="form-control mr-2" type="text" placeholder="Apply Filters" 
                                onChange={handleChange} value={input} />
                            </div>
                            {focused && filtered.length > 0 && <SearchResult action={addToActive} filtered={filtered} />}
                        </div>
                        <div className="col-md-2">
                            {login ? <button type="button" className="btn btn-primary btn-block"
                                        onClick={handleLogOut} >Log Out</button> 
                                : <button type="button" className="btn btn-primary btn-block"
                                    onClick={()=>dispatch(toggleLoginForm())}>Login</button>}
                        </div>
                    </div>
                    {<LoginForm></LoginForm>}
                </div>
            </div> */}
        </div>
        
    )
}