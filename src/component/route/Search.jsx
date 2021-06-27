import axios from "axios";
import qs from "query-string";
import { useEffect, useRef, useState } from "react";
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
    const [sort,setSort] = useState("include");
    const [subSort,setSubSort] = useState("date");
    const [searchTag,setSearchTag] = useState([]);
    const searchRef = useRef(0);
    const onSearchHandler = ()=>{
        const search_url = `/myApi/search?term=${term}&size=${50}&page=${0}&sort=${sort}&sub_sort=${subSort}`
        axios.get(search_url)
        .then(res=>{
            setData(res.data);
        }).catch(e=> console.log(e));
        tagSetting();
    }
    const onChangeHandler = (e)=>{
        setSearchText(e.target.value);
    }
    useEffect(()=>{
        if(term){
            onSearchHandler();   
        }
    },[value,sort,subSort,term])

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
    function compare(a, b) {
        if(term.toString().indexOf(" ") !== -1){
            let text = term.split(" ");
            for(let i = 0 ; i < text.length ; i++){
                if (a.indexOf(text[i]) !== -1 ) {
                    return -1;
                } else if(b.indexOf(text[i]) !== -1 ){
                    return 0;
                }
            }
           
        }  
        return 0;
    }

    function tagSetting(){
        if(term.indexOf(" ") !== -1){
            let tags = term.split(" ");
            setSearchTag([...tags]);
        }
    }

    if(term){
        return (
            <>  
            <div className="home_wrap">
                <div className="home_list">          
                    <div className="search_data">
                        통합검색어 | <span>{term}</span>
                        
                        {
                            searchTag.map((s,i)=>{
                                return (
                                    <span className="tag_p" key={s+i}>
                                        <a href={`?search=${s}`} >
                                            #{s}
                                        </a>
                                    </span>
                                )
                            })
                        }
                        
                    </div>
                    <top>
                    <tl onClick={()=>{setSort("include")}} className={sort === "include" ? "selected" : ""}>전체검색</tl>
                        <tl onClick={()=>{setSort("exact")}} className={sort === "exact" ? "selected" : ""}>완전일치</tl>
                        <tl onClick={()=>{setSort("start")}} className={sort === "start" ? "selected" : ""}>첫일치</tl>
                    </top> 
                    <top>
                    <tl onClick={()=>{setSubSort("date")}} className={subSort === "date" ? "selected" : ""}>최신순</tl>
                    <tl onClick={()=>{setSubSort("views")}} className={subSort === "views" ? "selected" : ""}>조회순</tl>
                </top>  
                    <div className="list">
                        <h2>자유게시판</h2>
                        {
                        data.filter(v=>v.categoryList ==="FREE").length === 0 ? <>데이터없음</> :
                        data.filter(v=>v.categoryList ==="FREE").sort((a,b)=> compare(a.title,b.title)).map((d,i)=>{
                            return boardList(d,i)        
                        })
                        }             
                    </div> 
                    <div className="list">
                        <h2>사진게시판</h2>
                        {
                        data.filter(v=>v.categoryList ==="PHOTO").length === 0 ? <>데이터없음</> :
                        data.filter(v=>v.categoryList ==="PHOTO").sort((a,b)=> compare(a.title,b.title)).map((d,i)=>{
                            return boardList(d,i)        
                        })
                        }             
                    </div>
                    <div className="list">
                        <h2>영상게시판</h2>
                        {
                        data.filter(v=>v.categoryList ==="VIDEO").length === 0 ? <>데이터없음</> :
                        data.filter(v=>v.categoryList ==="VIDEO").sort((a,b)=> compare(a.title,b.title)).map((d,i)=>{
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
                    <input type="text" name="search"  ref={s=> searchRef.current = s} autocomplete="off" placeholder="통합검색 내용" onChange={onChangeHandler}/>
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