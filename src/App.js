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
import FreeWrite from "./component/route/FreeWrite";
import PhotoWrite from "./component/route/PhotoWrite";
import FreeDetail from "./component/route/board/FreeDetail";
import Test from "./component/test";
import PhotoBoard from "./component/route/board/PhotoBoard";
import PhotoDetail from "./component/route/board/PhotoDetail";

function App() {

  const history = useHistory();

  return (   
    <Switch>   
      <Route exact path="/" ><Template><Home /></Template></Route>
      
      {/* MEMBERSHIP SERVICE */}
      <Route exact path="/weather" ><Template access="user"><TotalWeather/></Template></Route>
      <Route exact path="/schedule" ><Template access="user"><Calendar view/></Template></Route>
      <Route exact path="/map" ><Template access="user"><GoogleMap/></Template></Route>  

      {/* JOIN SERVICE */}
      <Route exact path="/login" ><Template access="non-user"><Login/></Template></Route>
      <Route exact path="/register"><Template access="non-user"><Register/></Template></Route>
     
      {/* Search Service */}
      <Route exact path="/bbs/search=:id" render={(props)=>{ return <Template><SubLoading {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/search=" render={(props)=>{ return <Template><SubLoading {...props}/></Template>}} ></Route>

      {/* Free Board Service */}
      <Route exact path="/bbs/free/" render={(props)=>{ return <Template><FreeBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/free/page=" render={(props)=>{ return <Template><FreeBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/free/page=:page"  render={(props)=>{ return <Template><FreeBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/free/:id" render={(props)=>{ return <Template><FreeDetail {...props}/></Template>}} ></Route>

      {/* Video Board Service */}
      <Route exact path="/bbs/video"><Template><VideoBoard/></Template></Route>
      <Route exact path="/bbs/video/:id" render={(props)=>{ return <Template><VideoDetail {...props}/></Template>}} ></Route>

       {/* Photo Board Service */}
      <Route exact path="/bbs/photo" render={(props)=>{ return <Template><PhotoBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/photo/page=" render={(props)=>{ return <Template><PhotoBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/photo/page=:page"  render={(props)=>{ return <Template><PhotoBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/photo/:id" render={(props)=>{ return <Template><PhotoDetail {...props}/></Template>}} ></Route>

      {/* Write Service */}
      <Route exact path="/bbs/write/video"><Template access="user"><VideoWrite/></Template></Route>
      <Route exact path="/bbs/write/free"><Template access="user"><FreeWrite/></Template></Route>
      <Route exact path="/bbs/write/photo"><Template access="user"><PhotoWrite/></Template></Route>
      
      {/* TEST */}
      <Route exact path="/test"><Template><Test/></Template></Route>
      {/* NOT FOUND SERVICE */}
      <Route path="/"><NotFound/></Route>
    </Switch> 
  );
}

export default App;