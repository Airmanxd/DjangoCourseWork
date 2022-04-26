import React, { useCallback, useMemo, useState } from "react";
import { Button } from "reactstrap";

export const ActiveTags = ({handleClick, limit, tags, outline=true}) => {
    const [full, setFull] = useState(false);
    const limitLocal = useMemo(()=>limit ? limit : tags.length, [limit, tags]);  
    const fullButton = useMemo(()=>limit < tags.length, [limit, tags]);
    const handleClickTag = useCallback((tag)=>()=>handleClick(tag), [handleClick])
    const handleClickFull = useCallback(()=>setFull(!full),[full]);

    return(
        <div>
            {
                tags.slice(0,limitLocal).map((tag)=>(
                    <Button outline={outline} onClick={handleClickTag(tag)}
                    color={(tag==="Liked" || tag==="My gifs") ? "primary" : "dark"}  key={tag} >{tag}</Button>
                    ))
                }
                {full && 
                    tags.slice(limitLocal, tags.length).map((tag)=>(
                        <Button outline={outline} onClick={handleClickTag(tag)}
                        color={(tag==="Liked" || tag==="My gifs") ? "primary" : "dark"}  key={tag} >{tag}</Button>
                        ))}
                {fullButton &&  <Button outline={outline} onClick={handleClickFull} color="info" >
                                    {full ? "Hide" : "..."}
                                </Button>}
        </div>
    )
}
