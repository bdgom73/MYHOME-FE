import axios from "axios";
import qs from "query-string";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import Highlighter from "react-highlight-words";
import { AiFillLike ,AiOutlineUser} from 'react-icons/ai';
import { GrFormView } from 'react-icons/gr';
import { FaRegCommentDots } from 'react-icons/fa';
import { Link } from "react-router-dom";
import moment from "moment";

const Highlight = ({ text }) => {
    const {search} = useLocation();
    const term = qs.parse(search).search ;
    return(
        <Highlighter 
        searchWords={[term]}  
        autoEscape={true} 
        highlightClassName="highlight"
        textToHighlight={text}
     />  
    )
   
};
export default function Search(props){

    const {search} = useLocation();
    const term = qs.parse(search).search ;
    const history = useHistory();
    const [value,setValue] = useState(term);
    const [searchText, setSearchText] = useState("");
    const [data , setData] = useState([]);
    const [sort,setSort] = useState("date");
    const onSearchHandler = ()=>{
        const search_url = `/search?term=${term}&size=${50}&page=${0}`
        axios.get(search_url)
        .then(res=>{
            setData(res.data);
            console.log(res)
        }).catch(e=> console.log(e))
    }
    const onChangeHandler = (e)=>{
        setSearchText(e.target.value);
    }
    useEffect(()=>{
        if(term){
            onSearchHandler();
        }
    },[value])

    function boardList(d,i){
        let text = d.description;
        text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
        return(
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
                        <Link to={`/bbs/${d.categoryList.toLowerCase()}/${d.id}`}><Highlight text={d.title}/></Link>       
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
                    <div className="list_desc"> 
                    <Highlight text={text}/>
                    </div>     
                </div>    
            </div>  
              
           
        )
    }
    if(term){
        return (
            <>  
            <div className="home_wrap">
                <div className="search_data">
                    통합검색어 : {term}
                </div>
                <div className="home_list">
                    {/* <top>
                        <tl onClick={()=>{setSort("date")}} className={sort === "date" ? "selected" : ""}>최신순</tl>
                        <tl onClick={()=>{setSort("recommend")}} className={sort === "recommend" ? "selected" : ""}>추천순</tl>
                        <tl onClick={()=>{setSort("views")}} className={sort === "views" ? "selected" : ""}>조회순</tl>
                    </top>   */}
                    <div className="list">
                        <h2>자유게시판</h2>
                        {
                        data.filter(v=>v.categoryList ==="FREE").length === 0 ? <>데이터없음</> :
                        data.filter(v=>v.categoryList ==="FREE").map((d,i)=>{
                            return boardList(d,i)        
                        })
                        }             
                    </div> 
                    <div className="list">
                        <h2>사진게시판</h2>
                        {
                        data.filter(v=>v.categoryList ==="PHOTO").length === 0 ? <>데이터없음</> :
                        data.filter(v=>v.categoryList ==="PHOTO").map((d,i)=>{
                            return boardList(d,i)        
                        })
                        }             
                    </div>
                    <div className="list">
                        <h2>영상게시판</h2>
                        {
                        data.filter(v=>v.categoryList ==="VIDEO").length === 0 ? <>데이터없음</> :
                        data.filter(v=>v.categoryList ==="VIDEO").map((d,i)=>{
                            return boardList(d,i)        
                        })
                        }             
                    </div> 
                </div>   
            </div>  
            </>
        )
    }else{
       return(
        <div className="home_wrap">  
        <logo>
            <img src="/image/search_logo.png" alt="search_logo"/>
        </logo>
        <div className="search_main" style={{marginTop:"50px"}}>
            <h2>통합검색 기능입니다.</h2>
            <search style={{marginTop:"0px"}}>      
                <div className="search" >
                    <input type="text" name="search"  autocomplete="off" placeholder="통합검색 내용" onChange={onChangeHandler}/>
                    <input type="button" value="검색" onClick={(e)=>{setValue(searchText) ;history.push(`/search?search=${searchText}`)}}/>
                </div>
            </search>  
            <ul>
               <li>사진, 자유, 영상 게시판 통합 검색 시스템입니다.</li>
               <li>검색어는 2글자 이상 입력해야 더 정확한 결과를 얻을 수 있습니다.</li>
               <li>검색 시 제목 + 본문 내용 결과가 출력됩니다.</li>
            </ul>
        </div>   
        </div>
       ) 
    }
   
}