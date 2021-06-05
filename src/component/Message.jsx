import { useEffect } from "react";

export default function Message({text,type}){

    let style = {}
    switch(type){
        case "success" :
            style = {backgroundColor : "#0080FF", color : "#ffffff"}
            break;
        case "error" :
            style = {backgroundColor : "#d43a3a", color : "#ffffff"}
            break;
        case "confirm" :
            style = {backgroundColor : "#b2d5f1", color : "#000000"}
            break;
        default :
            style = {backgroundColor : "#dddddd"}
            break;
    }


    return(
        <>
        <message style={style}>
            <text>{text}</text>
        </message>
        </>
    )
}