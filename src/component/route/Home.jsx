import { useEffect, useState } from "react";
import Weather from "../part/weather";
import "../../css/route/home.scss";
import Calendar from "../part/Calendar";
require('dotenv').config();

export default function Home(props){
    return (
        <>
        <div className="home_wrap">
            <div className="home_s1">
                <div className="home_calendar">
                    <Calendar readonly/>
                </div>
                <div className="home_weather" style={{width:"100%"}}>
                    <Weather mode="id" id={1838716}/>
                    <Weather mode="id" id={1835848}/>
                    <Weather mode="id" id={1833742}/>         
                </div>     
            </div>        
        </div>    

        </>
    );
}