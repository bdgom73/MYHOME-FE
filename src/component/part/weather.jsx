import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/part/weather.scss";
import cityJson from "../../json/city_use.json";
import cityList from "../../storage/cityList";
import { getWeatherIconUrl, KtoC, timestampToDate } from "../../js/weather_conversion";

// openweathermap의 API KEY 값
const API_KEY = process.env.REACT_APP_WEATHER_ID;

// ajax 현재 도시의 이름값으로 날씨데이터 가져오기.
function getWeatherCityName(city,cb,error){
    axios({
        method:"get",
        url : `http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=kr&units=metric&appid=${API_KEY}`
    }).then((res)=>{
        if(cb) cb(res);
    }).catch((e)=>{
        if(error) error(e.response);
    })
}
// ajax 현재 도시의 아이디값으로 날씨데이터 가져오기.
function getWeatherCityId(city_id,cb,error){
    axios({
        method:"get",
        url : `http://api.openweathermap.org/data/2.5/weather?id=${city_id}&lang=kr&units=metric&appid=${API_KEY}`
    }).then((res)=>{
        if(cb) cb(res);
    }).catch((e)=>{
        if(error) error(e.response);
    })
}

export default function Weather(props){
    // 현재 도시의 현재 날씨 데이터
    const [weather, setWeather] = useState([]);
    // 현재 도시의 현재 메인데이터
    const [main, setMain] = useState({});
    // 현재 도시의 바람 데이터
    const [wind, setWind] = useState({});
    // 현재 도시의 구름 데이터
    const [clouds, setClouds] = useState({});
    // 현재 도시의 비 데이터
    const [rain, setRain] = useState();
    // 현재 도시의 눈 데이터
    const [snow, setSnow] = useState();
    // 현재 도시 이름
    const [cityName, setCityName]=useState();
    // 최근 업데이트 된 시간
    const [dt, setDt]=useState();
    // 현재 도시의 아이디값
    const [current,setCurrent] = useState();
    useEffect(()=>{
        saveWeatherInfo();
        setCurrent(props.id)
    },[]);

    // ajax 기본 respanse 세팅
    function saveInfo(res){
        const info = res.data; 
        console.log(info);
        setMain(info.main);
        setWind(info.wind);
        setClouds(info.clouds);
        setRain(info.rain);
        setSnow(info.snow);
        setWeather(info.weather);
        setCityName(cityJson[info.id].name);
        setDt(timestampToDate(info.dt));   
    }

    // 날씨 모드에 따른 값 가져오는 방법 검사
    const saveWeatherInfo = ()=>{
        if(props.mode === "id"){
            getWeatherCityId(props.id ? props.id : 1838716,(res)=>{
                saveInfo(res);
           });
        }else{
            getWeatherCityName(props.city ? props.city : "bucheon",(res)=>{
                saveInfo(res);
           });
        }
        
    }
    return (
        <>
        <div className="weather_card">
            
            <div className="weather_select">
            {
                     props.mode === "id" ? 
                        <select value={current} onChange={(e)=>{  
                            setCurrent(e.target.value);
                            getWeatherCityId(e.target.value,(res)=>{       
                                saveInfo(res);      
                            });   
                            }   
                        }>
                        {
                            cityList.map((m,i)=>{
                                return (
                                    <option value={m.id} key={m.id+m.name+Math.random().toString(36).substr(2, 9)}>{m.name}</option>
                                )
                            }) 
                        }
                    </select>: <div className="weather_select">{cityName}</div>
                }
            </div>
            <div className="weather_card_body">
                {
                weather ? (
                    weather.map((w,i)=>{      
                        return(     
                            <div key={w+i+Math.random().toString(36).substr(2, 9)} className="weather">                   
                                <div className="icon">
                                    <img src={getWeatherIconUrl(w.icon)} alt={w.icon}/>
                                </div>
                                <div className="weather_info">
                                    <div className="weather_c1">
                                        <span className="temp">
                                            {Math.round(main.temp)}
                                            <span>℃</span>
                                        </span>
                                        <span className="weather_status">
                                            {w.description}
                                            <span>
                                                {rain ? "시간당" + rain['1h']+"mm": ""}  
                                                {snow ?  "시간당" + snow['1h']+"mm" : ""}        
                                            </span>
                                        </span>  
                                    </div> 
                                    <div className="weather_c2">
                                        <span className="updated">{dt}</span>
                                        <span className="humidity">
                                            <span>습도 :</span> 
                                            {main.humidity}%
                                        </span> 
                                        <span className="speed">풍속 {wind.speed}m/s</span>
                                        <span className="humidity">체감온도 {Math.round(main.feels_like)}℃</span>
                                        <span className="humidity">최고기온 : {main.temp_max}℃</span>
                                        <span className="humidity">최저기온 : {main.temp_min}℃</span>
                                    </div>              
                                </div>  
                            </div>
                           
                        )
                    })
                ) : <> <div className="weather">로딩중</div></>
                }
                <div>
                
                </div>
            </div>
        </div>
        </>
    );
}


