import { useEffect,useState } from "react";
import Footer from "./Main_footer";
import Header from "./Main_header";
import Side from "./Main_side";
import "../../css/part/Main_template.scss";
export default function Main_template(props) {
    const {children} = props; 
    const [subMenu, setSubMenu] = useState(false); 

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
    return(
        <>
        <Header subMenuHandler={subMenuHandler}/>
        <div className="content_wrap">
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