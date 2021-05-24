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
import VideoBoard from "./component/route/board/VideoBoard";
import NotFound from "./component/NotFound";
import VideoDetail from "./component/route/board/VideoDetail";
import VideoWrite from "./component/route/VideoWrite";
import FreeBoard from "./component/route/board/FreeBoard";
import SubLoading from "./component/sub_loading";

function App() {

  const history = useHistory();

  return (   
    <Switch>   
      <Route exact path="/" ><Template><Home /></Template></Route>
      
      <Route exact path="/weather" ><Template access="user"><TotalWeather/></Template></Route>
      <Route exact path="/schedule" ><Template access="user"><Calendar view/></Template></Route>
      <Route exact path="/map" ><Template access="user"><GoogleMap/></Template></Route>  

      <Route exact path="/login" ><Template access="non-user"><Login/></Template></Route>
      <Route exact path="/register"><Template access="non-user"><Register/></Template></Route>
    
      
      <Route exact path="/test"><Template><SubLoading/></Template></Route>
      <Route exact path="/bbs/search=:id" render={(props)=>{ return <Template><SubLoading {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/search=" render={(props)=>{ return <Template><SubLoading {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/free"><Template><FreeBoard/></Template></Route>
      <Route exact path="/bbs/free/:id" render={(props)=>{ return <Template><VideoDetail {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/video"><Template><VideoBoard/></Template></Route>
      <Route exact path="/bbs/video/:id" render={(props)=>{ return <Template><VideoDetail {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/write"><Template><VideoWrite/></Template></Route>
      
      <Route path="/"><NotFound/></Route>
    </Switch> 
  );
}

export default App;