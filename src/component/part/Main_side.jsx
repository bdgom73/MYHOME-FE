import "../../css/part/Main_side.scss";
import { BsList } from 'react-icons/bs';
import { TiWeatherSunny } from 'react-icons/ti';
import { AiFillPicture } from 'react-icons/ai';
import { AiFillSchedule, AiFillNotification } from 'react-icons/ai';
import { FaVideo } from 'react-icons/fa';
import { BiMapPin,BiBookAlt } from 'react-icons/bi';
import { CgBoard } from 'react-icons/cg';

import { useHistory } from "react-router";

export default function Main_side(props){

    const history = useHistory();

    const routePush = (route)=>{
        props.subMenuHandler();
        history.push(route);
    }
    return(
        <>
        <div className="side_nav">
            <div className="sub_menu" >
                <BsList size={30}  onClick={props.subMenuHandler}/>
                <img src="/logo.png" alt="LOGO" onClick={()=>{routePush("/")}} style={{width:"80px"}}/>
            </div>
            <ul>
                <tl>
                    서비스
                </tl>
                <li onClick={()=>{routePush("/weather")}}> 
                    <TiWeatherSunny/> 날씨
                </li>       
                <li onClick={()=>{routePush("/schedule")}}>
                    <AiFillSchedule/>
                    일정
                </li>
                <li onClick={()=>{routePush("/map")}}>
                    <BiMapPin/>
                    지도
                </li>
            </ul>
            <ul>
                <tl>
                    게시판
                </tl>
                <li onClick={()=>{routePush("/bbs/video")}}>
                    <FaVideo/>
                    공유동영상
                </li>
                <li onClick={()=>{routePush("/bbs/free/page=1")}}>
                    <CgBoard/>
                    게시판
                </li>
                <li onClick={()=>{routePush("/bbs/photo/page=1")}}>
                    <AiFillPicture/>
                    사진첩
                </li>
            </ul>
            <ul>
                <tl>
                    공지
                </tl>
                <li onClick={()=>{routePush("/bbs/notice/page=1")}}>
                    <AiFillNotification/>
                    공지사항
                </li>
            </ul>
        </div>
        </>
    );
}