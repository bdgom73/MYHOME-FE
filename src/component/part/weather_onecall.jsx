import axios from "axios";
import { useEffect, useState } from "react";
import cityJson from "../../json/city_use.json";
import cityList from "../../storage/cityList";
import "../../css/part/weather_onecall.scss";
import { ResponsiveLine  } from '@nivo/line'
import Loading from "./Loading";
import { getWeatherIconUrl, hourFormat, timestampToDate, timestampToDate2, timestampToDate3, timestampToHour, timestampToMonth, timestampToMonthAndDate, timestampToMonthAndDateAndHour } from "../../js/weather_conversion";
import ChartMap from "./ChartMap";
import { AiOutlineReload } from 'react-icons/ai';

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

// ajax 현재 도시의 이름값으로 날씨 데이터 가져오기.
function getWeatherMap(layer_id , zoom ,cb, error){
    const layer = ["clouds_new","precipitation_new","pressure_new","wind_new","temp_new"];
    axios({
        responseType: 'blob' ,
        method:"get",
        url : `https://tile.openweathermap.org/map/${layer_id ? layer[layer_id] : layer[0]}/5/127/37.png?appid=${keya}`
    }).then((res)=>{
        if(cb) cb(res);
    }).catch((e)=>{
        if(error) error(e.response);
    })
}
// 요일 배열
const week = ["일","월","화","수","목","금","토"];

