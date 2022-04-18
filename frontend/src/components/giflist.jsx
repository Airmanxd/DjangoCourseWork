import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAccess } from "../slices/tokenSlice";
import ReactLoading from "react-loading";
import { isLoading, isNotLoading } from "../slices/loadingSlice";
import { Button, Card, CardImg, CardTitle, Col, Modal, Row } from "reactstrap";
import { ActiveTags } from "./activeTags";
import { removeFromActive } from "../slices/tagsSlice";

export const GifList = () => {
    const [hasMore, setHasMore] = useState(true);
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [tagsParams, setTagsParams] = useState("")
    const [likes, setLikes] = useState([]);
    const dispatch = useDispatch();
    const login = useSelector((state)=>state.login.value);
    const loading = useSelector((state)=>state.loading.value);
    const access = useSelector((state)=>state.token.access);
    const refresh = useSelector((state)=>state.token.refresh);
    const activeTags = useSelector((state)=>state.tags.activeTags);

    const loadMore = useCallback(() => {
        console.log("Starting to fetch gifs...");
        dispatch(isLoading());
        axios.get(`${process.env.APP_URL}/api/v1/gifs/?limit=${limit}&offset=${offset}${tagsParams}`, 
            access ? {headers: {"Authorization" : `JWT ${access}`}} : null)
        .then( res => {
            const tempGifs = [...gifs, ...res.data.gifs];
            if(res.data.gifs.length === 0 && gifs.length === 0)
                setGifs(["none"]);
            else
                setGifs(tempGifs);
            dispatch(isNotLoading());
            setOffset((prev) => prev + limit);
            setHasMore(res.data.hasMore);
        });
    }, [offset, limit, tagsParams, dispatch]);

    useEffect(()=>{
        loadMore();
    },[tagsParams, dispatch]);
    
    useEffect(()=>{
        if(login){
            axios.get(`${process.env.APP_URL}/api/v1/gifs/likes/`, {headers: {"Authorization" : `JWT ${access}`}})
            .then((result)=>{
                if(result.status === 401){
                    axios.post(`${process.env.APP_URL}/auth/jwt/refresh/`, {refresh : refresh})
                    .then((result)=>{
                            dispatch(changeAccess(result.data.access));
                            axios.get(`${process.env.APP_URL}/api/v1/gifs/likes/`, {headers: {"Authorization" : `JWT ${access}`}})
                            .then((result)=>setLikes(result.data));
                    });
                }
                setLikes(result.data);
            })
        }
    }, [login, setLikes])

    useEffect(() => {
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

    const handleLike = (e) =>{
        if (login){
            axios.post(`${process.env.APP_URL}/api/v1/gifs/likes/`, {id: e.target.id}, {headers : {"Authorization" : `JWT ${access}`}})
            .then((response)=>{
                if(response.status === 401){
                    axios.post(`${process.env.APP_URL}/auth/jwt/refresh/`, {refresh : refresh})
                    .then((result)=>{
                            dispatch(changeAccess(result.data.access));
                            axios.post(`${process.env.APP_URL}/api/v1/gifs/likes/`,  {id: e.target.id}, {headers: {"Authorization" : `JWT ${access}`}})
                            .then((response)=>{
                                if(response.status!==401)
                                    handleLikeResponse(response, e);
                            })
                    });
                }
                handleLikeResponse(response, e);
            });
        }
    };

    const handleLikeResponse = useCallback((response, e)=>{
        if(response.data['liked']){
            setLikes([...likes, e.target.id]);
            e.target.favourites += 1;
        }
        else{
            const temp = likes.slice();
            temp.splice(temp.indexOf(e.target.id, 1));
            setLikes([...likes, temp]);
            e.target.favourites -= 1;
        }
    }, [likes, setLikes])

    const handleClickTag = useCallback((tag)=>{
        dispatch(removeFromActive(tag));
    }, []);
    return(
        <div>
            
            <div style={{overflowY: 'auto', flex: 1}}>
                <Col
                    md={{size: 2}}
                    className="pr-2">
                       <ActiveTags limit={5} tags={activeTags} handleClick={handleClickTag}/>
                </Col>
                <Col
                    md={{size: 8, offset: 2}}>
                    <Row
                    md="5"
                    sm="3"
                    xs="1">
                        { gifs[0]=="none" ? "Sorry, no gifs were found:(" 
                            :   gifs.map(({name, filepath, id, favourites})=>(
                                <Col key={name} className="my-3" onClick={()=>{navigator.clipboard.writeText(filepath)}}
                                onMouseOver={()=>{}}>
                                    <Card className="px-2">
                                        <CardImg
                                        className="dropbox-embed"
                                        alt="Tough luck! Couldn't get the image"
                                        src={filepath}
                                        top/>
                                        <CardTitle>{name}</CardTitle>
                                            <div className="p-2">{favourites}</div>
                                            <Button  className="p-2" favourites={favourites} id={id} onClick={handleLike}>Like</Button>
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
            </div>
        </div>
    )
}