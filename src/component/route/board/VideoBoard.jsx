import { useEffect, useState } from "react";
import Board from "../../part/write/Board";
import "../../../css/write/board.scss";
import BoardCard from "../../part/write/BoardCard";
import axios from "axios";
import { useHistory, useLocation } from "react-router";
import "../../../css/pagination.scss";
import SubLoading from "../../sub_loading";
import useTitle from "../../../customState/useTitle";
export default function VideoBoard(){

    useTitle(`MYDOMUS | VIDEO`);

    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(0);
    const [totalPage,setTotalPage]=useState(0);
    const [stop,setStop] = useState(false);

    /*
        TYPE이 테이블 일때 무한 스크롤
    */ 
    const infiniteScroll = ()=>{
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        const clientHeight = document.documentElement.clientHeight; 
        if((scrollTop + clientHeight+500) >= scrollHeight){  
            if(page === (totalPage)){
                setStop(true);   
            }else {       
                setPage(page+1);   
                setStop(false);  
                
            }
        }
        
    }
    useEffect(()=>{      
        window.addEventListener("scroll",infiniteScroll);  
        return ()=>{
            window.removeEventListener("scroll",infiniteScroll)
        }
       
    })
    
    //  TYPE이 테이블 일때 무한 스크롤
    useEffect(()=>{
       if(!stop) _getUrl();     
    },[page])

    // 총 size 가져오기
    useEffect(()=>{   
        axios.get(`/bbs/video/size`)
        .then(res=>{
            setTotalPage(Math.ceil(res.data / 40))
        })
       
    },[]);



   // data가져오기
    const _getUrl = ()=>{   
        setLoading(true)    
        let url =  `/bbs/video/get?size=${40}&page=${page}`;
        axios.get(url)
        .then(res=>{
            for(let i = 0 ; i < res.data.length ; i++ ){
                data.push(res.data[i]);
            }
            setData(data);  
            setLoading(false)          
        }).catch(e=> console.log(e.response))
    }
    
   
 
    return(
        <Board style={{maxWidth:"1100px",margin:"15px auto"}}>
        <h1>영상게시판</h1>     
        <div className="card_board_wrap">
        {
            data.map((m,i)=>{
                const unique = m.video_url ? m["video_url"].split("https://youtu.be/")[1]: "";
                return <BoardCard 
                    id={m.id}
                    title={m.title}
                    key = {m.title+i}
                    writer = {m.nickname}
                    recommend = {m.recommend}
                    views = {m.views}
                    imageUrl={m.videoType ==="YOUTUBE" ? `https://i1.ytimg.com/vi/${unique}/0.jpg` : "/no_thumbnail.png"}
                    rank = {m.rank}
                    created = {m.created}
                    updated = {m.updated}
                    />
            })
        }
        </div>
        {loading ? <SubLoading/> : <></> }
        </Board>
    )
}

