import React from "react";

export const Heart = ({color}) =>{
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} stroke="black" className="bi bi-heart" viewBox="-1 -3 20 20">
            <path className="shadow" d="m 8 2.748 z M 8 15 C -7.333 4.868 3.279 -3.04 7.824 1.143 c 0.06 0.055 0.119 0.112 0.176 0.171 a 3.12 3.12 0 0 1 0.176 -0.17 C 12.72 -3.042 23.333 4.867 8 15 z"/>
        </svg>
    )
}