import axios from "axios";
import React, { useEffect, useState } from "react";

export const GifList = () => {
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(5);

    const loadMore = () => {
        console.log("Starting to fetch gifs...");
        setLoading(true);
        axios.get(`http://localhost:8000/api/v1/gifs/?limit=${limit}&offset=${offset}`)
        .then( res => {
            console.log("gifs: ", res.data.gifs);
            const tempGifs = [...gifs, ...res.data.gifs];
            setGifs(tempGifs);
            setLoading(false);
            setOffset((prev) => prev += limit);
            setHasMore(res.data.hasMore);
            console.log("Хазымарыч: ", res.data.hasMore)
        });
    };
    useEffect(() => {
        loadMore();
    }, []);
    window.onscroll = () => {
        if(loading || !hasMore) return;
        if(document.documentElement.scrollHeight - 
            document.documentElement.scrollTop ===
             document.documentElement.clientHeight)
             loadMore();
    };
    return(
        <div style={{overflowY: 'scroll', flex: 1}}>
            <h1>
                Gifs
            </h1>
            <p>
                Scroll for more
            </p>
            {gifs.map(({name, file, tags}) => {
                <div>
                    <img src={file}></img>
                    <h3>{name}</h3>
                </div>
            })}
            
        </div>
    )
}