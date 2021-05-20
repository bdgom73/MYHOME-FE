import { useEffect } from "react";
import "../../css/part/Loading.scss";
export default function Loading(props){

    useEffect(()=>{
        document.body.overflow ="hidden";
        return (document.body.overflow ="auto");      
    },[])
    return(
        <>
        <div className="loading">
            <div className="loading_bar">
            <div className="bar"></div>
            </div>
           
        </div>
        </>
    );
}
