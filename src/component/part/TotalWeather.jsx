import axios from "axios";
import { useEffect, useState } from "react";
import cityJson from "../../json/city_use.json";
import cityList from "../../storage/cityList";
import "../../css/part/weather/TotalWeather.scss";
import { ResponsiveLine  } from '@nivo/line'
import Loading from "./Loading";
import TotalWeatherCard from "./weather/TotalWeatherCard";
import { getWeatherIconUrl, hourFormat, timestampToDate2, timestampToHour, timestampToMonthAndDate, timestampToMonthAndDateAndHour } from "../../js/weather_conversion";
import TotalWeatherGraph from "./weather/TotalWeatherGraph";
import ChartMap from "../part/ChartMap";
import { RiMapPinTimeLine } from 'react-icons/ri';
import TotalWeatherSunrise from "./weather/TotalWeatherSunrise";
// openweathermap의 API KEY 값
const keya = process.env.REACT_APP_WEATHER_ID;

// ajax 현재 도시의 아이디값으로 날씨데이터 가져오기.
function getWeatherCityId(cityid,cb,error){
    const lon = cityJson[cityid].coord.lon;
    const lat = cityJson[cityid].coord.lat;
    axios({      
        method:"get",
        url : `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${keya}&lang=kr&units=metric`
    }).then((res)=>{
        if(cb) cb(res);
    }).catch((e)=>{
        if(error) error(e.response);
    })
}
// 요일 배열
const week = ["일","월","화","수","목","금","토"];

function TotalWeather(props){

    // 현재 도시의 날씨
    const [current,setCurrent] = useState({});
    // 현재 도시의 일주일 날씨
    const [daily,setDaily] = useState([]);
    // 현재 도시의 시간당 날씨
    const [hourly,setHourly] = useState([]);
    // 일주일 날씨 차트.
    const [chart,setChart] = useState([]);
    // 현재 도시 ID
    const [city,setCity] = useState(1838716);
    // 현재 보여지는 날씨데이터값
    const [viewData,setViewData] = useState({temp:{},weather:[{}],day:{}});
    // 로딩바
    const [loading,setLoading] = useState(true);
    // 시간당 날씨 차트
    const [hourlyChart,setHourlyChart] = useState([
        {data:[]}
    ]);

    // 현 페이지 시작내용
    useEffect(() => {
        onCityHandler();
        setLoading(true);
        getWeatherCityId(onCityHandler(),(res)=>{
           responseDataService(res);
        })   
        
    }, [])

    // ajax데이터 공통 처리사항.
    function responseDataService(res){
        const datas = res.data;
        setCurrent(datas.current);  
        setDaily(datas.daily);
        setHourly(datas.hourly);     
        createDatas(datas);   
        setViewData(datas.current) ;
        setLoading(false);  
        createDateHourly(datas);     
    }

    // Local-Storage에서 저장된 도시 확인.
    function onCityHandler(){
        const ct = window.localStorage.getItem("city");
        if(ct){
            setCity(ct);
            return ct;
        }else{
            setCity(1838716);
            window.localStorage.setItem("city",1838716);
            return 1838716;
        }
    }

    // 년도, 월, 일 리턴 ex) 20210423
    function dateFormat(_date){
        const Y = _date.getFullYear();
        const M = (_date.getMonth()+1) < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1;
        const D = (_date.getDate()) < 10 ? "0"+_date.getDate() : _date.getDate();     
        return Y+M+D;
    }

    // 일주일 차트 데이터 주입
    function createDatas(values){
        let daily_ = [];
        for(let a =0; a < values.daily.length ; a++){
            daily_.push({
                x : dateFormat(new Date(values.daily[a].dt*1000)) === dateFormat(new Date()) ? `오늘 (${week[new Date(values.daily[a].dt*1000).getDay()]})` : timestampToDate2(values.daily[a].dt),
                y : Math.round(values.daily[a].temp["day"]),
                id : values.daily[a].dt
            });
        }
        setChart([
            {
                id : "daily",
                color: "hsl(168, 70%, 50%)",
                data : [...daily_]
            }
           
        ]);
        
    }

    // 시간당 날씨 데이터 주입
    function createDateHourly(values){
        const hourly_ = [];
        for(let i = 0; i < values.hourly.length ; i++){
            hourly_.push({
                x : hourFormat(new Date(values.hourly[i].dt*1000)) === hourFormat(new Date()) ? (`${timestampToHour(new Date(values.hourly[i].dt))}시`) : (`${timestampToMonthAndDateAndHour(values.hourly[i].dt)}시`),
                y : Math.round(values.hourly[i].temp),
                id : values.hourly[i].dt,
                icon : values.hourly[i].weather[0].icon
            });      
        }
        setHourlyChart([
            {
                id : "hourly",
                color: "hsl(168, 70%, 50%)",
                data : [...hourly_]
            }
        ]);
       
    }

    // 도시 재선택
    const onCityChangeHandler = (e)=>{
        setCity(e.target.value);
        window.localStorage.setItem("city",e.target.value);
        getWeatherCityId(e.target.value,(res)=>{
            responseDataService(res); 
        });
    }
    return(
    <>
        {loading ? <Loading/> : <></>}
        <div className="totalWeather_wrap">
            <div className="totalWeather">
                <div className="weather_control">
                    <select onChange={onCityChangeHandler} value={city}>
                        {
                        cityList.map(c=>{
                            return(
                                <option value={c.id} key={c.id+"weather"}>{c.name}</option>
                            );
                        })
                        }
                    </select>
                </div>
                
                <TotalWeatherCard data={viewData}/>  
                <div className="hourly_wrap">
                    <span className="title"><RiMapPinTimeLine/>시간별 온도</span>
                    <TotalWeatherGraph data={hourlyChart} width="3200"/>       
                </div>
                <div className="daily_wrap">
                    <span className="title"><RiMapPinTimeLine/>주간 온도</span>
                    <TotalWeatherGraph data={chart} size onClick={(e)=>{
                         for(let i = 0 ; i < daily.length ; i++){
                            if(daily[i].dt === e.data.id){
                                setViewData(daily[i]);
                            }
                        }
                    }}/>
                </div>
                <div className="total_weather_c1">
                <div className="totalWeather_c1" >
                    <div className="korea_weather" >
                        <ChartMap/>
                    </div>   
                </div>
                <div className="totalWeather_c1" style={{minHeight:"500px"}} >
                    <div className="sun_rise">
                        <TotalWeatherSunrise data={daily}/>
                    </div>
                </div>
            </div>
            </div>
          
          
                    
        </div>
    </>
    );
    
}

export default TotalWeather;