import axios from "axios";
import { useEffect, useState } from "react";

// openweathermap의 API KEY 값
const W_API_KEY = process.env.REACT_APP_WEATHER_ID;


export default function useWeather(init){

    const [state,setState]=useState(init);
    const [weather,setWeather]=useState([]);

    useEffect(()=>{
        axios({
            method : "get",
            url : `http://api.openweathermap.org/data/2.5/weather?id=${state}&lang=kr&appid=${W_API_KEY}&units=metric`
        }).then((res)=>{
            setWeather(res.data);  
        })
        return;
    },[state]);


    return{
        weather, 
        cityId : state,
        setState
    }  
}