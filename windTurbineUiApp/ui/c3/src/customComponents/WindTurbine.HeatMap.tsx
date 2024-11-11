import HeatMap from 'react-heatmap-grid';
import React, { useEffect, useState } from 'react';
import DateTime from '@c3/ui/UiSdlDateTime';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Popup } from 'semantic-ui-react';
import { getConfigFromApplicationState } from '@c3/ui/UiSdlApplicationState';

const WindTurbineHeatMap = () => {
  const [data, setData] = useState(undefined);
  const [turbines, setTurbines] = useState(undefined);
  const turbineFilter = useSelector((state) => {
    return getConfigFromApplicationState('WindTurbine.ApplicationState', state, ['turbineFilter']);
  });

  const eventFilter = useSelector((state) => {
    return getConfigFromApplicationState('WindTurbine.ApplicationState', state, ['eventFilter']);
  });

  useEffect(function () {
    const reqData = async () => {
      const url = `api/8/WindTurbineEvent/fetch`;
      const turbines = await axios.post(`api/8/WindTurbine/fetch`, ['WindTurbine', {filter: turbineFilter}]);
      const turbineIds = turbines.data.objs.map((turbine) => turbine.id);
      const response = await axios.post(url, ['WindTurbineEvent', {filter: `intersects(turbineId, ${JSON.stringify(turbineIds)}) && ${eventFilter ?? '1 == 1'}`}]);
      
      return {events: response.data.objs, turbines: turbines.data.objs};
    }

    reqData().then((fetchResult) => {
      setData(fetchResult.events);
      setTurbines(fetchResult.turbines);
    });
  }, [turbineFilter, eventFilter])

  if (data) {
    const useThis = data;
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
      const name = turbines?.find((turbine) => turbine.id === item.turbineId.id)?.name
      if (everythingMap[name]) {
        if (everythingMap[name][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')]) {
          everythingMap[name][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')] += 1;
        } else {
          everythingMap[name][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')] = 1;
        }
      } else {
        everythingMap[name] = {};
        everythingMap[name][new DateTime(item.end).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).toString('MM-dd')] = 1;
      }
    });

    const finalData = [];

    for (let i = 0; i < Object.keys(everythingMap).length; i++) {
      const turbine = Object.keys(everythingMap)[i];
      yLabels.push(turbine);
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

    return <div>
        <h2> Heat Map of {eventFilter && eventFilter !== '1 == 1' ? eventFilter.substring(eventFilter.indexOf('"'), eventFilter.lastIndexOf('"')).replaceAll('"', '').replaceAll(',', ' and ') + ' ' : 'All '}Events </h2>
        <HeatMap yLabelWidth={150} xLabelWidth={0} onClick={handleClick} xLabelsVisibility={xLabelDisplay} cellStyle={(background, value, min, max, data, x, y) => ({border: 'var(--c3-style-colorBorderWeak) solid 1px', background: `rgba(255, 0, 0, ${1 - (max - value) / (max - min)})`})} xLabels={xLabels} yLabels={yLabels} data={finalData} cellRender={renderCell} />
      </div>
  }
  return <div> Loading... </div>;
  
}

export default WindTurbineHeatMap;