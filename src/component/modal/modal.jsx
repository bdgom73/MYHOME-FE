import { useEffect } from "react";
import { AiFillCloseCircle } from 'react-icons/ai';
import "../../css/modal/modal.scss";
export default function Modal({children,title,width,style,close}) {
    
    useEffect(()=>{
        const body = document.body;
        body.style.overflow ="hidden";
    },[]);

    return(
        <>
        <div className="modal_wrap">
            <div className="modal" style={style ? style : width ? {width : width} : {width : "auto"}} >
                <div className="modal_top">
                    <span>{title ? title : "알림"}</span>
                    <AiFillCloseCircle size="30" onClick={close}/>
                </div>
                <div className="modal_body">
                    {children}
                </div>  
            </div>
        </div>
        </>
    );
}