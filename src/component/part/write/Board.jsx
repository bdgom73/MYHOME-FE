
export default function Board(props){

    const {children,style}=props;
    return(
        <div className="board_wrap" style={style}>
            {children}
        </div>
    )
}