import React, { useState } from 'react';
import Calendar from 'react-calendar';

export default function CalendarPicker(props){

    const [value, onChange] = useState(new Date());

    return (
      <div>
        <Calendar
          onChange={onChange}
          value={value}
          onDrillUp={(e)=>{console.log(e)}}
        />
      </div>
    );
}