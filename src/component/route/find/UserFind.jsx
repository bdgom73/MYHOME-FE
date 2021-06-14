
const UserFind = (props)=>{

    return(
        <>
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
                        <button type="button" className="btn">이메일로 찾기</button>
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
                        <button type="button" className="btn">이메일인증</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default UserFind;