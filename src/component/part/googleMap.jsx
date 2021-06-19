import GoogleMapReact from 'google-map-react';
import { useEffect, useRef, useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { GrMap } from 'react-icons/gr';
import cityJson from "../../json/city.json";

import axios from 'axios';
import { getWeatherIconUrl } from '../../js/weather_conversion';
import WeatherInfo from "./weather/WeatherInfo";
import Modal from '../modal/modal';

const Marker = ({ children,key }) => <div className="marker" key={key}>{children}</div>;

// google API KEY 값
const API_KEY = process.env.REACT_APP_GOOGLE_KEY;
// openweathermap의 API KEY 값
const W_API_KEY = process.env.REACT_APP_WEATHER_ID;


export default function GoogleMap(props){

    const searchRef = useRef();
    // 검색 DATA 저장
    const [searchData,setSearchData] = useState({});
    // 지도 ZOOM
    const [zoom,setZoom] = useState(11);
    // 범위 날씨 값
    const [t,setT] = useState([]);
    const [bounds,setBounds] = useState({});
    const {width, height} = props;
    const [searchBox, setSearchBox] = useState();
    const [defaultValue,setDefaultValue] = useState(
        {
            center : {
                lat : 37.49889,
                lng : 126.783058
            },
            zoom : 11
        }
    );
    // MAP DATA
    const [map, setMap] = useState(); 
    // MAP API DATA
    const [googlemaps,setGooglempas] = useState(null);
    // MAP SUB MENU ACTIVE
    const [subMenuActive, setSubMenuActive] = useState(true);
    const [current,setCurrent] = useState({
        lat : 0,
        lng : 0
    })
    // modal open
    const [modal,setModal] = useState(false);
    const [mode,setMode] = useState();
    const [modalIndex,setModalIndex]=useState();
    const [cityname,setCityname] = useState();
    // ajax 현재 도시의 아이디값으로 날씨데이터 가져오기.
    function getWeatherBbox(bound,cb){
        bound = bound ? bound : bounds;       
        axios({
            method:"get",
            url : `http://api.openweathermap.org/data/2.5/box/city?bbox=${bound.La.g},${bound.Ua.g},${bound.La.i},${bounds.Ua.i},${zoom}&appid=${W_API_KEY}`
        }).then((res)=>{
            if(cb) cb(res);
        }).catch((e)=>{  
            alert(e.response.data.message)
        })
    }
    // MAP API LOAD
    const handleApiLoaded = (map,maps)=>{
        if(map && maps){
            setBounds(map.getBounds())
            setZoom(map.zoom);
            setMap(map);
            setGooglempas(maps);
            setSearchBox(new maps.places.SearchBox(searchRef.current));  
            const bounds = map.getBounds();
            // let gbounds = {
            //     La : {
            //         g : bounds.Eb.g,
            //         i : bounds.Eb.i
            //     },
            //     Ua : {
            //         g : bounds.oc.g,
            //         i : bounds.oc.i
            //     }
            // }     
        }
    }

    // MAP PLACE SEARCH (CHANGE)
    const onPlaceChange = ()=>{
        const selected = searchBox.getPlaces();
        const { 0 : place} = selected;
        setSearchData(place);
        if(!place.geometry){ return; }

        if(!place.geometry.viewport){
            map.fitBounds(place.geometry.viewport);
        }else{
            map.setCenter(place.geometry.location);
            setCurrent({
                lat : place.geometry.location.lat(),
                lng : place.geometry.location.lng()
            })
            map.setZoom(17);
        }
    }

    /* GOOGLE MAP EVENT 
    ** EVENT => "places_changed"    
    */
    useEffect(()=>{
        if(searchBox){
            searchBox.addListener("places_changed",onPlaceChange);
            searchBox.bindTo("bounds",map);
        }
       
    },[searchBox])

    useEffect(()=>{
        if(bounds.La && bounds.Ua){
            getWeatherBbox("",(res)=>{  
                setT(res.data.list || []);        
            })
        }  
    },[bounds])
    // 이벤트 모달창 종료
    const onCloseHandler = ()=>{
        setModal(false);
        const body = document.body;
        body.style.overflow ="auto";
    }

    function openModal() {
        if(mode === 1 && modal){
            return <Modal title={cityname} close={onCloseHandler}><WeatherInfo ok cityId={modalIndex}/></Modal>
        }    
    }
    return(
        <>  
        {openModal()}
        <div className="google_map_wrap">
            {
                subMenuActive ? (
                    <div className="google_map_menu">
                        <input type="text" ref={(ref)=>{searchRef.current = ref}} id="map_search" title={searchRef.current ? searchRef.current.value : ""}/>
                     
                    </div>
                ) : <></>
            }  
            <div className="map" style={{ height: height ? height : '', width: width ? width : '' }}>
                 
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
                     {
                        
                        Array.isArray(t) ?
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
                        }) 
                        : <></>
                        
                    }
                    </GoogleMapReact>
            </div>
        </div>
       </>
    );

}

