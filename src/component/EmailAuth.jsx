import SubLoading from "./sub_loading";

export default function EmailAuth(props){

    return(
        <>
        <div className="auth_wrap" style={{position:"relative"}}>
        <h2 style={{
            position:"absolute",
            top:"20%",
            left:"50%",
            transform:"translate(-50%,0)",
            textAlign:"center",
            width : "100%"
        }}>이메일 인증 중입니다.</h2>
        <SubLoading/>
        <p>
            이메일 인증이 끝나면 
        </p>
        </div>
        </>
    );
} 