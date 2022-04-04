import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchResult } from "./searchResult";

export const Header = () => {
    const [input, setInput] = useState("");
    const [tags, setTags] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [focused, setFocused] = React.useState(false)
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    useEffect(
        () =>{
            axios.get('http://localhost:8000/api/v1/gifs/tags/')
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
    }

    return(
        <div class="sticky-top mb-2" >
            <div class="input-group ">
                <div class="col-md-6 offset-md-3" style={{position: "relative"}}>
                    <div class="row d-flex flex-nowrap">
                        <input class="order-1 p-2 form-control me-2" type="text" placeholder="Filter Tags" 
                        onChange={handleChange} value={input} onFocus={onFocus} onBlur={onBlur} />
                        
                            <button type="button" class="btn btn-light order-1" style={{width: "100px"}}>Logout</button>
                    </div>
                        { focused && <SearchResult style={{position: "absolute", zIndex: 2, top: "37.6px"}} filtered={filtered} />}
                    
                </div>
            </div>
        </div>
        
    )
}