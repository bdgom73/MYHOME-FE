import axios from "axios";
import { useState } from "react";

export default function Test(props){

    const [data,setData] = useState("");
    const onSubmitHandler = (e)=>{
        e.preventDefault();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const fd = new FormData();      
        for(let i =0; i < e.target[0].files.length ; i++){
           fd.append("images[]", e.target[0].files[i]);
        }   
    }
    return(
        <form onSubmit={onSubmitHandler}>
            <input multiple="multiple"  type="file" name="images[]" />
            <input type="submit" value="테스트"/>
            <textarea></textarea>
            <div>
            <video src={data} controls />
            </div>
        </form>
    )
}