import { BrowserRouter, Route, Switch } from "react-router-dom";
import Template from "./component/part/Main_template";
import "./App.css";
import Calendar from "./component/part/Calendar";
import Home from "./component/route/Home";
import WeatherOneCall from "./component/part/weather_onecall";
import GoogleMap from "./component/part/googleMap";
import TotalWeatherCard from "./component/part/weather/TotalWeatherCard";
import TotalWeather from "./component/part/TotalWeather";
function App() {
  return (
      <Switch>
        <Route exact path="/"><Template><Home/></Template></Route>
        <Route exact path="/weather"><Template><WeatherOneCall/></Template></Route>
        <Route exact path="/schedule"><Template><Calendar view={true}/></Template></Route>
        <Route exact path="/map"><Template><GoogleMap/></Template></Route>  
        <Route exact path="/test"><Template><TotalWeather/></Template></Route>
      </Switch>
    
  );
}

export default App;