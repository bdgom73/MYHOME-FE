import { ResponsiveLine } from "@nivo/line";
import { useEffect, useRef, useState } from "react";
import { getWeatherIconUrl } from "../../../js/weather_conversion";

export default function TotalWeatherGraph(props){

    const {data, type, width, height,size,onClick}=props;
    const [graphWidth,setGraphWidth]=useState(window.innerWidth);
    useEffect(()=>{
        const twg = document.getElementById("totalWeatherGraph");
        console.log(twg.width);
        // document.getElementById("totalWeatherGraph").addEventListener('resize',()=>{
        //     setGraphWidth(document.getElementById("totalWeatherGraph").innerWidth);
        // })
    },[graphWidth])
    if(data && width){
        return(
            <div id="totalWeatherGraph" style={{width: "100%",height : height ? height : "200px",position: "relative", overflowX: size ? "hidden" : "auto", overflowY : "hidden"}}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 40, bottom: 50, left: 20 }}
                    xScale={{ type: 'point'}}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    yFormat=" >-.0f"    
                    axisTop={null}
                    width = {width ? width : (600)}
                    axisRight={null}
                    enableGridX={false}
                    enableGridY={false}
                    enablePointLabel={true}
                    enableArea={true}
                    curve={type ? type : "monotoneX"}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 13,
                        tickPadding: 20,
                        tickRotation: 0,
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={null}
                    pointSize={7}
                    pointColor={{ theme: 'grid.line.stroke' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}  
                    onClick={onClick ? onClick : ()=>{}}  
                />
            <div className="chartIcon">    
            {                  
               Array.isArray(data) && data.length > 0 ?  
               data[0].id === "hourly" ? data[0].data.map((m,i)=>{
                    return <img key={m.id+i+m.icon} src={getWeatherIconUrl(m.icon)} alt=""/>
               }) :"" :""
               
            }
            </div>
            </div>
        );
    }else if(data && !width){
        return(
            <div id="totalWeatherGraph" style={{width: "100%",height : height ? height : "200px",position: "relative", overflowX: size ? "hidden" : "auto", overflowY : "hidden"}}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 40, bottom: 100, left: 20 }}
                    xScale={{ type: 'point'}}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    yFormat=" >-.0f"    
                    axisTop={null}
                    axisRight={null}
                    enableGridX={false}
                    enableGridY={false}
                    enablePointLabel={true}
                    enableArea={true}
                    curve={type ? type : "monotoneX"}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 13,
                        tickPadding: 20,
                        tickRotation: 45,
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={null}
                    pointSize={7}
                    pointColor={{ theme: 'grid.line.stroke' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}    
                    onClick={onClick ? onClick : ()=>{}}
                />
            <div className="chartIcon">    
            {                  
               Array.isArray(data) && data.length > 0 ?  
               data[0].id === "hourly" ? data[0].data.map((m,i)=>{
                    return <img key={m.id+i+m.icon} src={getWeatherIconUrl(m.icon)} alt=""/>
               }) :"" :""
               
            }
            </div>
            </div>
        );
    }
    else{
        return <div className="error">Data가 없습니다.</div>
    }
    
}