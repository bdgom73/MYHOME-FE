import "../../../css/write/board.scss";
import { AiTwotoneLike } from 'react-icons/ai';
import { GrFormView } from 'react-icons/gr';

export default function BoardCard(props){

    const {        
        data,
     } = props;

    return(
        <>
        {
        data.map((d,i)=>{
           return <div className="card_wrap" key={d.title+d.writer+i}>
                <div className="card_preview">
                    <img src={d.src} alt="" />
                </div>
                <div className="card_body">
                    <div className="title" title={d.title}>{d.title}</div>
                    <div className="writer">{d.writer}</div>
                    <div className="info">
                        <span className="recommend" title={"추천수 : "+d.recommend}><AiTwotoneLike size="20" color="#3b5998"/> <span>{d.recommend}</span></span>
                        <span className="views" title={"조회수 : "+d.views}><GrFormView size="20"/> <span>{d.views}</span></span>
                    </div>       
                </div>
            </div>
        })
        }  
        </>
    )
}