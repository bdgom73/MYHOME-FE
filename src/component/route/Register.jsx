import axios from 'axios';
import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import useTitle from '../../customState/useTitle';
import Modal from '../modal/modal';
import Loading from '../part/Loading';
import { AiOutlineEye,AiOutlineEyeInvisible } from 'react-icons/ai';
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

    // 비밀번호 보이기
    const [viewPasswords, setViewPasswords] = useState(false);

    // 닉네임길이
    const [nicknameLen, setNicknameLen] = useState(0);
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
                            <input type="button" className="btn" defaultValue="다시받기" style={{width:"100%"}} onClick={onClickAuthHandler}/>
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
            setUserAuthNumber("");
            onclose();   
        }else{
            alert("인증번호가 다릅니다.");
            setEmailCheck(false);     
        }
        
    }

    const onClickAuthHandler = ()=>{    
        const msg = document.getElementById("dupicateEmail");  
        msg.innerText = "";
        msg.classList.remove("error");
        msg.classList.remove("success");  
        setAuthLoading(true);
        if(!email){
            setAuthLoading(false);       
            msg.innerText = "이메일을 입력해주세요.";
            msg.classList.add("error");
            msg.classList.remove("success");
            return;
        }
        if(authEmail && authEmail === email){
            setAuthLoading(false);
            msg.innerText = "이미 인증된 이메일입니다.";
            msg.classList.add("error");
            msg.classList.remove("success");
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
            msg.innerText = "이메일 형식이 아닙니다.";
            msg.classList.add("error");
            msg.classList.remove("success");
            setAuthLoading(false);  
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
        const pw = document.getElementById("dupicatePassword");
        e.preventDefault();
        if(emailcheck){
            if(!target[6].value){
                setMsg("우편번호를 선택해주세요");
                document.getElementById("register_zipcode").focus();
                return;
            }      
            let passwordRegExp = /^[a-zA-Z0-9\d~!@#$%^&*]{10,}$/;  
            if(target[2].value.match(passwordRegExp) === null){
                pw.innerText = "비밀번호 길이는 10자리이상 영문자,숫자, 특수문자(필1) 로 설정해주세요.";
                pw.classList.add("error");
                pw.classList.remove("success");
                document.getElementById("register_password").focus();
                return;
            }
            if(target[2].value !== target[3].value){
                pw.innerText = "비밀번호를 다릅니다.";
                pw.classList.add("error");
                pw.classList.remove("success");
                document.getElementById("register_password").focus();
                return;
            }
            if(email !== authEmail){
                setEmailCheck(false);
                setAuthEmail("");
                document.getElementById("register_email").focus();
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
        const pw = document.getElementById("dupicatePassword");
        setSecondPassword(pass);
        if(pass !== firstPassword){
            pw.innerText="비밀번호가 다릅니다";
            pw.classList.add("error");
            pw.classList.remove("success");
        }else{
            let passwordRegExp = /^[a-zA-Z0-9\d~!@#$%^&*]{10,}$/;  
            if(!passwordRegExp.test(e.target.value)){
                pw.innerText="비밀번호는 영문,숫자,특수문자1개로 이루어진 10글자 이상만 설정가능합니다.";
                pw.classList.add("error");
                pw.classList.remove("success");
            }else{
                pw.innerText="비밀번호가 같습니다."
                pw.classList.add("success");
                pw.classList.remove("error");
            }
        }
    }
    const duplicatePasswordCheck2 = (e)=>{
        const pw = document.getElementById("dupicatePassword");
        const pass = e.target.value;
        setFirstPassword(pass);   
          
        if(pass !== secondPassword){
            pw.innerText="비밀번호가 다릅니다";
            pw.classList.add("error");
            pw.classList.remove("success");
        }else{
            let passwordRegExp = /^[a-zA-Z0-9\d~!@#$%^&*]{10,}$/;  
            if(!passwordRegExp.test(e.target.value)){
                pw.innerText="비밀번호는 영문,숫자,특수문자1개로 이루어진 10글자 이상만 설정가능합니다.";
                pw.classList.add("error");
                pw.classList.remove("success");
            }else{
                pw.innerText="비밀번호가 같습니다."
                pw.classList.add("success");
                pw.classList.remove("error");
            }
           
        }
    }
 
    return(
        <>
        {openModal()}
        {authLoading ? <Loading text="이메일 검증 중입니다..."/> : ""}
        <div className="write_wrap write_board" style={{maxWidth:"800px",margin:"15px auto"}}>
            <div className="sub_header">    
                <div className="title">회원가입</div>
            </div>   
            <form onSubmit={onSubmitHandler}> 
                <div className="label_wrap">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="register_email" placeholder="사용가능한 이메일 주소를 입력해주세요." style={{color : "#222"}} required name="email" value={email} onChange={(e)=>{setEmail(e.target.value);document.getElementById("dupicateEmail").innerText=""}}/>
                    <div className="label_btn">
                        <button type="button" className="btn delete" onClick={onClickAuthHandler}>인증</button>
                    </div>
                </div>           
                <div className="error" id="dupicateEmail"></div>
                <div className="label_con">
                    <div className="label_wrap">
                        <label htmlFor="password">비밀번호</label>
                        <input id="register_password" type={viewPasswords ? "text" : "password"} placeholder="10자리 이상의 패스워드를 입력해주세요" required name="password" onChange={duplicatePasswordCheck2}/>
                        {
                            viewPasswords ?  
                            <AiOutlineEyeInvisible onClick={()=> setViewPasswords(false)}/> : 
                            <AiOutlineEye onClick={()=> setViewPasswords(true)}/> 
                        }
                        
                    </div>          
                    <div className="label_wrap">
                        <label htmlFor="password2">비밀번호확인</label>
                        <input type={viewPasswords ? "text" : "password"} placeholder="동일한 패스워드를 입력해주세요" required name="password2" onChange={duplicatePasswordCheck} />
                    </div>
                    <div id="dupicatePassword"></div>
                </div>
                 <div id="validate_password"></div> 
                <div className="label_wrap">
                    <label htmlFor="name">이름</label>
                    <input type="text" required name="name" maxLength="10" placeholder="이름 ( 실 명 )을 입력해주세요"/>
                </div>
                <div className="label_wrap">
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" required name="nickname" placeholder="닉네임은 3글자 이상 12글자 이하로 입력해주세요" maxLength="20" minLength="3" onChange={(e)=>{
                        setNicknameLen(e.target.value.length);
                        const msg = document.getElementById("dupicateNickname");
                        if(e.target.value.indexOf(" ") !== -1){
                            msg.innerText = "공백은 사용불가능합니다.";
                            msg.classList.add("error");
                            msg.classList.remove("success");
                            return;
                        }
                        if(e.target.value !== "" && e.target.value.length >= 3 && e.target.value.length <= 20){
                            axios.get(`/member/duplicate/nickname=${e.target.value}`)
                            .then(res=>{
                                if(res.status === 200){   
                                    msg.innerText = "사용가능한 닉네임입니다.";
                                    msg.classList.add("success");
                                    msg.classList.remove("error");
                                }
                            }).catch(e=>{     
                                msg.innerText = e.response.data.msg ? e.response.data.msg : "사용불가능한 닉네임입니다.";
                                msg.classList.add("error");
                                msg.classList.remove("success");
                            })
                        }else{
                            msg.innerText = "닉네임은 3글자 이상 20글자 이하만 가능합니다.";
                            msg.classList.add("error");
                            msg.classList.remove("success");
                        }
                        
                    }}/>
                    <div className="len_nickname">{nicknameLen}/20</div>
                    <div className="error" id="dupicateNickname"></div>
                </div>
                <div className="address_wrap">
                    <div className="zipcode_wrap">
                        <label htmlFor="zipcode">우편번호</label>
                        <div className="wrap">
                            <input type="text" id="register_zipcode" readOnly name="zipcode" defaultValue={zipcode} />
                            <input type="button" onClick={()=>{setModalIndex(1)}} value="찾기"/>
                        </div>        
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