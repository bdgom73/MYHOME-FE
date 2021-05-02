
export default function Board(props){

    const {children}=props;

    console.log(children)
    return(
        <div className="board_wrap">
            {children}
        </div>
    )
}