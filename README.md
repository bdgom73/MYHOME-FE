# [MYHOME] PORTFOLIO 

## 진행사항
- [x] HOME
- [x] MEMBERSHIP SERVICE
- [x] WEATHER
- [x] SCHEDULE
- [x] MAP
- [x] LOGIN
- [x] REGISTER
- [x] SEARCH SERVICE
- [x] FREE BOARD
- [x] PHOTO BOARD
- [x] VIDEO BOARD
- [x] WRITE
- [x] NOTFOUND


## 날씨 openweathermap
- 날씨 데이터 가져오기
```c
function getWeatherForCityId(cityid,cb,error){
    const lon = cityJson[cityid].coord.lon;
    const lat = cityJson[cityid].coord.lat;
    axios({      
        method:"get",
        url : `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&lang=kr&units=metric`
    }).then((res)=>{
        if(cb) cb(res);
    }).catch((e)=>{
        if(error) error(e.response);
    })
}
```
- request 데이터 예시
```c
{
  "lat": 33.44,
  "lon": -94.04,
  "timezone": "America/Chicago",
  "timezone_offset": -21600,
  "current": {
    "dt": 1618317040,
    "sunrise": 1618282134,
    "sunset": 1618333901,
    "temp": 284.07,
    "feels_like": 282.84,
    "pressure": 1019,
    "humidity": 62,
    "dew_point": 277.08,
    "uvi": 0.89,
    "clouds": 0,
    "visibility": 10000,
    "wind_speed": 6,
    "wind_deg": 300,
    "weather": [
      {
        "id": 500,
        "main": "Rain",
        "description": "light rain",
        "icon": "10d"
      }
    ],
    "rain": {
      "1h": 0.21
    }
  },
    "minutely": [
    {
      "dt": 1618317060,
      "precipitation": 0.205
    },
    ...
  },
    "hourly": [
    {
      "dt": 1618315200,
      "temp": 282.58,
      "feels_like": 280.4,
      "pressure": 1019,
      "humidity": 68,
      "dew_point": 276.98,
      "uvi": 1.4,
      "clouds": 19,
      "visibility": 306,
      "wind_speed": 4.12,
      "wind_deg": 296,
      "wind_gust": 7.33,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "pop": 0
    },
    ...
  }
    "daily": [
    {
      "dt": 1618308000,
      "sunrise": 1618282134,
      "sunset": 1618333901,
      "moonrise": 1618284960,
      "moonset": 1618339740,
      "moon_phase": 0.04,
      "temp": {
        "day": 279.79,
        "min": 275.09,
        "max": 284.07,
        "night": 275.09,
        "eve": 279.21,
        "morn": 278.49
      },
      "feels_like": {
        "day": 277.59,
        "night": 276.27,
        "eve": 276.49,
        "morn": 276.27
      },
      "pressure": 1020,
      "humidity": 81,
      "dew_point": 276.77,
      "wind_speed": 3.06,
      "wind_deg": 294,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": 56,
      "pop": 0.2,
      "rain": 0.62,
      "uvi": 1.93
    },
    ...
    },
    "alerts": [
    {
      "sender_name": "NWS Tulsa",
      "event": "Heat Advisory",
      "start": 1597341600,
      "end": 1597366800,
      "description": "...HEAT ADVISORY REMAINS IN EFFECT FROM 1 PM THIS AFTERNOON TO\n8 PM CDT THIS EVENING...\n* WHAT...Heat index values of 105 to 109 degrees expected.\n* WHERE...Creek, Okfuskee, Okmulgee, McIntosh, Pittsburg,\nLatimer, Pushmataha, and Choctaw Counties.\n* WHEN...From 1 PM to 8 PM CDT Thursday.\n* IMPACTS...The combination of hot temperatures and high\nhumidity will combine to create a dangerous situation in which\nheat illnesses are possible.",
      "tags": [
        "Extreme temperature value"
        ]
    },
    ...
  ]
```
## 캘린더
- 이미지
![tts](https://user-images.githubusercontent.com/66341138/127461693-0a16634d-8c8f-4fd3-9428-6476fb823c98.JPG)

## 구글 map
- React에서 구글지도
```c
import GoogleMapReact from 'google-map-react';
const Marker = ({ children,key }) => <div className="marker" key={key}>{children}</div>;
<GoogleMapReact     
  bootstrapURLKeys={{
      key: API_KEY,
      libraries : 'places',
  }}          

  defaultCenter={defaultValue.center}
  defaultZoom={defaultValue.zoom}             
  yesIWantToUseGoogleMapApiInternals
  onGoogleApiLoaded={({map, maps})=>{
      handleApiLoaded(map,maps);  
  }}     
  zoom={zoom}
  options={
      {
          minZoom :9
      }
  }
  onChange={(e)=>{
      let bounds1 = {
          La : {
              g : e.bounds.ne.lng,
              i : e.bounds.sw.lng
          },
          Ua : {
              g : e.bounds.ne.lat,
              i : e.bounds.sw.lat
          }

      }
      setZoom(e.zoom);
      setBounds(bounds1);        
  }}
  >      
  <Marker
      lat={current.lat}
      lng={current.lng}
  >
      <FiMapPin size="40" fill="#9f02ff" stroke="#eee"/>    
  </Marker>    
 {Array.isArray(t) ?
  t.map((t,i)=>{
      return(
          <Marker key={i}
              lat={t.coord.Lat} lng ={t.coord.Lon}     
          >   
             <img src={`${getWeatherIconUrl(t.weather[0].icon)}`} alt="d" 
             onClick={()=>{
                  setModalIndex(t.id);
                  setModal(true);
                  setMode(1);
                  setCityname(t.name);
             }}/>                                     
          </Marker>
      );
  }) : <></>}
</GoogleMapReact>
```
