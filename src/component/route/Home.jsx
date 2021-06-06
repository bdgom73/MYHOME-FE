
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import useTitle from "../../customState/useTitle";
import Calendar from "../part/Calendar";
import { AiFillLike ,AiOutlineUser} from 'react-icons/ai';
import { GrFormView } from 'react-icons/gr';
import { FaRegCommentDots } from 'react-icons/fa';

import { Link, useHistory } from "react-router-dom";


require('dotenv').config();

export default function Home(props){   
    useTitle(`MYDOMUS | HOME`)

    const searchRef = useRef(0);
    const history = useHistory();
    const [sort,setSort] = useState("date");
    const [data, setData] = useState([]);
    const [plus,setPlus] = useState(false);
    const [current,setCurrent] = useState({});

    const onFocusHandler = (e)=>{
        searchRef.current = e.target
    }

   
    useEffect(()=>{
        axios({
            method : "get",      
            url : `/bbs/${sort}/top10`})
        .then(res=>{
            const d = res.data;
            console.log(d);
            setData(d || []);
        }).catch(e=>{
            console.log(e.response);
        })
    },[sort])



    return (
        <>
        <div className="home_wrap">
            <logo>
                <img src="/logo.png" alt="logo"/>
            </logo>
            <search>
                <div className="search">
                    <input type="text" name="search"  autocomplete="off" onFocus={onFocusHandler}/>
                    <input type="button" value="검색" onClick={()=>{console.log(searchRef.current.value)}}/>
                </div>
            </search>
            <div className="home_list">
                <top>
                    <tl onClick={()=>{setSort("date")}} className={sort === "date" ? "selected" : ""}>최신순</tl>
                    <tl onClick={()=>{setSort("recommend")}} className={sort === "recommend" ? "selected" : ""}>추천순</tl>
                    <tl onClick={()=>{setSort("views")}} className={sort === "views" ? "selected" : ""}>조회순</tl>
                </top>  
                <div className="list">
                {
                    data.map((d,i)=>{
                        return (
                        <>
                        <div key={d.id+"메인페이지"+d.updated+i} 
                        title={"조회수 : " + d.views + "  추천수 : " +d.recommend} className="list_body">
                            <span onClick={()=>{history.push(`/bbs/${d.categoryList}/${d.id}`)}}>{
                                d.categoryList === "PHOTO"  && d.imageList[0] ? 
                                <img src={d.imageList[0].image_url} alt={d.title}/> : 
                                d.categoryList === "VIDEO" && d.video_thumbnail ? 
                                <img src={d.video_thumbnail} alt={d.title}/> :
                                <img src={"/no_thumbnail.png"} alt={d.title}/>      
                            }</span>
                            <div className="list_context">    
                                <div className="category" onClick={()=>{history.push(`/bbs/${d.categoryList}`)}}>{d.categoryList}</div>               
                                <span className="list_title">
                                    <Link to={`/bbs/${d.categoryList.toLowerCase()}/${d.id}`}>{d.title}</Link>       
                                </span>
                                <span className="long_data">
                                    <span>{moment(d.created, "YYYYMMDD").fromNow()}</span> 
                                    <span className="name"><AiOutlineUser/>{d.nickname}</span>          
                                </span>
                                <div className="list_n">         
                                    <span><GrFormView/>{d.views}</span>
                                    <span><AiFillLike color="rgb(59, 89, 152)"/>{d.recommend}</span>
                                    <span><FaRegCommentDots color="rgb(59, 89, 152)"/>{d.commentDTOList.length}</span>
                                </div>   
                                
                            </div>     
                        </div>  
                        </>
                        )
                    })
                }             
                </div>  
            </div>      
        </div>
        
        </>
    );
}