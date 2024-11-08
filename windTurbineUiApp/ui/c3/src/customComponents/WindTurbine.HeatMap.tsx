import HeatMap from 'react-heatmap-grid';
import React, { useEffect, useState } from 'react';
import DateTime from '@c3/ui/UiSdlDateTime';
import axios from 'axios';
import { Popup } from 'semantic-ui-react';

const WindTurbineHeatMap = () => {
  const [data, setData] = useState(undefined);

  useEffect(function () {
    const reqData = async () => {
      const url = `api/8/WindTurbineEvent/fetch`;
      const response = await axios.post(url, ['WindTurbineEvent', {limit: 100}]);
      return response.data.objs;
    }

    reqData().then((fetchResult) => setData(fetchResult));
  }, [])

  if (data) {
    const useThis = data.filter((dataItem) =>  dataItem.event_code === 'SYSTEM_REBOOT');
    const timestamps = useThis.map((dataItem) => dataItem.end).sort();
    
    const yLabels = [];
    
    let start = new DateTime(timestamps[0]).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0);
    const xLabels = [start.toString('MM-dd')];
    const xLabelDisplay = [true];
    let currBool = false;
    while (start.toString() < timestamps[timestamps.length - 1]){
      start = start.plusDays(1);
      xLabels.push(start.toString('MM-dd'));
      xLabelDisplay.push(currBool);
      currBool = !currBool;
    }

    const everythingMap = {};
    useThis.forEach(item => {
      if (everythingMap[item.turbineId.id]) {
        if (everythingMap[item.turbineId.id][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')]) {
          everythingMap[item.turbineId.id][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')] += 1;
        } else {
          everythingMap[item.turbineId.id][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')] = 1;
        }
      } else {
        everythingMap[item.turbineId.id] = {};
        everythingMap[item.turbineId.id][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')] = 1;
      }
    });

    const finalData = [];

    for (let i = 0; i < Object.keys(everythingMap).length; i++) {
      const turbine = Object.keys(everythingMap)[i];
      yLabels.push('Turbine: ' + turbine);
      const turbineData = [];
      for (let j = 0; j < xLabels.length; j++) {
        turbineData.push(everythingMap[turbine][xLabels[j]] ?? 0);
      }
      finalData.push(turbineData);
    }

    const handleClick = (x, y) => {
      console.log(xLabels[x], yLabels[y]);
    }

    const renderCell = (value,x,y) => {
      return (
        <Popup content={<div> {`${value} events for ${y} on ${x}`} </div> } disabled={value == 0} trigger={(<div style={{width: '100%', height: '100%', marginTop: '-8.10811px'}}> </div>)}/>
      )
    }

    // const data = [];
    // const xLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // const yLabels = ['WindTurbine1', 'WindTurbine2', 'WindTurbine3', 'WindTurbine4'];
    return <div>
        <h2> Heat Map of System Reboot Events </h2>
        <HeatMap xLabelWidth={100} yLabelWidth={100} onClick={handleClick} xLabelsVisibility={xLabelDisplay} cellStyle={(background, value, min, max, data, x, y) => ({border: 'var(--c3-style-colorBorderWeak) solid 1px', background: `rgba(255, 0, 0, ${1 - (max - value) / (max - min)})`})} xLabels={xLabels} yLabels={yLabels} data={finalData} cellRender={renderCell} />
      </div>
  }
  return <div> Loading... </div>;
  
}

export default WindTurbineHeatMap;