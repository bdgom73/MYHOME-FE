import { useState } from "react";

export default function useModal(){

    const [modal, setModal] = useState(0);
 
    const onCloseHandler = ()=>{
        setModal(0);
        const body = document.body;
        body.style.overflow ="auto";
    }

    return{
        setModal,
        close : onCloseHandler,
        modal
    }
}