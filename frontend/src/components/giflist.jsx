import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAccess } from "../slices/tokenSlice";

export const GifList = () => {
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(15);

    const dispatch = useDispatch();
    const access = useSelector((state)=>state.token.access);
    const refresh = useSelector((state)=>state.token.refresh);

    const loadMore = useCallback(() => {
        console.log("Starting to fetch gifs...");
        setLoading(true);
        axios.get(`${process.env.APP_URL}/api/v1/gifs/?limit=${limit}&offset=${offset}`)
        .then( res => {
            console.log("gifs: ", res.data.gifs);
            const tempGifs = [...gifs, ...res.data.gifs];
            setGifs(tempGifs);
            setLoading(false);
            console.log("offset: ", offset);
            console.log("limit: ", limit);
            setOffset((prev) => prev + limit);
            setHasMore(res.data.hasMore);
            console.log("hasMore: ", res.data.hasMore)
        });
    }, [offset, limit, dispatch]);
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
                {hasMore ? null : "No more gifs to show :("}
            </div>
            
        </div>
    )
}