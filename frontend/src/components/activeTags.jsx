import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromActive } from "../slices/tagsSlice";


export const ActiveTags = () => {
    const dispatch = useDispatch();
    const active = useSelector((state)=>state.tags.activeTags);
    return(
        <div className="input-group-prepend">
            {
                active.slice(0,5).map((tag)=>(
                    <button onClick={()=>dispatch(removeFromActive(tag))}
                     className="btn btn-outline-secondary">{tag}</button>
                ))
            }
        </div>
    )
}
