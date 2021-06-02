import { useEffect, useState } from "react";
import "../css/progressBar.scss"
export default function ProgressBar({total, loaded, loadend}){
 
    let loading = isNaN(((loaded / total) * 100)) ? 0 : ((loaded / total) * 100).toFixed(1);
    let width = loadend ? 100 : loading;
    console.log(loading)
    return(
        <>
            <div className="progress">
                <span>{width === 0 ? 0+"%" : width+"%"}</span>      
                <div className="bar" style={{width : width+"%"}}></div>
            </div>
        </>
    );
}