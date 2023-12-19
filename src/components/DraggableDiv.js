import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DraggableDiv = (props) => {

  const startingCoordinates = props.startingCoordinates || {x: "30", y:"30%"}
  const fillColor = props.fillColor || "white"

  const title = props.label || "Process Step" 
  const titleColor = props.titleColor || "black"

  const detail1 = props.detail1 || "Detail 1" 
  const detail2 = props.detail2 || "Detail 2" 
  const detail3 = props.detail3 || "Detail 3" 

  const detail1Color = props.detail1Color || "gray"
  const detail2Color = props.detail2Color || "gray"
  const detail3Color = props.detail2Color || "gray"

  const detail1Weight = props.detail1Weight || "normal"
  const detail2Weight = props.detail2Weight || "normal"
  const detail3Weight = props.detail2Weight || "normal"
  

  const [position, setPosition] = useState({ x: startingCoordinates.x, y: startingCoordinates.y });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const divStyle={
    height: 100,
    width: 150,
    position: 'absolute',
    top: `${position.y}px`,
    left: `${position.x}px`,
    cursor: dragging ? 'grabbing' : 'grab',
    padding: 10,
    borderRadius: 10,
    fillColor: fillColor
  }

  const titleStyle = {
    fontSize: 14,
    fontWeight: "bold",
    color: titleColor
  }

  const detailStyle1 = {
    fontSize: 12,
    fontWeight: detail1Weight,
    color: detail1Color

  }

  const detailStyle2 = {
    fontSize: 12,
    fontWeight: detail2Weight,
    color: detail2Color
  }

  const detailStyle3 = {
    fontSize: 12,
    fontWeight: detail3Weight,
    color: detail3Color
  }

  return (
        <div
            className="d-flex flex-column align-content-center draggable border border-2 shadow-sm"
            style={divStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
        <div style={titleStyle}>{title}</div>
        <div style={detailStyle1}>{detail1}</div>
        <div style={detailStyle2}>{detail2}</div>
        <div style={detailStyle3}>{detail3}</div>
        </div>
  );
};

export default DraggableDiv;
