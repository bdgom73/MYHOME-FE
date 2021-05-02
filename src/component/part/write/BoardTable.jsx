import "../../../css/write/boardTable.scss";
export default function BoardTable(props){

    const { 
        columnData ,
        data,
        tableClassName,
        columnDataKey,
     } = props;

   
    
    const dataField = ()=>{
        const key= Object.keys(data[0]);
        return key;
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
                    data.map((d,i)=>{
                        const key = dataField();
                        return (
                            <tr key={i+tableClassName+"tables"+i}>
                                {
                                    columnDataKey ? columnDataKey.map((k,j)=>{
                                        return (
                                            <th key={k+tableClassName+i+j}>{d[k]}</th>
                                        )
                                    }) : key.map((k,j)=>{
                                        return (
                                            <th key={k+tableClassName+i+j}>{d[k]}</th>
                                        )
                                    })
                                }
                               
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </>
    )
}