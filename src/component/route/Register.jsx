import axios from 'axios';
import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import useTitle from '../../customState/useTitle';
import Modal from '../modal/modal';
import Loading from '../part/Loading';
export default function Register(){

    useTitle(`MYDOMUS | JOIN`);

    const [modalIndex,setModalIndex] = useState(0);

    // 다음 주소 선택 값 
    const [zipcode,setZipcode]=useState("");
    const [address,setAddress] = useState("");

    // 비밀번호 확인
    const [firstPassword,setFirstPassword] = useState("");
    const [secondPassword,setSecondPassword] = useState("");

    // 오류메시지
    const [msg,setMsg] = useState("");

    // 이메일 인증 보내기
    const [authLoading, setAuthLoading] = useState(false);

    // 이메일 인증 여부
    const [emailcheck,setEmailCheck] = useState(false);

    // 입력된 이메일 값
    const [email,setEmail] =  useState("");

    // 인증완료된 이메일 값
    const [authEmail,setAuthEmail] = useState("");

    // 인증번호 저장
    const [ authNumber ,setAuthNumber ] = useState("");

    // 입력한 인증번호값 저장
    const [ userAuthNumber ,setUserAuthNumber ] = useState("");

    const history = useHistory();

    function openModal(){
        switch(modalIndex){
            case 1 : 
                return (
                    <Modal title="주소검색" close={onclose} >
                        <DaumPostcode onComplete={onComplete}/>
                    </Modal>
                );
            case 2 :        
                return (
                    <Modal title="이메일인증" close={onclose}>
                        <div className="btn_wrap" style={{flexDirection:"column", width:"100%"}}>
                            <input type="text" className="basic" value={userAuthNumber} onChange={(e)=>{setUserAuthNumber(e.target.value)}}/>
                            <input type="button" className="btn" defaultValue="인증" style={{width:"100%"}} onClick={emailAuth}/>
                        </div>
                    </Modal>
                );
            case 3 :
                return (
                    <Modal close={onclose} style={{backgroundColor : "#fff"}}>
                       <span className="error">{msg}</span>
                    </Modal>
                );
        }
    }

    const emailAuth = ()=>{
        if(!authEmail && authEmail === email){
            alert("이미 인증된 이메일입니다");
            onclose();
            return;
        }      
        if(authNumber.toString() === userAuthNumber){
            alert("인증성공");
            setEmailCheck(true);
            setAuthEmail(email);
            onclose();
        }else{
            alert("인증번호가 다릅니다.");
            setEmailCheck(false);
        }
        
    }

    const onClickAuthHandler = ()=>{        
        setAuthLoading(true);
        if(!email){
            setModalIndex(3);
            setMsg("이메일을 입력해주세요.");
            setAuthLoading(false);       
            return;
        }
        if(authEmail && authEmail === email){
            setModalIndex(3);
            setMsg("이메일을 입력해주세요.");
            setAuthLoading(false);
            return;
        }
       
        let emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if(email.match(emailRegExp) != null){
            axios.get(`/send/email/${email}`)
                .then(res=>{
                    setAuthNumber(res.data);
                    setAuthLoading(false);
                    setModalIndex(2);
                }).catch(e=> {
                    setModalIndex(3);
                    setMsg(e.response.data.message ? e.response.data.message : "인증에 실패했습니다");
                    setAuthLoading(false);         
                })
        }else{
            alert("이메일 형식이 아닙니다.");
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
        if(emailcheck){
            if(!target[4].value){
                setMsg("우편번호를 선택해주세요");
                return;
            }
            const fd = new FormData();
            fd.append("email",target[0].value);
            fd.append("password",target[2].value);
            fd.append("password2",target[3].value);
            fd.append("name",target[4].value);
            fd.append("nickname",target[5].value);
            fd.append("zipcode",target[6].value);
            fd.append("address",target[8].value);
            fd.append("detail_address",target[9].value);
    
            axios.post("/member/register",fd)
                .then(res=>{
                    toast.success("회원가입 완료")
                    history.push("/login");
                }).catch(e=>{
                    toast.error(e.response.data.message ? e.response.data.message : "알수 없는 오류로 인해 로그인에 실패했습니다.");
                })
        }else{
            alert("이메일 인증을 해주세요.")
        }
       
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
        {authLoading ? <Loading/> : ""}
        <div className="write_wrap write_board" style={{maxWidth:"800px",margin:"15px auto"}}>
            <div className="sub_header">    
                <div className="title">회원가입</div>
            </div>   
            <form onSubmit={onSubmitHandler}> 
                <div className="label_wrap label_flex">
                    <label htmlFor="email">이메일</label>
                    <input type="email" style={{color : "#222"}} required name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <button type="button" className="btn delete" onClick={onClickAuthHandler}>인증</button>
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
                </div>
                
                <input type="submit" value="가입하기" />      
            </form>
        </div>
        </>
    );
}