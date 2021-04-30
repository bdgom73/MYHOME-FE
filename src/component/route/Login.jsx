import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useHistory } from 'react-router';
import Modal from '../modal/modal';
export default function Login(){

    const history = useHistory();
    return(
        <>
        <div className="login_wrap">
            <div className="sub_header">
                <div className="logo">
                    <img src="/image/logo.png" alt="LOGO" onClick={()=>{history.push("/")}}/>
                </div>
                <div className="title">로그인</div>
            </div>  
            <form>
                <div className="label_wrap">
                    <label htmlFor="email">이메일</label>
                    <input type="email" name="email" />
                </div>
                <div className="label_wrap">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" name="password" />
                </div>           
                <input type="submit" value="로그인"/>      
            </form>
           
        </div>
        </>
    );
}