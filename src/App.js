import {  Route, Switch, useHistory } from "react-router-dom";
import Template from "./component/part/Main_template";
import "./App.css";
import Calendar from "./component/part/Calendar";
import Home from "./component/route/Home";
import GoogleMap from "./component/part/googleMap";
import TotalWeather from "./component/part/TotalWeather";
import Register from "./component/route/Register";
import Login from "./component/route/Login";
import useMember from "./customState/useMember";

import VideoBoard from "./component/route/VideoBoard";

import NotFound from "./component/NotFound";
import VideoDetail from "./component/route/board/VideoDetail";
import VideoWrite from "./component/route/VideoWrite";
import FreeBoard from "./component/route/board/FreeBoard";

function App() {


  return (   
    <Switch>   
      <Route exact path="/" ><Template><Home /></Template></Route>
      
      <Route exact path="/weather" ><Template access="user"><TotalWeather/></Template></Route>
      <Route exact path="/schedule" ><Template access="user"><Calendar view/></Template></Route>
      <Route exact path="/map" ><Template access="user"><GoogleMap/></Template></Route>  

      <Route exact path="/login" ><Template access="non-user"><Login/></Template></Route>
      <Route exact path="/register"><Template access="non-user"><Register/></Template></Route>
    
      
      <Route exact path="/test"><Template><VideoWrite/></Template></Route>
      <Route exact path="/bbs/free"><Template><FreeBoard/></Template></Route>
      <Route exact path="/bbs/write"><Template><VideoWrite/></Template></Route>
      <Route exact path="/watch" render={(props)=>{ return <Template><VideoDetail {...props}/></Template>}} ></Route>
      <Route path="/"><NotFound/></Route>
    </Switch> 
  );
}

export default App;