/***** 
 * *
    *coord
        coord.lon 도시 지리적 위치, 경도
        coord.lat 도시 지리적 위치, 위도
    *weather (추가 정보 기상 조건 코드)
        weather.id 날씨 상태 ID
        weather.main 날씨 매개 변수 그룹 (비, 눈, 극한 등)
        weather.description그룹 내 기상 조건. 귀하의 언어로 출력을 얻을 수 있습니다. 더 알아보기
        weather.icon 날씨 아이콘 ID
    *base 내부 매개 변수
    *main
        main.temp온도. 단위 기본값 : 켈빈, 미터법 : 섭씨, 영국식 : 화씨.
        main.feels_like온도. 이 온도 매개 변수는 날씨에 대한 인간의 인식을 설명합니다. 단위 기본값 : 켈빈, 미터법 : 섭씨, 영국식 : 화씨.
        main.pressure 대기압 (해수면 또는 grnd_level 데이터가없는 경우 해수면 기준), hPa
        main.humidity 습도, %
        main.temp_min현재 최저 온도. 이것은 현재 관측 된 최소 온도입니다 (대형 거대 도시 및 도시 지역 내). 단위 기본값 : 켈빈, 미터법 : 섭씨, 영국식 : 화씨.
        main.temp_max현재 최대 온도. 이것은 현재 관측 된 최대 온도입니다 (대형 거대 도시 및 도시 지역 내). 단위 기본값 : 켈빈, 미터법 : 섭씨, 영국식 : 화씨.
        main.sea_level 해수면의 기압, 고전력 증폭기
        main.grnd_level 지면의 기압, 고전력 증폭기
    *wind
        wind.speed풍속. 단위 기본값 : 미터 / 초, 미터법 : 미터 / 초, 영국식 : 마일 / 시간.
        wind.deg 풍향,도 (기상)
        wind.gust바람 돌풍. 단위 기본값 : 미터 / 초, 미터법 : 미터 / 초, 영국식 : 마일 / 시간
    *clouds
        clouds.all 흐림, %
    *rain
        rain.1h 지난 1 시간 동안의 강우량, mm
        rain.3h 지난 3 시간 동안의 강우량, mm
    *snow
        snow.1h 지난 1 시간 동안의 눈량, mm
        snow.3h 지난 3 시간 동안의 눈량, mm
    *dt 데이터 계산 시간, 유닉스, UTC
    *sys
        sys.type 내부 매개 변수
        sys.id 내부 매개 변수
        sys.message 내부 매개 변수
        sys.country 국가 코드 (GB, JP 등)
        sys.sunrise 일출 시간, Unix, UTC
        sys.sunset 일몰 시간, Unix, UTC
    *timezone UTC에서 초 단위로 이동
    *id 도시 ID
    *name 도시 이름
    *cod 내부 매개 변수
 * ********/