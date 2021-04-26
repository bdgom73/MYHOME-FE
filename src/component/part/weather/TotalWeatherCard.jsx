import { useEffect } from "react";
import { useHistory } from "react-router";
import { getWeatherIconUrl, timestampToDate } from "../../../js/weather_conversion";
import TotalWeatherGraph from "./TotalWeatherGraph";

export default function TotalWeatherCard(props){

    const { data } = props;

    const history = useHistory();

    useEffect(()=>{
        console.log(data);
    },[])

    if(data && data.weather && data.temp){
        return(
            <div className="weather">                   
                <div className="icon">
                    {data.weather ? <><img src={getWeatherIconUrl(data.weather[0].icon)} alt={data.weather[0].icon}/></>:<></>} 
                </div>
                <div className="weather_info">
                    <div className="weather_c1">
                        {/* 현재 도시의 현재 날씨 */}
                        <span className="temp">
                            {
                            data.temp['day'] ? (<>{Math.round(data.temp['day'])}<span>℃</span></>) : 
                            data.temp ?  (<>{Math.round(data.temp)}<span>℃</span></>) : <></>                                            
                            }     
                        </span>
                        <span className="weather_status">
                            {data.weather[0].description ? data.weather[0].description : ""}    
                            <span>
                            {data.rain ? (<>
                            <span className="hour1">시간당</span>{data.rain['1h']} 
                            <span className="unit">mm</span>
                            </>) : ""}  
                            {data.snow  ? (<>
                            <span className="hour1">시간당</span>{data.snow} 
                            <span className="unit">mm</span>
                            </>) : ""}        
                        </span>  
                        </span>          
                    </div> 
                    <div className="weather_c2">
                        <span className="updated">
                            <span className="updated_head">업데이트 일 : </span>
                            {data.dt ? timestampToDate(data.dt) : ""}
                        </span>
                        <span className="weather_text">
                            <span>습도 : </span> 
                            {data.humidity}%
                        </span> 
                        <span className="weather_text">풍속 : {data.wind_speed ? data.wind_speed+"m/s" : ""}</span>
                        <span  className="weather_text">자외선지수 : {data.uvi}</span>
                        <span  className="weather_text">체감온도  
                        { 
                        typeof data.feels_like === "object" ? 
                        (<> {Math.round(data.feels_like["day"])}<span>℃</span></>) : 
                        !data.feels_like ?  <></> :
                        (<> {Math.round(data.feels_like)}<span>℃</span></>)  }
                        </span>
                    </div>      
                </div>          
            </div>
        )
    }else{
        return <div className="error">DATA가 없습니다.</div>
    }
    
}