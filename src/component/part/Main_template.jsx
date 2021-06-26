import { useEffect,useState } from "react";
import Footer from "./Main_footer";
import Header from "./Main_header";
import Side from "./Main_side";

import useMember from "../../customState/useMember";
import { useHistory } from "react-router";
export default function Main_template(props) {
    const {children, access} = props; 
    const [subMenu, setSubMenu] = useState(false); 

    const {logined,SESSION_UID} = useMember();
    const history = useHistory();
    // 서브메뉴 ON/OFF
    const subMenuHandler = ()=>{
        setSubMenu(!subMenu);   
        const body = document.body;
        if(subMenu){
            body.style.overflowY="hidden";
            body.style.backgroundColor="rgba(0,0,0,0.55)";
        }else{
            body.style.overflowY="auto";
            body.style.backgroundColor="#fff";
        } 
    }
    useEffect(()=>{
        const body = document.body;
        if(subMenu){
            body.style.overflowY="hidden";
            body.style.backgroundColor="rgba(0,0,0,0.55)";
        }else{
            body.style.overflowY="auto";
            body.style.backgroundColor="#fff";
        }
    },[subMenu])

    useEffect(()=>{
        if(access === "user"){
            if(!logined && !SESSION_UID){    
                history.push("/login");
            }
        }else if(access === "non-user"){
            if(logined && SESSION_UID) {
                history.push("/");
            }
        }
        
        
    })
    return(
        <>
        <Header subMenuHandler={subMenuHandler} talk_header={props.talk_header ? true : false}/>
        <div className="content_wrap" >
            {
                subMenu ? (
                    <div className="side_menu" >
                        <Side subMenuHandler={subMenuHandler}/>
                        <div className="side_sh" onClick={subMenuHandler}></div>
                    </div>
                ) : (<></>)
            } 
            <main>
            {children}
            </main>   
        </div>
        <Footer/>
        </>
    );
}