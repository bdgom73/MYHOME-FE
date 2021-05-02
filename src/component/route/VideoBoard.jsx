import BoardTable from "../part/write/BoardTable";

export default function VideoBoard(){

    
    return(
        <BoardTable
            columnData={["NO","이름","나이"]}
            columnDataKey={["id","name","age"]}
            data={[
                {
                    id:"1",
                    name : "김미미",
                    age : "22",
                    self : "여"
                },
                {
                    id:"2",
                    name : "이무기",
                    age : "35",
                    self : "남"
                },
                {
                    id:"3",
                    name : "박땡땡",
                    age : "66",
                    self : "남"
                },
                {
                    id:"4",
                    name : "손자병",
                    age : "29",
                    self : "여"
                }
            ]}
        />
    )
}