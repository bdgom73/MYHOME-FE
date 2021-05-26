import { useEffect } from "react";

export default function useTitle(title){

    const htmlTitle = document.querySelector("title");
    useEffect(()=>{
        htmlTitle.innerHTML = title;
    },[])

    return {
        title,
        refTitle : htmlTitle ,
    }
}