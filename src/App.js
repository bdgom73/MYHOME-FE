import {  Route, Switch } from "react-router-dom";
import Template from "./component/part/Main_template";
import Calendar from "./component/part/Calendar";
import Home from "./component/route/Home";
import GoogleMap from "./component/part/googleMap";
import TotalWeather from "./component/part/TotalWeather";
import Register from "./component/route/Register";
import Login from "./component/route/Login";
import VideoBoard from "./component/route/board/list/VideoBoard";
import NotFound from "./component/NotFound";
import VideoDetail from "./component/route/board/detail/VideoDetail";
import FreeBoard from "./component/route/board/list/FreeBoard";
import FreeDetail from "./component/route/board/detail/FreeDetail";
import PhotoBoard from "./component/route/board/list/PhotoBoard";
import PhotoDetail from "./component/route/board/detail/PhotoDetail";
import VideoWrite from "./component/route/board/write/VideoWrite";
import FreeWrite from "./component/route/board/write/FreeWrite";
import PhotoWrite from "./component/route/board/write/PhotoWrite";
import PhotoUpdate from "./component/route/board/update/PhotoUpdate";
import FreeUpdate from "./component/route/board/update/FreeUpdate";
import Notice from "./component/route/notice/Notice"
import VideoUpdate from "./component/route/board/update/VideoUpdate";
import { ToastContainer } from 'react-toastify';
import Search from "./component/route/Search";
import Myinfo from "./component/route/myinfo/Myinfo";
import UserInfo from "./component/route/user/UserInfo";
import ToastWeather from "./component/part/ToastWeather";
import UserFind from "./component/route/find/UserFind";
import TalkList from "./component/page/talk/TalkList";
import ChatPage from "./component/page/chat/ChatPage";
function App() {

  return (   
    <>
    
    <ToastContainer/>
    <Switch>   
      <Route exact path="/" ><Template><Home/></Template></Route>   
      {/* MEMBERSHIP SERVICE */}
      <Route exact path="/weather" ><Template access="user"><TotalWeather/></Template></Route>
      <Route exact path="/schedule" ><Template access="user"><div className="calendar_main_wrap"><Calendar view/></div></Template></Route>
      <Route exact path="/map" ><Template access="user"><GoogleMap/></Template></Route>  

      {/* JOIN SERVICE */}
      <Route exact path="/login" ><Template access="non-user"><Login/></Template></Route>
      <Route exact path="/register"><Template access="non-user"><Register/></Template></Route>

      {/* Notice Service */}
      <Route exact path="/bbs/notice" render={(props)=>{ return <Template><Notice {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/notice/page=" render={(props)=>{ return <Template><Notice {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/notice/page=:page"  render={(props)=>{ return <Template><Notice {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/notice/:id" render={(props)=>{ return <Template><FreeDetail {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/notice/update/:id" render={(props)=>{ return <Template access="user"><FreeUpdate {...props}/></Template>}} ></Route>

      {/* Free Board Service */}
      <Route exact path="/bbs/free/" render={(props)=>{ return <Template><FreeBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/free/page=" render={(props)=>{ return <Template><FreeBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/free/page=:page"  render={(props)=>{ return <Template><FreeBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/free/:id" render={(props)=>{ return <Template><FreeDetail {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/update/free/:id" render={(props)=>{ return <Template access="user"><FreeUpdate {...props}/></Template>}} ></Route>

      {/* Video Board Service */}
      <Route exact path="/bbs/video"><Template><VideoBoard/></Template></Route>
      <Route exact path="/bbs/video/:id" render={(props)=>{ return <Template><VideoDetail {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/update/video/:id" render={(props)=>{ return <Template access="user"><VideoUpdate {...props}/></Template>}} ></Route>
      
      {/* Photo Board Service */}
      <Route exact path="/bbs/photo" render={(props)=>{ return <Template><PhotoBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/photo/page=" render={(props)=>{ return <Template><PhotoBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/photo/page=:page"  render={(props)=>{ return <Template><PhotoBoard {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/photo/:id" render={(props)=>{ return <Template><PhotoDetail {...props}/></Template>}} ></Route>
      <Route exact path="/bbs/update/photo/:id" render={(props)=>{ return <Template access="user"><PhotoUpdate {...props}/></Template>}} ></Route>

      {/* Write Service */}
      <Route exact path="/bbs/write/video"><Template access="user"><VideoWrite/></Template></Route>
      <Route exact path="/bbs/write/free"><Template access="user"><FreeWrite/></Template></Route>
      <Route exact path="/bbs/write/photo"><Template access="user"><PhotoWrite/></Template></Route>
      
      {/* Search Service */}
      <Route exact path="/search" render={(props)=>{ return <Template><Search {...props}/></Template>}} ></Route>
      
      {/* My Infomation */}
      <Route exact path="/myinfo" render={(props)=>{ return <Myinfo {...props}/> }}></Route>

      {/* User Infomation */}
      <Route exact path="/user=:nickname" render={(props)=>{ return <UserInfo {...props}/> }}></Route>

      {/* User ID / PW Find Service*/}
      <Route exact path="/find/userinfo" render={(props)=>{ return <Template access="non-user"><UserFind {...props}/></Template> }}></Route>
      
      {/* TEST */}
      <Route exact path="/test"><Template talk_header><TalkList/></Template></Route>

      {/* ROOM CHAT */}
      <Route exact path="/chat"><Template talk_header><TalkList/></Template></Route>
      <Route exact path="/chat/room=:room" render={(props)=>{ return <Template talk_header><ChatPage {...props}/></Template> }}></Route>

      {/* NOT FOUND SERVICE */}
      <Route path="/"><NotFound/></Route>
    </Switch> 
    <ToastWeather/>
    </>
  );
}

export default App;