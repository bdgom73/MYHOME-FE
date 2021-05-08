import axios from 'axios';
import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useHistory } from 'react-router';
import Modal from '../modal/modal';
export default function Register(){

    const [modalIndex,setModalIndex] = useState(0);
    const [zipcode,setZipcode]=useState("");
    const [address,setAddress] = useState("");
    const [msg,setMsg] = useState("");
    const history = useHistory();

    function openModal(){
        if(modalIndex === 1){
            return (
            <Modal title="주소검색" close={onclose} >
                <DaumPostcode onComplete={onComplete}/>
            </Modal>)
        }
    }
    function onclose(){
        setModalIndex(0);
        const body = document.body;
        body.style.overflow ="auto";
    }

    function onComplete(data){
        setZipcode(data.zonecode);
        setAddress(data.address);
        setMsg("");
        onclose();
    }

    function onSubmitHandler(e){
        const {target} = e;
        e.preventDefault();
        console.log(e)
        if(!target[4].value){
            setMsg("우편번호를 선택해주세요");
            return;
        }
        const fd = new FormData();
        fd.append("email",target[0].value);
        fd.append("password",target[1].value);
        fd.append("password2",target[2].value);
        fd.append("name",target[3].value);
        fd.append("zipcode",target[4].value);
        fd.append("address",target[6].value);
        fd.append("detail_address",target[7].value);

        axios.post("/member/register",fd)
            .then(res=>{
                history.push("/login");
            }).catch(e=>{
                alert(e.response.message ? e.response.message : "알수 없는 오류로 인해 로그인에 실패했습니다.");
            })
    }


    return(
        <>
        {openModal()}
        <div className="write_wrap">
            <div className="sub_header">
                <div className="logo">
                    <img src="/image/logo.png" alt="LOGO" onClick={()=>{history.push("/")}}/>
                </div>
                <div className="title">회원가입</div>
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
                <div className="label_wrap">
                    <label htmlFor="password2">비밀번호확인</label>
                    <input type="password" required name="password2" />
                </div>
                <div className="label_wrap">
                    <label htmlFor="name">이름</label>
                    <input type="text" required name="name" />
                </div>
                <div className="address_wrap">
                    <div className="zipcode_wrap">
                        <label htmlFor="zipcode">우편번호</label>
                        <input type="text" readOnly name="zipcode" defaultValue={zipcode} />
                        <input type="button" onClick={()=>{setModalIndex(1)}} value="찾기"/>
                    </div>  
                    <label htmlFor="address">주소</label>
                    <input type="text" readOnly name="address"  defaultValue={address}/>
                    <label htmlFor="detail_address">상세주소</label>
                    <input type="text" name="detail_address"/>
                    <div className="error">{msg}</div>
                </div>
                
                <input type="submit" value="가입하기" />      
            </form>
        </div>
        </>
    );
}