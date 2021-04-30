import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useHistory } from 'react-router';
import Modal from '../modal/modal';
export default function Register(){

    const [modalIndex,setModalIndex] = useState(0);
    const [zipcode,setZipcode]=useState("");
    const [address,setAddress] = useState("");
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
        onclose();
    }
    return(
        <>
        {openModal()}
        <div className="register_wrap">
            <div className="sub_header">
                <div className="logo">
                    <img src="/image/logo.png" alt="LOGO" onClick={()=>{history.push("/")}}/>
                </div>
                <div className="title">회원가입</div>
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
                <div className="label_wrap">
                    <label htmlFor="password2">비밀번호확인</label>
                    <input type="password" name="password2" />
                </div>
                <div className="label_wrap">
                    <label htmlFor="name">이름</label>
                    <input type="text" name="name" />
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
                    <input type="text" name="detail_address" />
                </div>
                <input type="submit" value="가입하기"/>
               
            </form>
        </div>
        </>
    );
}