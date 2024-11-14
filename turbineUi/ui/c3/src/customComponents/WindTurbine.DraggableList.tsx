import React, { useState, useEffect } from "react";
import axios from "axios";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

const SortableItem = SortableElement(({ value }) => <li>{value}</li>);

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </ul>
  );
});

const List = () => {
  const [turbines, setTurbines] = useState([]);
  useEffect(function () {
    const reqData = async () => {
      const turbines = await axios.post(`api/8/Turbine/fetch`, [
        "Turbine",
        { include: "name" },
      ]);

      return turbines.data.objs.map((turbine) => turbine.name);
    };

    reqData().then((fetchResult) => {
      setTurbines(fetchResult);
    });
  }, []);

  const sortEnd = ({ oldIndex, newIndex }) => {
    setTurbines(arrayMoveImmutable(turbines, oldIndex, newIndex));
  };

  return <SortableList items={turbines} onSortEnd={sortEnd} />;
};

export default List;
