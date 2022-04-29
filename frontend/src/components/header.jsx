import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { deactivate } from "../slices/loginSlice";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { fillTags, addToActive } from "../slices/tagsSlice";
import { toggleLoginForm, toggleUploadForm } from "../slices/formsSlice";
import { Collapse, Navbar, NavItem, Nav, NavLink, NavbarToggler } from "reactstrap";
import { addErrorAlert } from "../slices/alertsSlice";
import { SearchBar } from "./searchBar";
import "../styles/headerModule.css"

export const Header = () => {
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const login = useSelector((state) => state.login.value);
    const activeTags = useSelector((state) => state.tags.activeTags);

    useEffect(() => {
            axios.get(`${process.env.APP_URL}/api/v1/gifs/tags/`)
            .then(res =>{
                dispatch(fillTags(res.data));
            })
            .catch( error => dispatch(addErrorAlert(error.response.data)));
    }, [dispatch]);

    const handleLogOutClick = useCallback(() => {
        dispatch(deactivate());
        dispatch(changeAccess(""));
        dispatch(changeRefresh(""));
        window.location.reload();
    }, [dispatch]);

    const handleClickSearchBar = useCallback( tag => {
        console.log("hello");
        dispatch(addToActive(tag));
    },[dispatch])

    const toggleCollapse = useCallback(()=>{
        setOpen(!open);
    }, [open, setOpen]);

    const handleSpecialTagClick = useCallback((tag)=>()=>dispatch(addToActive(tag)), [dispatch]);

    const handleLoginClick = useCallback(()=>dispatch(toggleLoginForm()), [dispatch]);

    const handleUploadClick = useCallback(()=>dispatch(toggleUploadForm()), [dispatch]);

    return(
        <div>
            <Navbar
            className="sticky-top"
            dark
            expand="md">
                <NavItem  className="col-md-6 offset-md-2">
                    <SearchBar input={input} setInput={setInput} searchResultAction={handleClickSearchBar} usedTags={activeTags}/>
                </NavItem>
                <NavbarToggler onClick={toggleCollapse}/>
                <Collapse isOpen={open} navbar>
                    <Nav
                    navbar>
                        {login && <>
                            <NavItem>
                                <NavLink onClick={handleUploadClick}>
                                    Upload
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={handleSpecialTagClick("Liked")}>
                                    Liked
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={handleSpecialTagClick("My gifs")}>
                                    My gifs
                                </NavLink>
                            </NavItem>
                        </>}
                        {login ? <NavItem>
                                    <NavLink onClick={handleLogOutClick}>
                                        Log Out
                                    </NavLink> 
                                 </NavItem>
                                : <NavItem>
                                    <NavLink onClick={handleLoginClick}>
                                        Login
                                    </NavLink>
                                </NavItem>}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
        
    )
}