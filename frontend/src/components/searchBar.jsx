import React from "react";

export const SearchBar = ({inputValue, }) =>{
    const [tags, setTags] = useState([]);
    const handleChange = useCallback((e) => {
        setInput(e.target.value);
        setFiltered(filteredTags(e.target.value));
    }, []);
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