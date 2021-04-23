import "../../css/part/Main_side.scss";
import { BsList } from 'react-icons/bs';
import { TiWeatherSunny } from 'react-icons/ti';
import { GiDustCloud } from 'react-icons/gi';
import { AiFillSchedule } from 'react-icons/ai';
import { GrMap } from 'react-icons/gr';
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
                <li onClick={()=>{routePush("/dust")}}>
                    <GiDustCloud/> 미세먼지
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
                <li>테스트5</li>
                <li>테스트6</li>
                <li>테스트7</li>
                <li>테스트8</li>
            </ul>
        </div>
        </>
    );
}