export function dateRange(startDate,endDate){
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);

    if(date1 > date2){
        date1 = new Date(endDate);
        date2 = new Date(startDate);
    }
    const dates = []
    while(date1 <= date2){
        dates.push(date1.toISOString().split("T")[0]);
        date1.setDate(date1.getDate()+1);
    }

    return dates;

}

export function dateCompare(){
    
}