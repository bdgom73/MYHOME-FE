import { useEffect, useState } from "react";
import Weather from "../part/weather";
import "../../css/route/home.scss";
import Calendar from "../part/Calendar";
import WeatherInfo from "../part/weather/WeatherInfo";
import GoogleMap from "../part/googleMap";
import ChartMap from "../part/ChartMap";
import BoardTable from "../part/write/BoardTable";
import axios from "axios";
require('dotenv').config();

export default function Home(props){   
    return (
        <>
       <Calendar readonly view/>
        </>
    );
}