import "../../../css/write/board.scss";
import { AiTwotoneLike } from 'react-icons/ai';
import { GrFormView } from 'react-icons/gr';

export default function BoardCard(props){

    const {        
        title,
        imageUrl,
        key,
        writer,
        recommend,
        views
     } = props;

    return(
        <>
        <div className="card_wrap" key={key}>
            <div className="card_preview">
                <img src={imageUrl} alt="" />
            </div>
            <div className="card_body">
                <div className="title" title={title}>{title}</div>
                <div className="writer" title={writer}>{writer}</div>
                <div className="info">
                    <span className="recommend" title={"추천수 : "+recommend}><AiTwotoneLike size="20" color="#3b5998"/> <span>{recommend}</span></span>
                    <span className="views" title={"조회수 : "+views}><GrFormView size="20"/> <span>{views}</span></span>
                </div>       
            </div>
        </div>  
        </>
    )
}