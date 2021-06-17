import { useEffect } from "react";

export default function Loading(props){

    useEffect(()=>{
        document.body.overflow ="hidden";
        return (document.body.overflow ="auto");      
    },[])
    return(
        <>
        <div className="loading">
            <div className="bar">{props.text}</div>
            <div className="loading_bar">     
            </div>  
        </div>
        </>
    );
}
