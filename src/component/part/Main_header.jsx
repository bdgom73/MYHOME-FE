import { useState } from 'react';
import { BsList,BsFillBellFill } from 'react-icons/bs';
import { useHistory } from 'react-router';
import "../../css/part/Main_header.scss";
export default function Main_header(props){

    const history = useHistory();

    return(
        <>
        <header>
            <div className="header_s1">
                <div className="sub_menu">
                    <BsList size={30} color="#32435F" onClick={props.subMenuHandler}/>
                </div>
                <div className="logo">
                    <img src="/image/logo.png" alt="LOGO" onClick={()=>{history.push("/")}}/>
                </div>
            </div>
            {/* <div className="search">
                <input type="text" name="search"/>
                <input type="button" value="검색"/>
            </div> */}
            <div className="user_info">
                <div className="alert"><BsFillBellFill size={25} color="#32435F"/></div>
                <div className="user_profile">
                    IJ
                </div>
            </div>      
        </header>
        </>
    );
}