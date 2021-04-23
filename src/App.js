import { BrowserRouter, Route, Switch } from "react-router-dom";
import Template from "./component/part/Main_template";
import "./App.css";
import Calendar from "./component/part/Calendar";
import Home from "./component/route/Home";
import Weather from "./component/part/weather";
import WeatherOneCall from "./component/part/weather_onecall";
import Loading from "./component/part/Loading";
import ChartMap from "./component/part/ChartMap";
import GoogleMap from "./component/part/googleMap";

function App() {
 
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/"><Template><Home/></Template></Route>
        <Route exact path="/weather"><Template><WeatherOneCall/></Template></Route>
        <Route exact path="/dust"><Template></Template></Route>
        <Route exact path="/schedule"><Template><Calendar view={true}/></Template></Route>
        <Route exact path="/map"><Template><GoogleMap/></Template></Route>
      </Switch>
    </BrowserRouter>
  );
}
export default App;