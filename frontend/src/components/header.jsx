import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchResult } from "./searchResult";
import { Button } from 'reactstrap'
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
        <div>
            <div class="input-group flex-nowrap">
                <div class="col-md-3">
                </div>
                <div class="col-md-6">
                    <input class="form-control" type="text" placeholder="Filter tags"
                    onChange={handleChange} value={input} onFocus={onFocus} onBlur={onBlur} />
                    
                    {focused ? <SearchResult filtered={filtered} /> : null}
                </div>
                <div class="col-md-3">
                    <div class="position-absolute top-0 end-0">
                        <Button color="secondary"> Logout</Button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}