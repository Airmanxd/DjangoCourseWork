import React, { useState, useCallback, useEffect } from "react";
import { Input } from "reactstrap";
import { useAppSelector } from "../hooks";
import { SearchResult } from "./searchResult";

interface Props {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    searchResultAction: (e: string) => void;
    usedTags: string[];
}

type ChangeEvent = React.ChangeEventHandler<HTMLInputElement>;

export const SearchBar = ({ input, setInput, searchResultAction, usedTags}: Props) =>{
    const ALLtags = useAppSelector( state => state.tags.tags);
    const [tags, setTags] = useState(ALLtags);
    const [filtered, setFiltered] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);

    const getFilteredTags = useCallback((inp: string) => {
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

    const handleSpecialKeys = useCallback((event: React.KeyboardEvent<HTMLInputElement>)=>{
        if(event.key==="Enter") {
            event.preventDefault();
            searchResultAction(event.currentTarget.value);
            setInput("");
        }
    }, [getFilteredTags, input, searchResultAction, setInput]);


    const handleChange: ChangeEvent = useCallback((e) => {
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