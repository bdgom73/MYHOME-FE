
import useTitle from "../../customState/useTitle";
import Calendar from "../part/Calendar";

require('dotenv').config();

export default function Home(props){   
    useTitle(`MYDOMUS | HOME`)
    return (
        <>
        <Calendar readonly view/>
        </>
    );
}