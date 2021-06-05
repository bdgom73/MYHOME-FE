

let db;
function openDB() {
    try{
        db = openDatabase('test', '1.0', 'weather', 10 * 1024 * 1024);
        db.transaction((tx)=>{
            tx.executeSql(
                `CREATE TABLE MESSAGE (id INTEGER  Primary key, message VARCHAR(150), type VARCHAR(50))`
            );
        });
    }catch(e){}
    
}

openDB();

export function findById(tableName,id,cb,error) {
    if(db){
        try{
        db.transaction(tx=>{
            tx.executeSql(
                `SELECT * FROM ${tableName} where id = ?`,
                [id],(tx,result)=>{   
                    if(cb) cb(result.rows[0]);
                },(tx,e)=>{
                    console.log(e)
                    if(error) error(e);
                }
            )
        })
        }
        catch(e){}
    }
}

export function insert(tableName,columnName,rows,cb,err){
    if(db){
    try{
        let sql = `INSERT into ${tableName} (`;
        for(let i = 0; i < (columnName.length) ; i++){
            sql = sql + `${columnName[i]},`
        }
        sql = sql.substr(0, (sql.length-1));
        sql = sql + ") VALUES(";
        let arg = []
        for(let i = 0; i < (rows.length) ; i++){
             sql = sql+"?,";
        }
        sql = sql.substr(0, (sql.length-1));
        sql = sql + ")";
        for(let i = 0; i < rows.length ; i++){
            arg.push(rows[i]);
        }
        console.log(sql);
        db.transaction((tx)=>{
            tx.executeSql( 
                sql ,arg ,(tx,result)=>{
                const id = result.insertId;
                if(cb) cb(result,id);
            },(tx,error)=>{
                if(err) err(error);
                console.log(error);
            });
        }) 
    }catch(e){}
}
   
}

export function update(tableName,updateData,condition,cb,error) {
    if(db){
    try{
        let sql = `UPDATE ${tableName} set `
        for(var key in updateData){
            sql = sql + `${key} = '${updateData[key]}',`
        }
        sql = sql.substr(0, (sql.length-1));
        if(condition){
            sql = sql +` ${condition}`
        }
        db.transaction(tx=>{
            tx.executeSql(sql,
                [],(tx,result,_)=>{
                    if(cb) cb(tx,result);
                },(tx,e)=>{
                    console.log(e);
                    if(error) error(tx,error)
                }
            )
        })
    }catch(e){}
    }
  
}

export function findTableList(cb) {
    if(db){
    try{
        db.transaction(tx=>{
            tx.executeSql(
                `SELECT * FROM TABLES`,[], (tx,result)=>{
                    let rowValue = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        rowValue.push(result.rows.item(i));
                    }     
                    if(cb) cb(rowValue);
                }
            )
        })
    }catch(e){}
    }
}
export function DeleteTable(tableName,cb,error) {
    if(db){
    let sql = `DROP TABLE ${tableName}`
    try{
        db.transaction(tx=>{
            tx.executeSql(sql,
            [],(tx,result)=>{
                DeleteByTableName(tableName);
                if(cb) cb(result);
            },(tx,e)=>{
                if(error) error(e);
            })
        })
    }catch(e){}
    } 
}
export function DeleteByTableName(tableName,cb,error) {
    if(db){
    let sql = `DELETE FROM TABLES WHERE tableName = "${tableName}"`
    try{
        db.transaction(tx=>{
            tx.executeSql(sql,
            [],(tx,result)=>{
                if(cb) cb(result);
            },(tx,e)=>{
                if(error) error(e);
            })
        })
    }catch(e){}
    }
}
export function DeleteById(tableName,deleteId,cb,error) {
    if(db){
    let sql = `DELETE FROM ${tableName} WHERE id IN (`
    for(let i = 0; i<deleteId.length;i++){
        sql = sql + deleteId[i] +","
    } 
    sql = sql.substr(0, (sql.length-1));
    sql = sql + ")";
    try{
        db.transaction(tx=>{
            tx.executeSql(sql,
            [],(tx,result)=>{
                if(cb) cb(result);
            },(tx,e)=>{
                if(error) error(e);
            })
        })
    }catch(e){}
    }
}

export function DefaultTableColumnName(b,cb,error) {
    if(db){
    let sql = `SELECT key FROM TABLES WHERE tableName = ?`
    try{
        db.transaction(tx=>{
            tx.executeSql(sql,
            [b],(tx,result)=>{
                if(cb) cb(result.rows[0]);
            },(tx,e)=>{
                if(error) error(e);
            })
        })
    }catch(e){}
    }
}