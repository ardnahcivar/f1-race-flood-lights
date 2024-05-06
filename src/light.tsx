import React from "react";

import "./light.css";

const Light = (props) => {
  const { state = "stop" } = props;
  let className;

  if (state === "go") {
    className = "go";
  } else if (state === "go-go") {
    className = "go-go";
  } else {
    className = "stop";
  }
  return (
    <div className="light">
      <div className={`signal ${className}`}></div>
      <div className={`signal ${className}`}></div>
    </div>
  );
};

export default Light;
