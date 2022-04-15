import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromActive } from "../slices/tagsSlice";
import { Button } from "reactstrap";

export const ActiveTags = () => {
    const dispatch = useDispatch();
    const active = useSelector((state)=>state.tags.activeTags);
    return(
        <div>
            {
                active.slice(0,5).map((tag)=>(
                    <Button onClick={()=>dispatch(removeFromActive(tag))}
                     color={tag=="Liked" ? "primary" : "danger"} outline >{tag}</Button>
                ))
            }
        </div>
    )
}
