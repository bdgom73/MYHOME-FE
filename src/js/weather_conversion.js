const week = ["일","월","화","수","목","금","토"];

// openweathermap의 icon값을 이미지 url로 변경
export function getWeatherIconUrl(icon){
    return `http://openweathermap.org/img/w/${icon}.png`;
}

// 절대값 켈빈온도를 섭씨온도로 변환 
export function KtoC(k){
    const _k = parseFloat(k);
    return Math.round(k-273.15);
}

// 타임스탬프 형식 날짜데이터를 기본날짜데이터로 변경 
export function timestampToDate(timestamp){
    const _date = new Date(timestamp*1000);
    const Y = _date.getFullYear();
    const M = (_date.getMonth()+1) < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1;
    const D = (_date.getDate()) < 10 ? "0"+_date.getDate() : _date.getDate();
    const H = (_date.getHours()) < 10 ? "0"+_date.getHours() : _date.getHours();
    const m = (_date.getMinutes()) < 10 ? "0"+_date.getMinutes() : _date.getMinutes();
    const S = (_date.getSeconds()) < 10 ? "0"+_date.getSeconds() : _date.getSeconds();
    const K = week[_date.getDay()];
    return Y+"-"+M+"-"+D+" "+H+":"+m;
}
export function timestampToDate2(timestamp){
    const _date = new Date(timestamp*1000);
    const Y = _date.getFullYear();
    const M = (_date.getMonth()+1) < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1;
    const D = (_date.getDate()) < 10 ? "0"+_date.getDate() : _date.getDate();
    const H = (_date.getHours()) < 10 ? "0"+_date.getHours() : _date.getHours();
    const m = (_date.getMinutes()) < 10 ? "0"+_date.getMinutes() : _date.getMinutes();
    const S = (_date.getSeconds()) < 10 ? "0"+_date.getSeconds() : _date.getSeconds();
    const K = week[_date.getDay()];
    return M+"/"+D+" ("+K+")";
}
export function timestampToHour(timestamp){
    const _date = new Date(timestamp*1000); 
    const H =  _date.getHours();
    return H;
}
export function timestampToMonthAndDateAndHour(timestamp){
    const _date = new Date(timestamp*1000);
    const Y = _date.getFullYear();
    const M = (_date.getMonth()+1) < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1;
    const D = (_date.getDate()) < 10 ? "0"+_date.getDate() : _date.getDate();
    const H = (_date.getHours()) < 10 ? "0"+_date.getHours() : _date.getHours();
    const m = (_date.getMinutes()) < 10 ? "0"+_date.getMinutes() : _date.getMinutes();
    const S = (_date.getSeconds()) < 10 ? "0"+_date.getSeconds() : _date.getSeconds();
    const K = week[_date.getDay()];
    return M+"/"+D+" "+H;
}
export function timestampToMonthAndDate(timestamp){
    const _date = new Date(timestamp*1000);
    const Y = _date.getFullYear();
    const M =  _date.getMonth()+1;
    const D =  _date.getDate();
    const H = _date.getHours();
    const m =  _date.getMinutes();
    const S = _date.getSeconds();
    const K = week[_date.getDay()];
    return M+"-"+D;
}

export function hourFormat(_date){
    const Y = _date.getFullYear();
    const M = (_date.getMonth()+1) < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1;
    const D = (_date.getDate()) < 10 ? "0"+_date.getDate() : _date.getDate();
    const H = (_date.getHours()) < 10 ? "0"+_date.getHours() : _date.getHours();
    const m = (_date.getMinutes()) < 10 ? "0"+_date.getMinutes() : _date.getMinutes();
    const S = (_date.getSeconds()) < 10 ? "0"+_date.getSeconds() : _date.getSeconds();

    return Y+M+D;
}
export function timeFormat(timestamp){
    const _date = new Date(timestamp*1000);
    return  _date.getHours();
}