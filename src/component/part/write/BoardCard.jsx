
import { AiTwotoneLike } from 'react-icons/ai';
import { GrFormView } from 'react-icons/gr';
import { useHistory } from "react-router";
import moment from "moment";
import { Link } from "react-router-dom";

export default function BoardCard(props){

    const {  
        id,      
        title,
        imageUrl,
        key,
        writer,
        recommend,
        views,
        rank,
        created,
        updated,
     } = props;

    const history = useHistory();
    return(
        <>
        <div className="card_wrap" key={key} >
            <div className="card_preview" >
                {
                    moment.duration(moment().diff(moment(created))).days() < 1 ?
                    <div className="video_new"><pcon><span>NEW</span></pcon></div> :<></>
                }
                <time>
                {
                    moment(created).format("YYYY-MM-DD HH:mm") === moment(updated).format("YYYY-MM-DD HH:mm") ?
                    moment(created).format("YYYY-MM-DD HH:mm") : <span><font >(수정됨)</font> {moment(updated).format("YYYY-MM-DD HH:mm")}</span>
                }
                </time>
               
                <img src={imageUrl ? imageUrl : "/no_thumbnail.png"} alt="" onClick={()=>{history.push(`/bbs/video/${id}`)}}/>
            </div>
            <div className="card_body">
                
                <div className="title" title={title}><Link to={`/bbs/video/${id}`}>{title}</Link></div>
                <div className="writer" title={writer}>
                    {
                        rank === "ADMIN" ? 
                        <pcon style={{backgroundColor:"#c4302b"}}>
                            <span >운영자</span>  
                        </pcon> :<></>
                    }
                    <a href={`/user/${writer}`} className="writer">{writer}</a>
                   
                </div>
                <div className="fromnow">{ moment(created, "YYYY-MM-DD HH:mm:ss").fromNow()}</div>
                <div className="info">
                    <span className="recommend" title={"추천수 : "+recommend}><AiTwotoneLike size="20" color="#3b5998"/> <span>{recommend}</span></span>
                    <span className="views" title={"조회수 : "+views}><GrFormView size="20"/> <span>{views}</span></span>
                </div>       
            </div>
        </div>  
        </>
    )
}