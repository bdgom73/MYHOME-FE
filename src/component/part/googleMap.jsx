import GoogleMapReact from 'google-map-react';
import { useEffect, useRef, useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { GrMap } from 'react-icons/gr';
import "../../css/part/googleMap.scss";

const Marker = ({ children }) => <div className="marker">{children}</div>;

// openweathermap의 API KEY 값
const API_KEY = process.env.REACT_APP_GOOGLE_KEY;

export default function GoogleMap(props){

    const searchRef = useRef();
    // 검색 DATA 저장
    const [searchData,setSearchData] = useState({});
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

    // MAP API LOAD
    const handleApiLoaded = (map,maps)=>{
        if(map && maps){
            setMap(map);
            setGooglempas(maps);
            setSearchBox(new maps.places.SearchBox(searchRef.current));     
        }
    }

    // MAP PLACE SEARCH (CHANGE)
    const onPlaceChange = ()=>{
        const selected = searchBox.getPlaces();
        const { 0 : place} = selected;
        console.log(place)
        setSearchData(place);

        if(!place.geometry){
           return;
        }

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



    return(
        <>  
        <div className="google_map_wrap">
            {
                subMenuActive ? (
                    <div className="google_map_menu">
                        <span className="title"><GrMap/>지도</span>
                        <input type="text" ref={(ref)=>{searchRef.current = ref}} id="map_search" title={searchRef.current ? searchRef.current.value : ""}/>
                        
                    </div>
                ) : <></>
            }  
            <div class="map" style={{ height: height ? height : '', width: width ? width : '' }}>

                    <GoogleMapReact     
                    bootstrapURLKeys={{
                        key: API_KEY,
                        libraries : 'places'
                    }}          
                    defaultCenter={defaultValue.center}
                    defaultZoom={defaultValue.zoom}             
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({map, maps})=>{
                        handleApiLoaded(map,maps);  
                    }}
                    >
                        
                    <Marker
                        lat={current.lat}
                        lng={current.lng}
                    >
                        <FiMapPin size="30" fill="#9f02ff" stroke="#eee"/>    
                    </Marker>
                    
                    </GoogleMapReact>
            </div>
        </div>
       </>
    );

}

