import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import DaumPostcode from 'react-daum-postcode';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import useTitle from '../../customState/useTitle';
import Modal from '../modal/modal';
export default function Login(){

    useTitle(`MYDOMUS | LOGIN`);
    const history = useHistory();
    const [cookies , setCookies] = useCookies();
    function onSubmitHandler(e){
        const {target} = e;
        e.preventDefault();
       
        const fd = new FormData();
        fd.append("email",target[0].value);
        fd.append("password",target[1].value);
     
        axios.post("/member/login",fd)
            .then(res=>{
                setCookies("SESSION_UID",res.data,{path : "/"});
                history.push("/");
            }).catch(e=>{
                alert(e.response.message ? e.response.message : "알수 없는 오류로 인해 로그인에 실패했습니다.");
            })
    }
    return(
        <>
        <div className="write_wrap">
            <div className="sub_header">
                {/* <div className="logo">
                    <img src="/image/logo.png" alt="LOGO" onClick={()=>{history.push("/")}}/>
                </div> */}
                <div className="title">로그인</div>
            </div>  
            <form onSubmit={onSubmitHandler}>
                <div className="label_wrap">
                    <label htmlFor="email">이메일</label>
                    <input type="email" required name="email" />
                </div>
                <div className="label_wrap">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" required name="password" />
                </div>           
                <input type="submit" value="로그인"/>      
            </form>
            <p>계정이 없으신가요 ? <small><Link to="/register">회원가입</Link></small></p>
        </div>
        </>
    );
}