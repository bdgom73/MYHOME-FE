
import GoogleMapReact from 'google-map-react';
import { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
const AnyReactComponent = ({ text }) => <div>{text}</div>;
// openweathermap의 API KEY 값
const API_KEY = process.env.REACT_APP_GOOGLE_KEY;
console.log(API_KEY);
export default function GoogleMap(props){

    const {width, height} = props;
    const [defaultValue,setDefaultValue] = useState(
        {
            center : {
                lat : 37.49889,
                lng : 126.783058
            },
            zoom : 11
        }
    );

    const [current,setCurrent] = useState({
        lat : 0,
        lng : 0
    })
    return(
        <div style={{ height: height ? height : '100vh', width: width ? width : '100%' }}>
          
            <GoogleMapReact
            bootstrapURLKeys={{ key: API_KEY}}          
            defaultCenter={defaultValue.center}
            defaultZoom={defaultValue.zoom}  
            onClick={(e)=>{
                setCurrent({
                    lat : e.lat,
                    lng : e.lng
                })
            }}   
            
            >
                <AnyReactComponent
                    lat={current.lat}
                    lng={current.lng}
                    text={<FiMapPin size="20" fill="red" stroke="#222222"/>}
                />
            </GoogleMapReact>
      </div>
    );

}