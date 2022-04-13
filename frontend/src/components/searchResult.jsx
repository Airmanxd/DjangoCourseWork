import React from "react";
import { useDispatch } from "react-redux";
import { addToActive } from "../slices/tagsSlice";


export const SearchResult = ({filtered}) => {
    const dispatch = useDispatch();
    return(
        <div className="list-group" >
            {
                filtered.slice(0, 7).map((tag) => (
                    <button key={tag} type="button" onClick={()=>{dispatch(addToActive(tag))}} 
                        className="list-group-item list-group-item-action"> {tag}</button>
                ))
            }
        </div>
    )
}
