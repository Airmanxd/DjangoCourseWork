import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAccess } from "../slices/tokenSlice";
import ReactLoading from "react-loading";
import { isLoading, isNotLoading } from "../slices/loadingSlice";
import { Alert, Button, Card, CardFooter, CardImg, CardTitle, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { ActiveTags } from "./activeTags";
import { removeFromActive } from "../slices/tagsSlice";
import { Heart } from "./heart";
import { addErrorAlert, addInfoAlert, removeFromAlerts } from "../slices/alertsSlice";

export const GifList = () => {
    const [hasMore, setHasMore] = useState(true);
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [tagsParams, setTagsParams] = useState("")
    const [userLikes, setLikes] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const dispatch = useDispatch();
    const login = useSelector( state => state.login.value);
    const loading = useSelector( state => state.loading.value);
    const access = useSelector( state => state.token.access);
    const refresh = useSelector( state => state.token.refresh);
    const activeTags = useSelector( state => state.tags.activeTags);
    const alerts = useSelector( state => state.alerts.alerts)

    const loadMore = useCallback(() => {
        console.log("Starting to fetch gifs...");
        dispatch(isLoading());
        axios.get(`${process.env.APP_URL}/api/v1/gifs/?limit=${limit}&offset=${offset}${tagsParams}`, 
            access ? {headers: {"Authorization" : `JWT ${access}`}} : null)
        .then( res => {
            console.log(res.data);
            if(res.data.gifs.length === 0 && gifs.length === 0)
                setGifs(["none"]);
            else
                setGifs([...gifs, ...res.data.gifs]);
            dispatch(isNotLoading());
            setOffset((prev) => prev + limit);
            setHasMore(res.data.hasMore);
        })
        .catch((error)=>{
            if(error.response.status===401){
                dispatch(changeAccess(""));
                axios.get(`${process.env.APP_URL}/api/v1/gifs/?limit=${limit}&offset=${offset}${tagsParams}`)
                    .then( res => {
                        console.log(res.data);
                        if(res.data.gifs.length === 0 && gifs.length === 0)
                            setGifs(["none"]);
                        else
                            setGifs([...gifs, ...res.data.gifs]);
                        dispatch(isNotLoading());
                        setOffset((prev) => prev + limit);
                        setHasMore(res.data.hasMore);
                    })
                    .catch( error => dispatch(addErrorAlert(error.response.data)));
            }
            else
                dispatch(addErrorAlert(error.response.data))
        });
    }, [offset, limit, tagsParams, dispatch]);

    useEffect(()=>{
        loadMore();
    },[tagsParams, dispatch]);
    
    useEffect(()=>{
        if(login){
            axios.get(`${process.env.APP_URL}/api/v1/gifs/likes/`, {headers: {"Authorization" : `JWT ${access}`}})
            .then((result)=>setLikes(result.data))
            .catch((error)=>{
                if(error.response.status === 401){
                    axios.post(`${process.env.APP_URL}/auth/jwt/refresh/`, {refresh : refresh})
                    .then((result)=>{
                            dispatch(changeAccess(result.data.access));
                            axios.get(`${process.env.APP_URL}/api/v1/gifs/likes/`, {headers: {"Authorization" : `JWT ${access}`}})
                            .then((result)=>setLikes(result.data));
                    });
                }
            });
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

    const removeFromGifs = useCallback((id)=>{
        const temp = gifs.slice();
        temp = temp.filter((gif)=>gif.id!=id);
        setGifs(temp);
    }, [gifs, setGifs]);

    const handleLike = useCallback((id) =>{
        if (login){
            console.log(id);
            axios.post(`${process.env.APP_URL}/api/v1/gifs/likes/`,
             {"id": id},
             {headers : {"Authorization" : `JWT ${access}`}})
            .then( response => handleLikeResponse(response, id))
            .catch( error =>{
                if(error.response.status === 401){
                    axios.post(`${process.env.APP_URL}/auth/jwt/refresh/`,
                     {refresh : refresh})
                    .then( result => {
                            dispatch(changeAccess(result.data.access));
                            axios.post(`${process.env.APP_URL}/api/v1/gifs/likes/`,
                             {"id": id},
                             {headers: {"Authorization" : `JWT ${access}`}})
                            .then( response => handleLikeResponse(response, id))
                            .catch( error => dispatch(addErrorAlert(error.response.data)) );
                    });
                }
                else
                    dispatch(addErrorAlert(error.response.data))
            });
        }
    }, [access, refresh, dispatch]);

    const handleLikeResponse = useCallback((response, id)=>{
        console.log(response.data['liked']);
        console.log("userLikes before", userLikes);
        if(response.data['liked'] === true){
            setLikes([...userLikes, id]);
        }
        else{
            const temp = userLikes.slice();
            temp.splice(temp.indexOf(id), 1);
            setLikes(temp);
        }
        console.log("userLikes after", userLikes);
    }, [userLikes, setLikes])

    const handleClickTag = useCallback((tag)=>{
        dispatch(removeFromActive(tag));
    }, []);

    const handleDelete = useCallback((id)=>{
        console.log(id);
        dispatch(isLoading());
        axios.delete(`${process.env.APP_URL}/api/v1/gifs/${id}/`,
                    {headers: {"Authorization" : `JWT ${access}`}})
                    .then((response)=>{
                        removeFromGifs(id);
                        dispatch(isNotLoading());
                        setDeleteConfirmation(false);
                        dispatch(addInfoAlert("Deleted the Gif Successfully"));
                    })
                    .catch( error => {
                        if (error.response.status === 401)
                            axios.post(`${process.env.APP_URL}/auth/jwt/refresh/`, {"refresh" : refresh})
                                    .then( response => {
                                        dispatch(changeAccess(response.data.access));
                                        axios.delete(`${process.env.APP_URL}/api/v1/gifs/${id}/`, {'id' : id},
                                                    {headers: {"Authorization" : `JWT ${access}`}})
                                                    .then( () => {
                                                        removeFromGifs(id);
                                                        dispatch(isNotLoading());
                                                        setDeleteConfirmation(false);
                                                        dispatch(addInfoAlert("Deleted the Gif Successfully"));
                                                    });
                                    });
                        else
                            dispatch(addErrorAlert(error.response.data))
                    });
    }, [access, refresh, dispatch]);

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
                            :   gifs.map(({name, file, id})=>(
                            <div>
                                <Col key={name} className="my-3" onClick={()=>{navigator.clipboard.writeText(file)}}
                                onMouseOver={()=>{}}>
                                    <Card className="px-2">
                                        <a name={name} onClick={()=>handleLike(id)} className="position-absolute w-25 h-25 pl-1 pt-1">
                                            <Heart color={userLikes.includes(id) ? "red" : "white"}></Heart>
                                        </a>
                                        <CardImg
                                        alt="Tough luck! Couldn't get the image"
                                        src={file}
                                        top/>
                                        <CardTitle>
                                           {name}
                                        </CardTitle>
                                        {activeTags.includes("My gifs") && <CardFooter>
                                            <Button color="danger" onClick={()=>setDeleteConfirmation(true)}>Delete</Button>
                                        </CardFooter>}
                                    </Card>
                                </Col>
                                <Modal
                                isOpen={deleteConfirmation}
                                toggle={()=>setDeleteConfirmation(!deleteConfirmation)}
                                backdrop={false}
                                size="sm"
                                centered>
                                    <ModalHeader tag="h4">
                                        Are you sure you want to delete this gif?
                                    </ModalHeader>
                                    <ModalBody>
                                        <div className="d-flex justify-content-between">
                                            <Button color="danger" onClick={()=>handleDelete(id)}>Delete</Button>
                                            <Button onClick={()=>setDeleteConfirmation(false)}>Cancel</Button>
                                        </div>
                                    </ModalBody>
                                 </Modal>
                            </div>
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
                <Col
                md={{size: 2}}>
                    {
                        alerts && alerts.map( alrt => (
                            <Alert
                            key={alrt.id}
                            color={alrt.color}
                            toggle={()=>dispatch(removeFromAlerts(alrt.id))}>
                                {alrt.message}
                            </Alert>
                        ))
                    }
                </Col>
            </div>
        </div>
    )
}