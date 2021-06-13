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

// *로 내용 치환
export function maskingText(text,type){
    if(type === "email"){
        if(text.indexOf("@") === -1) throw new Error("이메일 형식이 아닙니다");
        let extext = text.split("@");
        let originName = extext[0].split('');
        originName.forEach(function(name, i) {
            if (i === 0 || i === originName.length ) return;
            originName[i] = '*';
          });
          let joinName = originName.join();
          return joinName.replace(/,/g, '')+"@"+extext[1];
    }else{
        if (text.length > 2) {
            let originName = text.split('');
            originName.forEach(function(name, i) {
              if (i === 0 || i === originName.length - 1) return;
              originName[i] = '*';
            });
            let joinName = originName.join();
            return joinName.replace(/,/g, '');
        } else {
        let pattern = /.$/; // 정규식
        return text.replace(pattern, '*');
        }
    }
   
}