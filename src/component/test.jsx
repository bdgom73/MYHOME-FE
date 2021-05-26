import axios from "axios";

export default function Test(props){

    const onSubmitHandler = (e)=>{
        e.preventDefault();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const fd = new FormData();
      
        
        // for(let i =0; i < e.target[0].files ; i++){
        //    fd.append("images[]", e.target[0].files[i])
        // }
        fd.append("images[]",e.target[0].files[0]);
        fd.append("images[]",e.target[0].files[1]);
        fd.append("images[]",e.target[0].files[2]);
        console.log(e.target[0].files)
        axios.post("/bbs/test",fd)
        .then(res=>console.log(res))
        .catch(e=>console.log(e.response))
        
    }
    return(
        <form onSubmit={onSubmitHandler}>
            <input multiple="multiple"  type="file" name="filename[]" />
            <input type="submit" value="테스트"/>
        </form>
    )
}