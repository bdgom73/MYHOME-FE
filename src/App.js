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
import VideoBoard from "./component/route/VideoBoard";
import Board from "./component/part/write/Board";
import BoardCard from "./component/part/write/BoardCard";
function App() {

  return (   
      
      <Switch>   
        <Route exact path="/"><Template><Home/></Template></Route>
        <Route exact path="/weather"><Template><TotalWeather/></Template></Route>
        <Route exact path="/schedule"><Template><Calendar view={true}/></Template></Route>
        <Route exact path="/map"><Template><GoogleMap/></Template></Route>  
        <Route exact path="/login"><Template><Login/></Template></Route>
        <Route exact path="/register"><Template><Register/></Template></Route>
        <Route exact path="/test"><Template><Board>
          <BoardCard
          data = {[
              {
                id : "1",
                src : "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA0MjBfMTcx%2FMDAxNjE4OTI3NTQ1NzUy.d0-ipQ6rWIvYH7lqEPA8o5j8rB7r7yxZ78-QAfBeSfsg.tTSUhUXLva-kdlGMvHkFL9iLt84CO8GAsd1DA7wSFpUg.JPEG.pentoinsoo%2F01-KT%25B0%25B6%25B7%25B0%25BD%25C3%25B3%25EB%25C6%25AE5%25B1%25E2%25B1%25E2%25BA%25AF%25B0%25E6.jpg&type=a340",
                title : "테스트용 제목입니다.",
                writer : "어드민",
                recommend : 5,
                views : 10
              },
              {
                id : "1",
                src : "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA0MjBfMTcx%2FMDAxNjE4OTI3NTQ1NzUy.d0-ipQ6rWIvYH7lqEPA8o5j8rB7r7yxZ78-QAfBeSfsg.tTSUhUXLva-kdlGMvHkFL9iLt84CO8GAsd1DA7wSFpUg.JPEG.pentoinsoo%2F01-KT%25B0%25B6%25B7%25B0%25BD%25C3%25B3%25EB%25C6%25AE5%25B1%25E2%25B1%25E2%25BA%25AF%25B0%25E6.jpg&type=a340",
                title : "테스트용 제목입니용 제목입니다테스트용 제목입니다.",
                writer : "어드민",
                recommend : 5,
                views : 10
              },
              {
                id : "1",
                src : "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA0MjBfMTcx%2FMDAxNjE4OTI3NTQ1NzUy.d0-ipQ6rWIvYH7lqEPA8o5j8rB7r7yxZ78-QAfBeSfsg.tTSUhUXLva-kdlGMvHkFL9iLt84CO8GAsd1DA7wSFpUg.JPEG.pentoinsoo%2F01-KT%25B0%25B6%25B7%25B0%25BD%25C3%25B3%25EB%25C6%25AE5%25B1%25E2%25B1%25E2%25BA%25AF%25B0%25E6.jpg&type=a340",
                title : "테스트용 제목입니다.",
                writer : "어드민",
                recommend : 52334344,
                views : 52334344
              },
              {
                id : "1",
                src : "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA0MjBfMTcx%2FMDAxNjE4OTI3NTQ1NzUy.d0-ipQ6rWIvYH7lqEPA8o5j8rB7r7yxZ78-QAfBeSfsg.tTSUhUXLva-kdlGMvHkFL9iLt84CO8GAsd1DA7wSFpUg.JPEG.pentoinsoo%2F01-KT%25B0%25B6%25B7%25B0%25BD%25C3%25B3%25EB%25C6%25AE5%25B1%25E2%25B1%25E2%25BA%25AF%25B0%25E6.jpg&type=a340",
                title : "테스트용 제목입니다.",
                writer : "어드민",
                recommend : 52334344,
                views : 52334344
              },
              {
                id : "1",
                src : "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA0MjBfMTcx%2FMDAxNjE4OTI3NTQ1NzUy.d0-ipQ6rWIvYH7lqEPA8o5j8rB7r7yxZ78-QAfBeSfsg.tTSUhUXLva-kdlGMvHkFL9iLt84CO8GAsd1DA7wSFpUg.JPEG.pentoinsoo%2F01-KT%25B0%25B6%25B7%25B0%25BD%25C3%25B3%25EB%25C6%25AE5%25B1%25E2%25B1%25E2%25BA%25AF%25B0%25E6.jpg&type=a340",
                title : "테스트용 제목입니다.",
                writer : "어드민",
                recommend : 52334344,
                views : 52334344
              }
          ]}
        /></Board></Template></Route>
        <Route path="/">404</Route>
      </Switch>
    
  );
}

export default App;