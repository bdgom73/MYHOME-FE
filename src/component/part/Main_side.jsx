import "../../css/part/Main_side.scss";
import { BsList } from 'react-icons/bs';
import { TiWeatherSunny } from 'react-icons/ti';
import { AiFillPicture } from 'react-icons/ai';
import { AiFillSchedule } from 'react-icons/ai';
import { FaVideo } from 'react-icons/fa';
import { GrMap } from 'react-icons/gr';
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
                <BsList size={30} color="#32435F" onClick={props.subMenuHandler}/>
                <img src="/image/logo.png" alt="LOGO" onClick={()=>{routePush("/")}}/>
            </div>
            <ul>
                <li onClick={()=>{routePush("/weather")}}> 
                    <TiWeatherSunny/> 날씨
                </li>       
                <li onClick={()=>{routePush("/schedule")}}>
                    <AiFillSchedule/>
                    일정
                </li>
                <li onClick={()=>{routePush("/map")}}>
                    <GrMap/>
                    지도
                </li>
            </ul>
            <ul>
                <li onClick={()=>{routePush("/bbs/video")}}>
                    <FaVideo/>
                    공유동영상
                </li>
                <li onClick={()=>{routePush("/bbs/free")}}>
                    <CgBoard/>
                    게시판
                </li>
                <li onClick={()=>{routePush("/bbs/photo")}}>
                    <AiFillPicture/>
                    사진첩
                </li>
            </ul>
        </div>
        </>
    );
}