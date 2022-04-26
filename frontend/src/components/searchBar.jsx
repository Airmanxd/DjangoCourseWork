import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input } from "reactstrap";
import { SearchResult } from "./searchResult";

export const SearchBar = ({ input, setInput, searchResultAction, usedTags}) =>{
    const ALLtags = useSelector( state => state.tags.tags);
    const [tags, setTags] = useState(ALLtags);
    const [filtered, setFiltered] = useState([]);
    const [focused, setFocused] = useState(false);

    const getFilteredTags = useCallback((inp) => {
        if(inp!==""){
            return tags.filter((tag) => tag.toLowerCase().includes(inp.toLowerCase()));
        }
        else
            return tags;
    }, [tags]);

    useEffect(()=>{
        console.log("setting tags to ", ALLtags.filter((tag)=>!usedTags.includes(tag)));
        setTags(ALLtags.filter((tag)=>!usedTags.includes(tag)));
    }, [ALLtags, usedTags])

    const handleSpecialKeys = useCallback((event)=>{
        if(event.key==="Enter") {
            event.preventDefault();
            searchResultAction(event.target.value);
            setInput("");
        }
        if(event.key==="Tab"){
            event.preventDefault();
            setInput(getFilteredTags(input)[0]);
        }
    }, [getFilteredTags, input, searchResultAction, setInput]);


    const handleChange = useCallback((e) => {
        setInput(e.target.value);
        setFiltered(getFilteredTags(e.target.value));
    }, [getFilteredTags, setInput]);
    
    useEffect(()=>{
        setFiltered(getFilteredTags(input));
    }, [tags, input, getFilteredTags]);

    const handleFocusOn = useCallback(()=>setFocused(true),[]);

    const handleFocusOff = useCallback(()=>setFocused(false), []);

    return(
        <div onMouseOver={handleFocusOn} onMouseLeave={handleFocusOff}>
            <Input
            type="text"
            placeholder="Choose Tags"
            onChange={handleChange}
            onKeyDown={handleSpecialKeys}
            value={input}>
            </Input>
            {focused && 
                <SearchResult limit={7} handleClick={searchResultAction} filtered={filtered} />}
        </div>
    )
}