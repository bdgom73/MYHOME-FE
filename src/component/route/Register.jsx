import axios from 'axios';
import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import useTitle from '../../customState/useTitle';
import Modal from '../modal/modal';
export default function Register(){

    useTitle(`MYDOMUS | JOIN`);
    const [modalIndex,setModalIndex] = useState(0);
    const [zipcode,setZipcode]=useState("");
    const [address,setAddress] = useState("");
    const [firstPassword,setFirstPassword] = useState("");
    const [secondPassword,setSecondPassword] = useState("");
    const [msg,setMsg] = useState("");
    const [emailcheck,setEmailCheck] = useState(false);
    const [mail,setMail] = useState(false);

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
        fd.append("nickname",target[4].value);
        fd.append("zipcode",target[5].value);
        fd.append("address",target[7].value);
        fd.append("detail_address",target[8].value);

        axios.post("/member/register",fd)
            .then(res=>{
                toast.success("회원가입 완료")
                history.push("/login");
            }).catch(e=>{
                toast.error(e.response.data.message ? e.response.data.message : "알수 없는 오류로 인해 로그인에 실패했습니다.");
            })
    }

    const duplicatePasswordCheck = (e)=>{
        const pass = e.target.value;
        setSecondPassword(pass);
        if(pass !== firstPassword){
            e.nativeEvent.path[2].childNodes[0].childNodes[1].style.borderBottom="2px solid #fd5b50";
            e.target.style.borderBottom="2px solid #fd5b50";
        }else{
            e.nativeEvent.path[2].childNodes[0].childNodes[1].style.borderBottom="1px solid #bbb";
            e.target.style.borderBottom="1px solid #bbb";
        }
    }
    const duplicatePasswordCheck2 = (e)=>{
        const pass = e.target.value;
        setFirstPassword(pass);
        console.log( e.nativeEvent.path[2].childNodes[0].childNodes[1]);
        if(pass !== secondPassword){
            e.nativeEvent.path[2].childNodes[1].childNodes[1].style.borderBottom="2px solid #fd5b50";
            e.target.style.borderBottom="2px solid #fd5b50";
        }else{
            e.nativeEvent.path[2].childNodes[1].childNodes[1].style.borderBottom="1px solid #bbb";
            e.target.style.borderBottom="1px solid #bbb";
        }
    }
 
    return(
        <>
        {openModal()}
        <div className="write_wrap" style={{maxWidth:"800px",margin:"15px auto"}}>
            <div className="sub_header">    
                <div className="title">회원가입</div>
            </div>   
            <form onSubmit={onSubmitHandler}> 
                <div className="label_wrap label_flex">
                    <label htmlFor="email">이메일</label>
                    <input type="email" required name="email" />
                    <button type="button" className="btn">중복체크</button>
                    <button type="button" className="btn delete">인증</button>
                </div>
                {/* <message>사용가능한 이메일입니다.</message> */}
                <div className="label_con">
                    <div className="label_wrap">
                        <label htmlFor="password">비밀번호</label>
                        <input type="password" required name="password" onChange={duplicatePasswordCheck2}/>
                    </div>
                    <div className="label_wrap">
                        <label htmlFor="password2">비밀번호확인</label>
                        <input type="password" required name="password2" onChange={duplicatePasswordCheck} />
                    </div>
                </div>
                <div className="label_wrap">
                    <label htmlFor="name">이름</label>
                    <input type="text" required name="name" />
                </div>
                <div className="label_wrap">
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" required name="nickname" maxLength="12" minLength="2"/>
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