import { useState } from "react";
import useModal from "../../../customState/useModal";
import Modal from "../../modal/modal";

const UserFind = (props)=>{


    const {setModal, close, modal} = useModal();
    const [currentEmail, setCurrentEmail] = useState("");
    const modalActive = ()=>{
        switch(modal){
            case 1 :
                const emailRex = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i;
                return (
                <Modal title="이메일로 찾기" close={close}>
                    <h3>본인이 로그인시 <font color="#ca5656">사용하는 이메일</font>을 입력해주세요</h3>
                    <input type="text" className="basic" placeholder="계정으로 사용중인 이메일을 입력해주세요."
                        onChange={(e)=>{
                            const vefp = document.getElementById("validate_email_find_pw");
                            setCurrentEmail(e.target.value);
                            if(e.target.value.match(emailRex) === null){
                                if(e.target.value.length === 0) {
                                    vefp.innerText=" ";
                                    return;
                                };
                                vefp.innerText="이메일 형식이 아닙니다";
                                vefp.classList.add("error");
                                vefp.classList.remove("success");      
                            }else{
                                vefp.innerText="이메일 형식입니다";
                                vefp.classList.add("success");
                                vefp.classList.remove("error");  
                            }
                        }}
                    />
                    <div id="validate_email_find_pw"></div>
                    <div className="btn_wrap">
                        <button type="button" className="btn" onClick={()=>{
                           setModal(2);
                        }}>찾기</button>
                    </div>
                </Modal>
                );
            case 2 : 
                return (
                    <Modal title="이메일로 찾기" close={close} >
                        <h2 style={{margin : "0px"}}><font color="#b2b2b2" >전송될 이메일</font></h2>
                        <h3 style={{margin : "0px",textDecoration:"underline"}}><font color="#b2b2b2">{currentEmail}</font></h3>
                        <p>
                            <ul>
                                <li>
                                    변경 버튼 클릭시 <font color="#ca5656">임의의 10자리 패스워드</font>로 <font color="#ca5656">변경</font>됩니다.
                                </li>
                                <li>변경된 임의의 10자리 패스워드는 <font color="#ca5656">해당메일로 전송</font>됩니다.</li>
                                <li>전송된 패스워드를 통해 로그인 후 <font color="#ca5656">내정보에서 패스워드를 변경</font>바랍니다.</li>                    
                            </ul>
                        </p>
                        <p className="info">
                            계정가입시 사용했던 이메일이&nbsp;
                            <font color="#fa5656">존재하지 않을 시</font>&nbsp;
                            비밀번호를 <font color="#fa5656">찾을 수 없</font>습니다.         
                        </p>
                        <div className="btn_wrap">
                            <button type="button" className="btn">변경
                        </button>
                    </div>
                    </Modal>
                )   
        }
    }


    return(
        <>
        {modalActive()}
        <div className="user_find_wrap">
            <div className="user_find">
                <div className="whatinfo">
                    <div className="whatinfo_title">아이디 찾기</div>
                    <div className="whatinfo_body">
                        <ul>
                            <li>인증을 통해 아이디를 찾습니다. </li>
                            <li>마지막 2자리는 *로 표시됩니다.</li>
                        </ul>                
                    </div>
                    <div className="whatinfo_btn">
                        <button type="button" className="btn" disabled>이메일로 찾기</button>
                    </div>
                </div>
                <div className="whatinfo">
                    <div className="whatinfo_title">비밀번호찾기</div>
                    <div className="whatinfo_body">
                        <ul>
                            <li>인증을 통해 비밀번호를 변경합니다. </li>
                            <li>임의의 비밀번호로 자동 변경된 후 이메일로 전송됩니다. </li>
                            <li> 이메일 확인후 [내정보] 페이지에서 비밀번호 변경이 가능합니다.</li>
                        </ul>   
                    </div>
                    <div className="whatinfo_btn">
                        <button type="button" className="btn" onClick={()=> {setModal(1); setCurrentEmail("")}}>이메일인증</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default UserFind;