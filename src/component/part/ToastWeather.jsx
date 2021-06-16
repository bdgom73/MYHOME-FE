import { useEffect, useState } from "react";
import axios from "axios";

import cityJson from "../../json/city_use.json";
import cityList from "../../storage/cityList";
import { getWeatherIconUrl, timestampToDate } from "../../js/weather_conversion";

import { AiFillCaretDown ,AiFillCaretUp} from "react-icons/ai";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

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
        if(error) error(e);
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

export default function ToastWeather(props){
    // 현재 도시의 현재 날씨 데이터
    const [weather, setWeather] = useState({});
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

    const [isSeleted, setIsSeleted] = useState(false);

    const [active,setActive] = useState(true);

    useEffect(()=>{
        saveWeatherInfo();
        setCurrent(cityList[0].id);
    },[]);

    // ajax 기본 respanse 세팅
    function saveInfo(res){
        const info = res.data; 
        setMain(info.main);
        // setWind(info.wind);
        // setClouds(info.clouds);
        setRain(info.rain ? info.rain['1h'] : "");
        setSnow(info.snow ? info.snow['1h'] : "");
        setWeather(info.weather[0] || {});
        setCityName(cityJson[info.id].name);
        setDt(timestampToDate(info.dt));   
    }

    // 날씨 모드에 따른 값 가져오는 방법 검사
    const saveWeatherInfo = ()=>{
        getWeatherCityId(1838716,(res)=>{       
            console.log(res)
            setMain(res.data.main);
            // setWind(info.wind);
            // setClouds(info.clouds);
            setRain(res.data.rain ? res.data.rain['1h'] : "");
            setSnow(res.data.snow ? res.data.snow['1h'] : "");
            setWeather(res.data.weather[0]);
            setCityName(cityJson[res.data.id].name);
        },(e)=>{console.log(e)});    
    }
    return (
        <>
        <div className="toast_weather_wrap" onMouseDown={(e)=>{console.log(e)}}  style={active ? {}: {right:"-250px"}}>    
            <div className="tt">
                {
                    active ?  
                    <BiRightArrow color="#eee" onClick={()=>setActive(false)}/> :  
                    <BiLeftArrow color="#eee" onClick={()=>setActive(true)}/>
                }
               
                
            </div>
            <div className="toast_weather">
                <ul>
                    <li>{cityName}</li>
                    <li>
                        {
                            weather.icon ? <img src={getWeatherIconUrl(weather.icon)} alt={weather.description}/> :<></>
                        }
                          
                    </li>
                    <li>{Number(main.temp).toFixed(0)}℃</li> 
                    {rain ? <li>({rain}mm)</li> : ""}
                    {snow ? <li>({snow}mm)</li> : ""}
                </ul>
            </div>
            <div className="weather_select">
            {
                isSeleted ? 
                <>
                <div onClick={()=>{setIsSeleted(false)}} ><AiFillCaretUp color={"#eee"} onClick={()=>{setIsSeleted(false)}}/></div>
                <select size="15" value={current} onChange={(e)=>{  
                    setCurrent(e.target.value);
                    getWeatherCityId(e.target.value,(res)=>{       
                        const info = res.data; 
                        console.log(info)
                        setMain(info.main);
                        // setWind(info.wind);
                        // setClouds(info.clouds);
                        setRain(info.rain ? info.rain['1h'] : "");
                        setSnow(info.snow ? info.snow['1h'] : "");
                        setWeather(info.weather[0]);
                        setCityName(cityJson[info.id].name);
                        setIsSeleted(false);     
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
                </select></>: <div onClick={()=>{setIsSeleted(true)}}><AiFillCaretDown color={"#eee"} onClick={()=>{setIsSeleted(true)}} /></div>
            }
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