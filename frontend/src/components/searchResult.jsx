import React from "react";

export const SearchResult = ({filtered}) => {
    return(
        <ul class="list-group">
            {
                filtered.slice(0, 7).map((tag) => (
                    <div>
                        <li class="list-group-item"> {tag}</li>
                    </div>
                ))
            }
        </ul>
    )
}