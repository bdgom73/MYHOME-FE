import { useEffect } from "react";
import { useHistory } from "react-router";
import "../../../css/write/boardTable.scss";
export default function BoardTable(props){

    const { 
        columnData ,
        data,
        tableClassName,
        columnDataKey,
        boardName,
        linkColumn,
     } = props;

    const history = useHistory();
   
    
    const dataField = ()=>{
        const key= Object.keys(data[0]);
        return key;
    }
    const onClickHandler=(id)=>{
        history.push(`/${boardName ? boardName : "free"}/read?board_id=${id}`)
    }
    return(
        <>
        <table className={tableClassName ? tableClassName : "table"}>
            <thead>
                <tr>
                {
                    columnData.map((c,i)=>{
                        return <th key={c+i}>{c}</th>
                    })
                }
                </tr>
            </thead>
            <tbody>
                {
                    data ?
                    data.map((d,i)=>{
                        const key = dataField();
                        return (
                            <tr key={i+tableClassName+"tables"+i} >
                                {
                                    columnDataKey ? columnDataKey.map((k,j)=>{  
                                        if(linkColumn){
                                            return (
                                                <td key={k+tableClassName+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(d.id)}:()=>{}}>{d[k]}</td>
                                            )
                                        }else{
                                            return (
                                                <td key={k+tableClassName+i+j} onClick={()=>{onClickHandler(d.id)}}>{d[k]}</td>
                                            )
                                        }
                                      
                                        
                                      
                                    }) : key.map((k,j)=>{
                                        if(linkColumn){
                                            return (
                                                <td key={k+tableClassName+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(d.id)}:()=>{}}>{d[k]}</td>
                                            )
                                        }else{
                                            return (
                                                <td key={k+tableClassName+i+j} onClick={()=>{onClickHandler(d.id)}}>{d[k]}</td>
                                            )
                                        }
                                    })
                                }
                               
                            </tr>
                        )
                    }) : <></>
                }
            </tbody>
        </table>
        </>
    )
}