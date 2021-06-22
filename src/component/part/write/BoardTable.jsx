import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { FaVideo,FaChalkboard,FaComments } from 'react-icons/fa';
import useMember from "../../../customState/useMember";
import SubLoading from "../../sub_loading";
import { MdPhoto } from 'react-icons/md';
import Loading from "../Loading";
export default function BoardTable(props){

    const [col, setCol] = useState([]);
    const { 
        columnData ,
        data,
        columnDataKey,
        boardName,
        linkColumn,
        dateColumn,
        updatedColumn,
        writerColumn,
        videoColumn,
        autoSize,
        loading,
        colgroup,
        imageColumn,
        link,
        id,
        htmlToText,
        style
     } = props;
    
     
    const history = useHistory();
    useEffect(()=>{     
        const col = colgroup ? colgroup.split(" ") : []
        setCol(col || []);
    },[])

    const dataField = ()=>{
        const key= Object.keys(data[0]);
        return key;
    }
  
    const onClickHandler=(id,category)=>{
        if(!category) category = "free";
        if(link){
            history.push(`/bbs/${category}/${id}`);
        }else{
            history.push(`/bbs/${boardName ? boardName : "free"}/${id}`)
        }
       
    }
    return(
        <>
        <table className={autoSize ? "control" : "table"} style={style}>    
            <colgroup>
            {
                col.map((c,i)=>{
                    return <col width={c} key={i+c}/>    
                })
            }
            </colgroup>
            <thead>
                <tr>
                {   
                    columnData ? 
                    columnData.map((c,i)=>{
                        return <th key={c+i}>{c}</th>
                    }):<></>
                }
                </tr>
            </thead>
            <tbody>        
                {
                    loading ?  <tr><td colSpan={columnData ? columnData.length : 0}><SubLoading/></td></tr> : 
                    data.length !== 0 && data?
                    data.map((d,i)=>{
                        const unique = videoColumn && d[videoColumn]? d[videoColumn].split("https://youtu.be/")[1]: "";
                        const key = dataField();
                        var desc = htmlToText  ? d[htmlToText] : "";                
                        desc = desc.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");        
                        return (          
                            <tr key={i+"tables"+i} >                                     
                                {
                                columnDataKey ? columnDataKey.map((k,j)=>{  
                                    
                                    if(linkColumn){          
                                       
                                        return (
                                            <td key={k+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(id ? d[id] : d.id , link ? d.categoryList.toLowerCase() : "")}:()=>{}} 
                                            className={k===linkColumn? "link" : ""} style={k==="title" ? {width : "40%"} : {}}> 
                                                {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                k === "categoryList" && d[k] === "PHOTO" ? 
                                                <MdPhoto color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "FREE" ? 
                                                <FaChalkboard color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "VIDEO" ? 
                                                <FaVideo color="#fff" size="20"/> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon><a href={`/user/${d[k]}`}>{d[k]}</a></div> :
                                                writerColumn === k  ? <a href={`/user/${d[k]}`}>{d[k]}</a> :
                                                htmlToText === k ? desc :
                                                imageColumn === k ?  <img className="thumbnail" src={d.imageList[0] ? d.imageList[0].image_url : `/no_thumbnail.png`} alt="youtube_video"/> :
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }else{ 
                                        return (
                                            <td key={k+i+j} onClick={()=>{onClickHandler(id ? d[id] : d.id ,link ? d.categoryList.toLowerCase() : "")}} style={k==="title" ? {width : "40%"} : {}}>
                                                   {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                k === "categoryList" && d[k] === "PHOTO" ? 
                                                <MdPhoto color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "FREE" ? 
                                                <FaChalkboard color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "VIDEO" ? 
                                                <FaVideo color="#fff" size="20"/> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon><a href={`/user/${d[k]}`}>{d[k]}</a></div> :
                                                writerColumn === k  ? <a href={`/user=${d[k]}`}>{d[k]}</a> :
                                                htmlToText === k ? desc :
                                                imageColumn === k ?  <img className="thumbnail" src={d.imageList[0] ? d.imageList[0].image_url : `/no_thumbnail.png`} alt="youtube_video"/> :
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }
                                    
                                }) : key.map((k,j)=>{
                                    if(linkColumn){
                                        return (
                                            <td key={k+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(id ? d[id] : d.id ,link ? d.categoryList.toLowerCase() : "")}:()=>{}} style={k==="title" ? {width : "40%"} : {}}>
                                              {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                k === "categoryList" && d[k] === "PHOTO" ? 
                                                <MdPhoto color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "FREE" ? 
                                                <FaChalkboard color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "VIDEO" ? 
                                                <FaVideo color="#fff" size="20"/> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon><a href={`/user/${d[k]}`}>{d[k]}</a></div> :
                                                writerColumn === k  ? <a href={`/user/${d[k]}`}>{d[k]}</a> :
                                                htmlToText === k ? desc :
                                                imageColumn === k ?  <img className="thumbnail" src={d.imageList[0] ? d.imageList[0].image_url : `/no_thumbnail.png`} alt="youtube_video"/> :
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }else{
                                        return (
                                            <td key={k+i+j} onClick={()=>{onClickHandler(id ? d[id] : d.id ,link ? d.categoryList.toLowerCase() : "")}} style={k==="title" ? {width : "40%"} : {}}>
                                                {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                k === "categoryList" && d[k] === "PHOTO" ? 
                                                <MdPhoto color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "FREE" ? 
                                                <FaChalkboard color="#fff" size="20"/> :
                                                k === "categoryList" && d[k] === "VIDEO" ? 
                                                <FaVideo color="#fff" size="20"/> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon><a href={`/user/${d[k]}`}>{d[k]}</a></div> :
                                                writerColumn === k  ? <a href={`/user/${d[k]}`}>{d[k]}</a> :
                                                htmlToText === k ? desc :
                                                imageColumn === k ?  <img className="thumbnail" src={d.imageList[0] ? d.imageList[0].image_url : `/no_thumbnail.png`} alt="youtube_video"/> :
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }
                                })
                                }
                               
                            </tr>
                           
                        )
                    }) : <tr><td colSpan={columnData.length}>게시글이 없습니다 😂</td></tr>
                }
            </tbody>
        </table>
        </>
    )
}