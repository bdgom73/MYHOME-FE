import { ResponsiveLine  } from '@nivo/line'
import { useState } from 'react';
import cityJson from '../../../json/city_use.json';
import { hourFormat, timestampToHour } from '../../../js/weather_conversion';
import axios from 'axios';

export default function WeatherGraph({data, margin, onClick, height}){

  
    return(
        <div style={{height: height ? height : "200px"}}>
            <ResponsiveLine
                data={data}
                margin={margin ? margin : { top: 10, right: 10, bottom: 10, left: 10 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                yFormat=" >-.0f"
                axisTop={null}
                axisRight={null}
                enableGridX={false}
                enableGridY={false}
                curve="monotoneX"
                axisBottom={ {
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,      
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                enableArea={true}
                axisLeft={null}
                enablePointLabel={true}
                pointSize={7}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                onClick={onClick ? onClick : ()=>{}}/>
        </div>
    );
}