import HeatMap from "react-heatmap-grid";
import React, { useEffect, useState } from "react";
import DateTime from "@c3/ui/UiSdlDateTime";
import axios from "axios";
import { useSelector } from "react-redux";
import { Popup } from "semantic-ui-react";
import { getConfigFromApplicationState } from "@c3/ui/UiSdlApplicationState";

const WindTurbineHeatMap = () => {
  const [data, setData] = useState(undefined);
  const [turbines, setTurbines] = useState(undefined);

  // Used for making filter
  const turbineFilter = useSelector((state) => {
    return getConfigFromApplicationState(
      "WindTurbine.ApplicationState",
      state,
      ["turbineFilter"]
    );
  });

  const eventFilter = useSelector((state) => {
    return getConfigFromApplicationState(
      "WindTurbine.ApplicationState",
      state,
      ["eventFilter"]
    );
  });

  // useEffect for data fetching
  useEffect(
    function () {
      const reqData = async () => {
        const url = `api/8/TurbineEvent/fetch`;
        const turbines = await axios.post(`api/8/Turbine/fetch`, [
          "Turbine",
          { filter: turbineFilter },
        ]);
        // After fetching Turbines, use only the turbines we get back to fetch TurbineEvents
        const turbineIds = turbines.data.objs?.map((turbine) => turbine.id) || [];
        const response = await axios.post(url, [
          "TurbineEvent",
          {
            filter: `intersects(windturbine, ${JSON.stringify(
              turbineIds
            )}) && ${eventFilter ?? "1 == 1"}`,
          },
        ]);

        return { events: response.data.objs, turbines: turbines.data.objs };
      };

      reqData().then((fetchResult) => {
        setData(fetchResult.events);
        setTurbines(fetchResult.turbines);
      });
    },
    [turbineFilter, eventFilter]
  );

  if (data) {
    const useThis = data;
    const timestamps = useThis.map((dataItem) => dataItem.time).sort();
    // do nothing/specify no data if there's no data points
    if (timestamps.length) {
      const yLabels = [];

      let start = new DateTime(timestamps[0])
        .withHourOfDay(0)
        .withMinuteOfHour(0)
        .withSecondOfMinute(0)
        .withMillisOfSecond(0); // For all dates in this "transform", we are setting to midnight through UiSdlDateTime APIs to have a consistent "date" interval
      const xLabels = [start.toString("MM-dd")];
      const xLabelDisplay = [true];
      let currBool = false;

      // generate a list of labels for the x-axis at a single day interval starting at the first date and ending at the last day that we have data for
      while (start.toString() < timestamps[timestamps.length - 1]) {
        start = start.plusDays(1);
        xLabels.push(start.toString("MM-dd"));
        // xLabelDisplay/currBool are just for visuals of not being overcrowded -- only show every other day.
        xLabelDisplay.push(currBool);
        currBool = !currBool;
      }

      /*
       * For each turbine event, add it to a map specifying the time that it was and the turbine it belongs to.
       *
       * map is of shape:
       * {
       *  turbineName: {
       *    date as a string of format MM-dd: numberOfEvents
       *  }
       * }
       */
      const everythingMap = {};
      useThis.forEach((item) => {
        const name = turbines?.find(
          (turbine) => turbine.id === item.windturbine.id
        )?.name;
        const date = new DateTime(item.time)
          .withHourOfDay(0)
          .withMinuteOfHour(0)
          .withSecondOfMinute(0)
          .withMillisOfSecond(0)
          .toString("MM-dd");
        if (everythingMap[name]) {
          if (everythingMap[name][date]) {
            everythingMap[name][date] += 1;
          } else {
            everythingMap[name][date] = 1;
          }
        } else {
          everythingMap[name] = {};
          everythingMap[name][date] = 1;
        }
      });

      const finalData = [];

      /*
       * Heat map component requires an array of strings for xLabels, an array of strings for yLabels, and a nested array of "rows" (each row is the same length as xLabels where each item represents the number of events on that day) of the heat map for data
       * We already have the xLabels, here we create the yLabels as the turbine names as well as the data array from the `everythingMap` and xLabels array.
       */
      for (let i = 0; i < Object.keys(everythingMap).length; i++) {
        const turbine = Object.keys(everythingMap)[i];
        yLabels.push(turbine);
        const turbineData = [];
        for (let j = 0; j < xLabels.length; j++) {
          turbineData.push(everythingMap[turbine][xLabels[j]] ?? 0);
        }
        finalData.push(turbineData);
      }

      // handle click currently does nothing
      const handleClick = (x, y) => {
        console.log(xLabels[x], yLabels[y]);
      };

      // Custom render cell allows us to have a custom tooltip
      const renderCell = (value, x, y) => {
        return (
          <Popup
            content={<div> {`${value} events for ${y} on ${x}`} </div>}
            disabled={value == 0}
            trigger={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  marginTop: "-8.10811px",
                }}
              >
                {" "}
              </div>
            }
          />
        );
      };

      return (
        <div>
          <h2>
            {" "}
            Heat Map of{" "}
            {/* Here we are just customizing the title to make it match the filtered events */}
            {eventFilter && eventFilter !== "1 == 1"
              ? eventFilter
                  .substring(
                    eventFilter.indexOf('"'),
                    eventFilter.lastIndexOf('"')
                  )
                  .replaceAll('"', "")
                  .replaceAll(",", " and ") + " "
              : "All "}
            Events{" "}
          </h2>
          <HeatMap
            yLabelWidth={150}
            xLabelWidth={0}
            onClick={handleClick}
            xLabelsVisibility={xLabelDisplay}
            // custom style allows us to have borders and specify background color.
            cellStyle={(background, value, min, max, data, x, y) => ({
              border: "var(--c3-style-colorBorderWeak) solid 1px",
              background: `rgba(255, 0, 0, ${1 - (max - value) / (max - min)})`,
            })}
            xLabels={xLabels}
            yLabels={yLabels}
            data={finalData}
            cellRender={renderCell}
          />
        </div>
      );
    } else {
      return <div> No data found. </div>;
    }
  }
  return <div> Loading... </div>;
};

export default WindTurbineHeatMap;
