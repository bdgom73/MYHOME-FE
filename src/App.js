import { BrowserRouter, Route, Switch } from "react-router-dom";
import Template from "./component/part/Main_template";
import "./App.css";
import Calendar from "./component/part/Calendar";
import Home from "./component/route/Home";
import WeatherOneCall from "./component/part/weather_onecall";
import GoogleMap from "./component/part/googleMap";
import TotalWeatherCard from "./component/part/weather/TotalWeatherCard";
import TotalWeather from "./component/part/TotalWeather";
import VideoWrite from "./component/route/VideoWrite";
import Register from "./component/route/Register";
import Login from "./component/route/Login";
import useMember from "./customState/useMember";
import { useEffect } from "react";
function App() {

  return (   
      
      <Switch>   
        <Route exact path="/"><Template><Home/></Template></Route>
        <Route exact path="/weather"><Template><TotalWeather/></Template></Route>
        <Route exact path="/schedule"><Template><Calendar view={true}/></Template></Route>
        <Route exact path="/map"><Template><GoogleMap/></Template></Route>  
        <Route exact path="/login"><Template><Login/></Template></Route>
        <Route exact path="/register"><Template><Register/></Template></Route>
        <Route exact path="/test"><Template><VideoWrite/></Template></Route>
        <Route path="/">404</Route>
      </Switch>
    
  );
}

export default App;