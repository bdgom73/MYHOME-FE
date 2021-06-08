export default function InfoDetail(props){
    return(
        <div className="info_detail" id={props.id}>
            {props.children}
        </div>
    )
}