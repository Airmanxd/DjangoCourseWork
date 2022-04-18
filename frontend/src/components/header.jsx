import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { SearchResult } from "./searchResult";
import { useDispatch, useSelector } from "react-redux";
import { deactivate } from "../slices/loginSlice";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { LoginForm } from "./login";
import { fillTags, addToActive } from "../slices/tagsSlice";
import { toggleLoginForm, toggleUploadForm } from "../slices/formsSlice";
import { Collapse, Input, Navbar, NavItem, Nav, NavLink, NavbarBrand } from "reactstrap";
import { UploadForm } from "./uploadForm";

export const Header = () => {
    const [input, setInput] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [focused, setFocused] = useState(false);
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    const dispatch = useDispatch();
    const login = useSelector((state) => state.login.value);
    const activeTags = useSelector((state) => state.tags.activeTags);
    const tags = useSelector((state) => state.tags.tempTags);

    useEffect(() =>{
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

    const handleClick = useCallback((tag)=>{
        dispatch(addToActive(tag));
    },[])

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
                    <Input
                    type="text"
                    placeholder="Choose Tags"
                    onChange={handleChange}
                    value={input}>
                    </Input>
                    {focused && 
                        <SearchResult limit={7} handleClick={handleClick} filtered={filtered} />}
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
            <UploadForm></UploadForm>
            <LoginForm></LoginForm>
        </div>
        
    )
}