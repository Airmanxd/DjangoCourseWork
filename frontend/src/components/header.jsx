import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { SearchResult } from "./searchResult";
import { useDispatch, useSelector } from "react-redux";
import { deactivate } from "../slices/loginSlice";
import { changeRefresh, changeAccess } from "../slices/tokenSlice";
import { LoginForm } from "./login";
import { fillTags } from "../slices/tagsSlice";
import { ActiveTags } from "./activeTags";

export const Header = () => {
    const [input, setInput] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [focused, setFocused] = useState(false);
    const [loginForm, setLoginForm] = useState(false);
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
                console.log(res.data);
            });
    }, []);

    useEffect(()=>{
        console.log("activeTags");
        console.log("filtered", filtered, "tags", tags, "activeTags", activeTags);
        setFiltered(filteredTags(input));
    }, [activeTags]);

    useEffect(()=>{
        console.log("filtered: ", filtered);
    }, [filtered]);
    
    const handleChange = useCallback((e) => {
        setInput(e.target.value);
        setFiltered(filteredTags(e.target.value));
    }, [tags]);
    
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
    }, [dispatch]);

    return(
        <div className="sticky-top mb-2" >
                <div className="col-md-6 offset-md-3" style={{position: "relative"}} >
                    <div className="row">
                        <div className="col-md-10" onMouseOver={onFocus} onMouseLeave={onBlur}>
                            <div className="input-group ">
                                <ActiveTags></ActiveTags>
                                <input className="form-control mr-2" type="text" placeholder="Filter Tags" 
                                onChange={handleChange} value={input} />
                            </div>
                                {focused && <SearchResult filtered={filtered} />}
                                {loginForm && !login &&<LoginForm></LoginForm>}
                        </div>
                        <div className="col-md-2">
                            {login ? <button type="button" className="btn btn-primary btn-block"
                                onClick={handleLogOut} >Log Out</button> :
                                <button type="button" className="btn btn-primary btn-block"
                                onClick={()=>setLoginForm(true)}>Login</button>}
                        </div>
                    </div>
                </div>
            </div>
        
    )
}