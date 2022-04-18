import React, { useCallback } from "react";
import { DropdownItem, DropdownMenu, UncontrolledDropdown, Button } from "reactstrap";


export const SearchResult = ({filtered, handleClick, limit}) => {
    return(
        <UncontrolledDropdown>
            <DropdownMenu className="show w-100" >
                {
                    filtered.length !== 0 && filtered.slice(0, limit).map((tag) => (
                        <DropdownItem key={tag} type="button" onClick={()=>handleClick(tag)}>
                            {tag}   
                        </DropdownItem>
                    ))
                }
            </DropdownMenu>
        </UncontrolledDropdown>
    
    )
}