export default function WeatherOneCall(props){

    // 현재 width값
    const [currentWidth, setCurrentWidth] = useState(window.innerWidth); 
    // 현재 도시의 날씨
    const [current,setCurrent] = useState({});
    // 현재 도시의 일주일 날씨
    const [daily,setDaily] = useState([]);
    // 현재 도시의 시간당 날씨
    const [hourly,setHourly] = useState([]);
    // 일주일 날씨 차트.
    const [chart,setChart] = useState([]);
    // 현재 차트의 높이 사이즈.
    const [chartSize,setChartSize] = useState(200);
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

    // 일주일 날씨 차트 x 좌표 라벨 유무
    const [chartBottom,setChartBottom] = useState(true);
   
    //  width값 변환시 일주일 날씨 차트 x 좌표 라벨
    useEffect(()=>{
        window.addEventListener("resize",()=>{
            setCurrentWidth(window.innerWidth);
            
        })
        if(currentWidth < 500){
            setChartBottom(false);
        }else{
            setChartBottom(true);
        }
    },[currentWidth])

    // 현 페이지 시작내용
    useEffect(() => {
        onCityHandler();
        onChartSizeHandler();    
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

    // 차트의 높이 조절 ( 일주일 날씨 차트 )
    function onChartSizeHandler(){
        const cz = window.localStorage.getItem("chart-size");
        if(cz){
            setChartSize(cz);
        }else{
            setChartSize(200);
            window.localStorage.setItem("chart-size",chartSize);
        }
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
        const H = (_date.getHours()) < 10 ? "0"+_date.getHours() : _date.getHours();
        const m = (_date.getMinutes()) < 10 ? "0"+_date.getMinutes() : _date.getMinutes();
        const S = (_date.getSeconds()) < 10 ? "0"+_date.getSeconds() : _date.getSeconds();

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
           
        ])
    }

    // 시간당 날씨 데이터 주입
    function createDateHourly(values){
        const hourly_ = [];
        for(let i = 0; i < values.hourly.length ; i++){
            if(timestampToHour(values.hourly[i].dt) % 3 === 0 && hourly_.length < 5){      
                hourly_.push({
                    x : hourFormat(new Date(values.hourly[i].dt*1000)) === hourFormat(new Date()) ? (`${timestampToHour(new Date(values.hourly[i].dt))}시`) : (`${timestampToMonthAndDateAndHour(values.hourly[i].dt)}시`),
                    y : Math.round(values.hourly[i].temp),
                    id : values.hourly[i].dt,
                    icon : values.hourly[i].weather[0].icon
                });
               
            }
           
        }
        setHourlyChart([
            {
                id : "hourly",
                color: "hsl(168, 70%, 50%)",
                data : [...hourly_]
            }
        ]);
    }

    // 로컬스토리지에 일주일 날씨 차트 높이 설정.
    const onChartSizeChangeHandler = (e)=>{
        setChartSize(e.target.value);
        window.localStorage.setItem("chart-size",e.target.value);
    }

    // 도시 재선택
    const onCityChangeHandler = (e)=>{
        setCity(e.target.value);
        window.localStorage.setItem("city",e.target.value);
        getWeatherCityId(e.target.value,(res)=>{
            responseDataService(res);
         
        });
    }
    return(<>
        {loading ? <Loading/> : <></>}
        <div className="weather_main">
      
            {
                viewData.weather.length > 0  && viewData ?
                <>
                <div className="weather_current">   
                    <div className="weather_b1">
                        <div className="weather_sub_b1">
                        <div className="reload" onClick={()=>{
                              getWeatherCityId(onCityHandler(),(res)=>{
                                responseDataService(res);
                            })
                        }}><AiOutlineReload/></div>
                        <div className="weather_control">
                            <select onChange={onCityChangeHandler} value={city}>
                                {
                                cityList.map(c=>{
                                    return(
                                        <option value={c.id} key={c.id+"weather_onecall"}>{c.name}</option>
                                    );
                                })
                                }
                            </select>
                        </div>
                        <div className="weather_body">
                        
                            <div className="weather">                   
                                <div className="icon">
                                {viewData.weather[0].icon ? <><img src={getWeatherIconUrl(viewData.weather[0].icon)} alt={viewData.weather[0].icon}/></>:<></>} 
                                </div>
                                <div className="weather_info">
                                    <div className="weather_c1">
                                        {/* 현재 도시의 현재 날씨 */}
                                        <span className="temp">
                                            {
                                            viewData.temp['day'] ? (<>{Math.round(viewData.temp['day'])}<span>℃</span></>) : 
                                            viewData.temp ?  (<>{Math.round(viewData.temp)}<span>℃</span></>) : <></>
                                            
                                            }     
                                        </span>
                                        <span className="weather_status">
                                            {viewData.weather[0].description ? viewData.weather[0].description : ""}    
                                            <span>
                                            {viewData.rain ? (<>
                                            <span className="hour1">시간당</span>{viewData.rain['1h']} 
                                            <span className="unit">mm</span>
                                            </>) : ""}  
                                            {viewData.snow  ? (<>
                                            <span className="hour1">시간당</span>{viewData.snow} 
                                            <span className="unit">mm</span>
                                            </>) : ""}        
                                        </span>  
                                        </span>  
                                        
                                    </div> 
                                    <div className="weather_c2">
                                        <span className="updated">{viewData.dt ? timestampToDate(viewData.dt) : ""}</span>
                                        <span className="humidity">
                                            <span>습도 :</span> 
                                            {viewData.humidity}%
                                        </span> 
                                        <span className="speed">풍속 {viewData.wind_speed ? viewData.wind_speed+"m/s" : ""}</span>
                                        <span  className="humidity">자외선지수 {viewData.uvi}</span>
                                        <span  className="humidity">체감온도 
                                        { 
                                        typeof viewData.feels_like === "object" ? 
                                        (<>{Math.round(viewData.feels_like["day"])}<span>℃</span></>) : 
                                        !viewData.feels_like ?  <></> :
                                        (<>{Math.round(viewData.feels_like)}<span>℃</span></>)  }
                                        </span>
                                    </div>
                                </div>  
                            
                            </div>
                            <div className="weather_hourly">
                            <span className="time_weather">시간별 날씨</span>   
                            <div style={{height: `200px`,maxWidth:"600px"}} className="weather_hourly_main">
                                    {/* 시간별 날씨 데이터  */}  
                                    <div className="weather_icon">
                                    {
                                        hourlyChart[0].data.map((m,i)=>{
                                            return <img src={getWeatherIconUrl(m.icon)} alt="weatherState" key={m.icon+i} 
                                                style={{left : 21.5*(i) + "%"}}
                                            />
                                        })
                                    }
                                    </div>
                                    <ResponsiveLine
                                            data={hourlyChart}
                                            margin={{ top: 50, right: 50, bottom: 50, left: 20 }}
                                            xScale={{ type: 'point' }}
                                            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                                            yFormat=" >-.0f"    
                                            axisTop={null}
                                            axisRight={null}
                                            enableGridX={false}
                                            enableGridY={false}
                                            enablePointLabel={true}
                                            enableArea={true}
                                            curve="monotoneX"
                                            axisBottom={{
                                                orient: 'bottom',
                                                tickSize: 13,
                                                tickPadding: 20,
                                                tickRotation: 0,
                                            
                                                legendOffset: 36,
                                                legendPosition: 'middle'
                                            }}
                                            axisLeft={null}
                                            pointSize={7}
                                            pointColor={{ theme: 'grid.line.stroke' }}
                                            pointBorderWidth={2}
                                            pointBorderColor={{ from: 'serieColor' }}
                                            pointLabelYOffset={-12}
                                            useMesh={true}
                                            
                                /></div>
                               
                            </div>
                    <div className="weather_chart">
                    <span className="week_weather">주간 날씨</span>  
                    <form>
                        <input type="range" name="chart_size" min="200" max="600" defaultValue={chartSize} onChange={onChartSizeChangeHandler}/>
                    </form>
                    {
                        // 일주일 날씨 온도 차트
                        chart ? 
                        <div style={{height: `${chartSize}px`}}>
                        <ResponsiveLine
                                data={chart}
                                margin={chartBottom ? { top: 40, right: 30, bottom: 50, left: 20 } :{ top: 10, right: 10, bottom: 10, left: 10 }}
                                xScale={{ type: 'point' }}
                                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                                yFormat=" >-.2f"
                                axisTop={null}
                                axisRight={null}
                                enableGridX={false}
                                enableGridY={false}
                                curve="monotoneX"
                                axisBottom={chartBottom ? {
                                    orient: 'bottom',
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,      
                                    legendOffset: 36,
                                    legendPosition: 'middle'
                                }: null }
                                enableArea={true}
                                axisLeft={null}
                                enablePointLabel={true}
                                pointSize={7}
                                pointColor={{ theme: 'background' }}
                                pointBorderWidth={2}
                                pointBorderColor={{ from: 'serieColor' }}
                                pointLabelYOffset={-12}
                                useMesh={true}
                                onClick={(e)=>{
                                    for(let i = 0 ; i < daily.length ; i++){
                                        if(daily[i].dt === e.data.id){
                                            setViewData(daily[i]);
                                        }
                                    }
                                }}
            
                        /></div> : <></>
                    }
                    </div>
                   
                    </div>
                   
                </div>  
                    {/* 한국 주요도시 맵 표시 */}
                    <div className="korea_weather">
                        <ChartMap/>
                    </div>  
                </div>              
                <table className="time_table">
                        {/*  시간당 날씨 데이터 표 */}
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>날씨</th>
                                <th>온도</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                hourly.map((h,i)=>{
                                    return (   
                                        <tr key={h.dt+i}>
                                            <td>{timestampToMonthAndDateAndHour(h.dt)}시</td>
                                            <td><img src={getWeatherIconUrl(h.weather[0].icon)} alt="weather"/></td>
                                            <td>{Math.round(h.temp)}도</td>
                                        </tr>                     
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
               
                </> : <></>
            }
          
       </div>
    </>);
}

        