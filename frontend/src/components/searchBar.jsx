import React from "react";
import { Input } from "reactstrap";
import { SearchResult } from "./searchResult";

export const SearchBar = ({ input, setInput }) =>{
    const [tags, setTags] = useState([]);
    const handleChange = useCallback((e) => {
        setInput(e.target.value);
        setFiltered(filteredTags(e.target.value));
    }, []);
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
            <Input
            type="text"
            placeholder="Choose Tags"
            onChange={handleChange}
            value={input}>
            </Input>
            {focused && 
                <SearchResult limit={7} action={addToActive} filtered={filtered} />}
        </div>
    )
}