import React from "react";
import { useDispatch } from "react-redux";
import { DropdownItem, DropdownMenu, UncontrolledDropdown, Button } from "reactstrap";
import { addToActive } from "../slices/tagsSlice";


export const SearchResult = ({filtered, action}) => {
    const dispatch = useDispatch();
    return(
        <UncontrolledDropdown>
            <DropdownMenu className="show w-100" >
                {
                    filtered.slice(0, 7).map((tag) => (
                        <DropdownItem>
                            <Button key={tag} type="button" onClick={()=>{dispatch(action(tag))}} 
                                className="dropdown-item"> {tag}</Button>
                        </DropdownItem>
                    ))
                }
            </DropdownMenu>
        </UncontrolledDropdown>
    
    )
}
