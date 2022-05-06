import React, { useCallback } from "react";
import { DropdownItem, DropdownMenu, UncontrolledDropdown } from "reactstrap";

interface Props{
    filtered: string[];
    handleClick: (tag: string)=>void;
    limit: number;
}

export const SearchResult = ({filtered, handleClick, limit}: Props) => {
    const handleClickItem = useCallback((tag: string)=>()=>handleClick(tag), [handleClick]);
    return(
        <UncontrolledDropdown>
            <DropdownMenu className="show w-100" >
                {
                    filtered.length !== 0 && filtered.slice(0, limit).map((tag) => (
                        <DropdownItem key={tag} type="button" onClick={handleClickItem(tag)}>
                            {tag}   
                        </DropdownItem>
                    ))
                }
            </DropdownMenu>
        </UncontrolledDropdown>
    
    )
}
