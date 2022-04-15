import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAccess } from "../slices/tokenSlice";
import ReactLoading from "react-loading";
import { isLoading, isNotLoading } from "../slices/loadingSlice";
import { Button, Card, CardImg, CardTitle, Col, Modal, Row } from "reactstrap";

export const GifList = () => {
    const [hasMore, setHasMore] = useState(true);
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [tagsParams, setTagsParams] = useState("")
    const dispatch = useDispatch();
    const loading = useSelector((state)=>state.loading.value);
    const access = useSelector((state)=>state.token.access);
    const refresh = useSelector((state)=>state.token.refresh);
    const activeTags = useSelector((state)=>state.tags.activeTags);

    const loadMore = useCallback(() => {
        console.log("Starting to fetch gifs...");
        dispatch(isLoading());
        console.log("loading", loading);
        axios.get(`${process.env.APP_URL}/api/v1/gifs/?limit=${limit}&offset=${offset}${tagsParams}`)
        .then( res => {
            const tempGifs = [...gifs, ...res.data.gifs];
            console.log("gifs", gifs);
            console.log("res.data.gifs", res.data.gifs);
            console.log("check", res.data.gifs.length === 0 && gifs.length === 0)
            if(res.data.gifs.length === 0 && gifs.length === 0)
                setGifs(["none"]);
            else
                setGifs(tempGifs);
            dispatch(isNotLoading());
            console.log(gifs);
            console.log(tempGifs);
            setOffset((prev) => prev + limit);
            setHasMore(res.data.hasMore);
        });
    }, [offset, limit, tagsParams, dispatch]);

    useEffect(()=>{
        loadMore();
    },[tagsParams, dispatch]);
    

    useEffect(() => {
        console.log("in the active tags useeffect");
        setOffset(0);
        var tempTagsParams = ``;
        activeTags.forEach(tag => {
            tempTagsParams = tempTagsParams.concat(`&tag=${tag}`)
        });
        setGifs([]);
        setTagsParams(tempTagsParams)
    }, [activeTags]);

    window.onscroll = () => {
        if(loading || !hasMore) return;
        if(document.documentElement.scrollHeight - 
            document.documentElement.scrollTop ===
                document.documentElement.clientHeight)
                loadMore("");
    };

    const handleLike = () =>{

    };

    const handleCopy = useCallback((e)=>{

    });

    return(
        <div>
            <div style={{overflowY: 'auto', flex: 1}}>
                
                <Col
                    md={{offset: 2,
                    size: 8,}}>
                    <Row
                    md="5"
                    sm="3"
                    xs="1">
                        { gifs[0]=="none" ? "Sorry, no gifs were found:(" 
                            :   gifs.map(({name, file})=>(
                                <Col className="my-3" onClick={()=>{navigator.clipboard.writeText(file)}}
                                onMouseOver={()=>{}}>
                                    <Card className="px-2">
                                        <CardImg alt="Tough luck! Couldn't get the image"
                                        src={file}
                                        top/>
                                        <CardTitle tag="h5">{name}</CardTitle>
                                        <Button onClick={handleLike}>Like</Button>
                                    </Card>
                                </Col>
                            ))}
                    </Row>
                    <Modal
                    centered
                    size="sm"
                    style={{width: "30px", height: "30px"}}
                    backdrop={false}
                    fade={false}
                    isOpen={loading}>
                        <ReactLoading type="spin" color="blue" width="30px" height="30px"/> 
                    </Modal>
                    {!hasMore && "No more gifs to show :("}
                </Col>
                {/* <div className="col-md-8 offset-md-2">
                    {loading ? 
                        <div className="row">
                            <ReactLoading className="mx-auto mt-5" type="spin" color="blue" width="10%" height="10%"/> 
                        </div>
                        : <div className="row row-cols-5">
                            {(gifs[0] == "none") ? <div className="col-md-6 offset-md-3">
                                Sorry, no gifs were found :(
                            </div>
                                : gifs.map(({name, file}) => (
                                    <div className="col">
                                        <div className="card">
                                            <img className="card-img-top" src={file} ></img>
                                            <h5 className="card-title">{name}</h5>
                                        </div>
                                    </div>
                                ))}
                    </div>}
                </div> */}
            </div>
        </div>
    )
}