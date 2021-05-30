import { useEffect, useState } from "react";
import "../css/progressBar.scss"
export default function ProgressBar({total, loaded, loadend}){

    const [width , setWidth] = useState(((loaded === 0 ? 1 : loaded)/total) * 100);

    
    let loading = ((loaded/total) * 100) ;
    let a = loadend ? 100 : loading;

    return(
        <>
            <div className="progress">
                <span>{a.toFixed(0)+"%"}</span>      
                <div className="bar" style={{width : (a)+"%"}}></div>
            </div>
        </>
    );
}