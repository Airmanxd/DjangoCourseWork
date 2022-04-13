import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { SearchResult } from "./searchResult";
import { useDispatch, useSelector } from "react-redux";
import { deactivate } from "../slices/loginSlice";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { LoginForm } from "./login";

export const Header = () => {
    const [input, setInput] = useState("");
    const [tags, setTags] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [focused, setFocused] = useState(false)
    const [filters, setFilters] = useState([]);
    const [loginForm, setLoginForm] = useState(false);
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    const dispatch = useDispatch();
    const login = useSelector((state) => state.login.value);

    useEffect(
        () =>{
            axios.get(`${process.env.APP_URL}/api/v1/gifs/tags/`)
            .then(res =>{
                setTags(res.data);
                console.log(res.data);
            });
    }, []);
    
    const handleChange = (e) => {
        setInput(e.target.value);
        setFiltered(filteredTags(e.target.value));
    };
    
    const filteredTags = (inp) => {
        return tags.filter((tag) => {
            if(tag.toLowerCase().includes(inp.toLowerCase()))
                return tag;
        });
    };

    const handleLogOut = useCallback(() =>{
        dispatch(deactivate());
        dispatch(changeAccess(""));
        dispatch(changeRefresh(""));
        setLoginForm(false);
    }, [dispatch, login])

    const handleClick = useCallback((e) => {
        setFilters(...filters, ...[e.target.value]);
        console.log("filters: ", filters);
    }, [filters, filtered]);

    return(
        <div class="sticky-top mb-2" >
            <div class="input-group ">
                <div class="col-md-6 offset-md-3" style={{position: "relative"}}>
                    <div class="row d-flex flex-nowrap">
                        <input class="order-1 p-2 form-control me-2" type="text" placeholder="Filter Tags" 
                        onChange={handleChange} value={input} onFocus={onFocus} onBlur={onBlur} />
                        
                            {login ? <button type="button" class="btn btn-primary order-1"
                                    onClick={handleLogOut} style={{width: "100px"}}>Log Out</button> :
                                   <button type="button" class="btn btn-primary order-1"
                                   onClick={()=>setLoginForm(true)} style={{width: "100px"}}>Login</button>}
                    </div>
                        { focused && <SearchResult style={{position: "absolute", zIndex: 2, top: "37.6px"}}
                         handleCLick={handleClick} filtered={filtered} />}
                         {loginForm && !login &&<LoginForm></LoginForm>}
                    
                </div>
            </div>
        </div>
        
    )
}