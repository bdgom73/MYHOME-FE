
export default function NotFound(props){

    const wrapStyle={
        width:"100%",
        height : "100vh",
        display:"flex",
        alignItems : "center",
        justifyContent : "center",    
        backgroundColor : "#eee"
    }

    return(
        <>
        <div className="not_found_wrap" style={wrapStyle}>
            <div className="not_found" style={{
                width : "100%",
                maxWidth : "500px", 
                height : "500px" ,
                textAlign:"center",
                padding:"10px", 
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
                backgroundColor : "#fff",
                borderRadius:"10px",
            }}>
                <div>
                <span className="404" style={{
                    fontSize : "100px",
                    fontWeight : "bold",
                    display:"block"
                }}>4<span style={{color : "#8f5dd2"}}>0</span>4</span>
                <span className="error_msg" style={{
                    fontSize : "20px",
                    fontWeight : "bold",
                }}>NOT FOUND</span>
                </div>
                <span className="error_explan" style={{
                    display:"block"
                }}>
                    해당 URL의 페이지를 찾을 수 없습니다.
                    URL을 확인해주세요.
                </span>
                <button className="btn" onClick={()=>{window.location.href="/"}} style={{
                    border : 0,
                    borderRadius:"10px",
                    padding:"10px",
                    marginTop:"10px"
                }}>메인페이지</button>
            </div>
        </div>
        </>
    )
}