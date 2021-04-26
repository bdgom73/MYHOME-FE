import { useEffect, useState } from "react";
import { gethourMin, getYMD, timestampToDate } from "../../../js/weather_conversion";
import { WiSunrise } from 'react-icons/wi';
import { WiSunset } from 'react-icons/wi';
import { BsMoon } from 'react-icons/bs';
import { RiMoonFoggyFill } from 'react-icons/ri';
import "../../../css/part/weather/TotalWeatherSunsize.scss";
export default function TotalWeatherSunrise(props){

    const { data } = props;
   
    useEffect(()=>{
       
    },[])
    if(data){
        return(
            <>
            <span className="title">일출일몰</span>
            {
                data.map((d,i)=>{
                    return(
                        <div className="sun_wrap" key={d.dt+i}>
                            <h1>{getYMD(d.dt)}</h1>
                            <table className="sun_table">
                                <tr>
                                    <td>
                                        <WiSunrise size="50"/>
                                        <span>일출</span>
                                    </td>
                                    <td>
                                        <WiSunset size="50"/>
                                        <span>일몰</span>
                                    </td>
                                    <td>
                                        <BsMoon size="50"/>
                                        <span>월출</span>
                                    </td>
                                    <td>
                                        <RiMoonFoggyFill size="50"/>
                                        <span>월몰</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{gethourMin(d.sunrise)}</td>
                                    <td>{gethourMin(d.sunset)}</td>
                                    <td>{gethourMin(d.moonrise)}</td>
                                    <td>{gethourMin(d.moonset)}</td>
                                </tr>
                            </table>
                        </div>
                    );
                })
            }
           
            </>
        );
    }else{
        return <div className="error">데이터가 없습니다.</div>
    }
    
}