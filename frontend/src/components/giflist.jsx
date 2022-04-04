import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";

export const GifList = () => {
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(5);

    const loadMore = useCallback(() => {
        console.log("Starting to fetch gifs...");
        setLoading(true);
        axios.get(`http://localhost:8000/api/v1/gifs/?limit=${limit}&offset=${offset}`)
        .then( res => {
            console.log("gifs: ", res.data.gifs);
            const tempGifs = [...gifs, ...res.data.gifs];
            setGifs(tempGifs);
            setLoading(false);
            console.log("offset: ", offset);
            console.log("limit: ", limit);
            setOffset((prev) => prev + limit);
            setHasMore(res.data.hasMore);
            console.log("Хазымарыч: ", res.data.hasMore)
        });
    }, [offset, limit]);
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
        <div style={{overflowY: 'auto', flex: 1}}>
            <div class="col-md-8 offset-md-2">
                <div class="row row-cols-5">
                    {
                        gifs.map(({name, file, tags}) => (
                            <div class="col">
                                <div class="card">
                                    <img class="card-img-top" src={file} ></img>
                                    <h5 class="card-title">{name}</h5>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            
        </div>
    )
}