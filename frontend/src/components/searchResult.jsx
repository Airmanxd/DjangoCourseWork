import React, { useCallback, useState } from "react";

export const SearchResult = ({filtered, handleClick}) => {
    return(
        <ul class="list-group" style={{position: "absolute",
            width: "100%",
            zIndex: 10}}>
            {
                filtered.slice(0, 7).map((tag) => (
                    <a onClick={handleClick} class="list-group-item"> {tag}</a>
                ))
            }
        </ul>
    )
}