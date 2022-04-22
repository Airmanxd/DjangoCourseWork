import React, { useState } from "react";
import { Button } from "reactstrap";

export const ActiveTags = ({tags, handleClick, limit}) => {
    const [full, setFull] = useState(false);
    if (limit===0 || limit === undefined)
        limit = tags.length

    return(
        <div>
            {
                tags.slice(0,limit).map((tag)=>(
                    <Button onClick={()=>handleClick(tag)}
                    color={(tag=="Liked" || tag=="My gifs") ? "primary" : "danger"}  key={tag} >{tag}</Button>
                    ))
                }
                {full ? 
                    tags.slice(limit, tags.length).map((tag)=>(
                        <Button onClick={()=>handleClick(tag)}
                        color={(tag=="Liked" || tag=="My gifs") ? "primary" : "danger"}  key={tag} >{tag}</Button>
                        )) : null}
                {limit < tags.length ? <Button onClick={()=>setFull(!full)}
                    color="info" >{full ? "Hide" : "..."}</Button> : null}
        </div>
    )
}
