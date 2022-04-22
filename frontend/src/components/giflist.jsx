import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAccess } from "../slices/tokenSlice";
import ReactLoading from "react-loading";
import { isLoading, isNotLoading } from "../slices/loadingSlice";
import { Alert, Button, Card, CardColumns, CardFooter, CardImg, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { ActiveTags } from "./activeTags";
import { removeFromActive } from "../slices/tagsSlice";
import { Heart } from "./heart";
import { addErrorAlert, addInfoAlert, removeFromAlerts } from "../slices/alertsSlice";
import { toggleUpdateForm } from "../slices/formsSlice";
import { UpdateForm } from "./updateForm";

export const GifList = () => {
    const [hasMore, setHasMore] = useState(true);
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [tagsParams, setTagsParams] = useState("")
    const [userLikes, setLikes] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [updateId, setUpdateId] = useState();
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
    
    const handleUpdateButton = useCallback( id =>{
        setUpdateId(id);
        dispatch(toggleUpdateForm());
    },[])

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
        console.log("cock");
        setOffset(0);
        setHasMore(true);
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
        else
            dispatch(addErrorAlert("You need to be logged in to be able to like gifs!"))
    }, [access, refresh, dispatch, login]);

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
            <div style={{overflowY: 'hidden', overflowX: 'hidden'}}>
                <Row className="pt-2">
                <Col
                    md={{size: 2}}
                    className="pr-2">
                       <ActiveTags limit={5} tags={activeTags} handleClick={handleClickTag}/>
                </Col>
                <Col
                    md={{size: 8}}>
                    <CardColumns>
                        { gifs[0]=="none" ? "Sorry, no gifs were found:(" 
                            :   gifs.map(({name, file, id})=>(
                                    <Card key={id}>
                                        <CardImg
                                        onClick={()=>{navigator.clipboard.writeText(file)}}
                                        alt="Tough luck! Couldn't get the image"
                                        src={file}
                                        top/>
                                        <div className="pl-1 container-fluid d-inline-flex justify-content-between">
                                            <div>
                                                {name}
                                            </div>
                                           <a name={name} onClick={()=>handleLike(id)} style={{maxHeight: "25px", maxWidth: "25px"}}>
                                            <Heart color={userLikes.includes(id) ? "red" : "white"}></Heart>
                                        </a>
                                        </div>
                                        {activeTags.includes("My gifs") && <CardFooter className="d-flex justify-content-between">
                                            <Button color="danger" className="py-0" onClick={()=>setDeleteConfirmation(true)}>Delete</Button>
                                            <Button color="info" className="py-0" onClick={()=>handleUpdateButton(id)} >Update</Button>
                                        </CardFooter>}
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
                                </Card>
                            ))}
                    </CardColumns>
                    <div className="container-fluid d-flex justify-content-center">
                            {loading && <ReactLoading type="bars" color="black" width="64px" height="64px"/> }
                            {!hasMore && "No more gifs to show :("}
                        </div>
                </Col>
                <Col
                md={2}>
                    {
                        alerts && alerts.map( alrt => (
                            <Alert
                            style={{zIndex : 100}}  
                            key={alrt.id}
                            color={alrt.color}
                            toggle={()=>dispatch(removeFromAlerts(alrt.id))}>
                                {alrt.message}
                            </Alert>
                        ))
                    }
                </Col>
                </Row>
            </div>
            <UpdateForm id={updateId}/>
        </div>
    )
}