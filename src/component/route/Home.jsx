
import "../../css/route/home.scss";
import Calendar from "../part/Calendar";

require('dotenv').config();

export default function Home(props){   
    return (
        <>
        <Calendar readonly view/>
        </>
    );
}