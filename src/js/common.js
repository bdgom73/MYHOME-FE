/**
 * byte 용량을 환산하여 반환
 * 용량의 크기에 따라 MB, KB, byte 단위로 환산함
 * @param fileSize  byte 값
 * @param fixed     환산된 용량의 소수점 자릿수
 * @returns {String}
 */
export function byte(fileSize, fixed) {
    var str

    //MB 단위 이상일때 MB 단위로 환산
    if (fileSize >= 1024 * 1024) {
        fileSize = fileSize / (1024 * 1024);
        let fs = fileSize = (fixed === undefined) ? fileSize.toFixed(2) : fileSize.toFixed(fixed);
        if(fs.indexOf(".") != -1){
            if(fs.split(".")[0].length >=4){
                fileSize = fileSize / 1024;  
                fileSize = (fixed === undefined) ? fileSize.toFixed(2) : fileSize.toFixed(fixed);
                str = (fileSize) + ' GB';
            }else{
                str = (fs) + ' MB';
            }
        }         
    }
    //KB 단위 이상일때 KB 단위로 환산
    else if (fileSize >= 1024) {
        fileSize = fileSize / 1024;
        console.log(fileSize)
        fileSize = (fixed === undefined) ? fileSize.toFixed(2) : fileSize.toFixed(fixed);
        str = (fileSize) + ' KB';
    }
    //KB 단위보다 작을때 byte 단위로 환산
    else {
        fileSize = (fixed === undefined) ? fileSize.toFixed(2) : fileSize.toFixed(fixed);
        str = (fileSize) + ' byte';
    }
    return str;
}

function commaNum(fileSize){
    var len, point, str; 
    fileSize = fileSize.indexOf(".",0) != -1 ? fileSize.split(".") : fileSize ;
    fileSize = fileSize + ""; 
    point = fileSize.length % 3 ;
    len = fileSize.length; 
   
    str = fileSize.substring(0, point); 
    while (point < len) { 
        if (str != "") str += ","; 
        str += fileSize.substring(point, point + 3); 
        point += 3; 
    } 
     
    return str;

}