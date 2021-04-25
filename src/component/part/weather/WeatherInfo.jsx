import axios from "axios";
import { useEffect, useState } from "react";
import { getWeatherIconUrl, timestampToDate } from "../../../js/weather_conversion";

// openweathermap의 API KEY 값
const W_API_KEY = process.env.REACT_APP_WEATHER_ID;

export default function WeatherInfo(props){

    const [weather,setWeather] = useState({
        weather : [{icon:"",description:""}]
    });

    // ajax 현재 도시의 아이디값으로 날씨데이터 가져오기.
    function getWeatherCityId(city_id,cb,error){
        axios({
            method:"get",
            url : `http://api.openweathermap.org/data/2.5/weather?id=${city_id}&lang=kr&appid=${W_API_KEY}&units=metric`
        }).then((res)=>{
            if(cb) cb(res);
        }).catch((e)=>{
            if(error) error(e.response);
        })
    }
    useEffect(()=>{
        if(props.cityId){
            getWeatherCityId(props.cityId,(res)=>{
                setWeather(res.data);
            })
        }  
    },[])
    return(
        <div className="weather">                   
            <div className="icon">
                {Array.isArray(weather.weather) ? <><img src={getWeatherIconUrl(weather.weather[0].icon)} alt={weather.weather[0].icon}/></>:<></>} 
            </div>
            <div className="weather_info">
                <div className="weather_c1">
                    <span className="temp">
                        { weather.main ?  (<>{Math.round(weather.main.temp)}<span>℃</span></>) : <></> }     
                    </span>
                    <span className="weather_status">
                        {Array.isArray(weather.weather) ? weather.weather[0].description : ""} 
                        <span>
                        {weather.rain ? (<>
                            <span className="hour1">시간당</span>{weather.rain['1h']} 
                            <span className="unit">mm</span>
                        </>) : ""}  
                        {weather.snow  ? (<>
                            <span className="hour1">시간당</span>{weather.snow} 
                            <span className="unit">mm</span>
                        </>) : ""}        
                    </span>  
                    </span>  
                    
                </div> 
            <div className="weather_c2">
                <span className="updated">{weather.dt ? timestampToDate(weather.dt) : ""}</span>
                <span className="humidity">
                    <span>습도 :</span> 
                    {weather.humidity}%
                </span> 
                <span className="speed">풍속 {weather.wind_speed ? weather.wind_speed+"m/s" : ""}</span>
                <span  className="humidity">자외선지수 {weather.uvi}</span>
                <span  className="humidity">체감온도 
                {      
                    !weather.main ?  <></> :
                        (<>{Math.round(weather.main['feels_like'])}<span>℃</span></>)  
                }
                </span>
            </div>
        </div>   
    </div>
    )
}