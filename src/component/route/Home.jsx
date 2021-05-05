import { useEffect, useState } from "react";
import Weather from "../part/weather";
import "../../css/route/home.scss";
import Calendar from "../part/Calendar";
import WeatherInfo from "../part/weather/WeatherInfo";
import GoogleMap from "../part/googleMap";
import ChartMap from "../part/ChartMap";
import BoardTable from "../part/write/BoardTable";
require('dotenv').config();

export default function Home(props){
 
    return (
        <>
        <div className="home_wrap">
            <div className="home_s1">
                <div className="home_calendar" >
                    <Calendar readonly/>
                    <BoardTable columnData={["No","제목","작성자","조회수"]} linkColumn="title" data={[
                        {
                            id:"1",
                            title : "공지사항입니다.",
                            writer : "어드민",
                            views : "50"
                        },
                        {
                            id:"1",
                            title : "공지사항입니다.",
                            writer : "어드민",
                            views : "50"
                        }
                    ]} /> 
                </div>
                <div className="home_weather" >
                    <Weather mode="id" id={1838716} width="100%"/>    
                    <ChartMap/> 
                </div>     
             
            </div>        
        </div>    

        </>
    );
}