import React from "react";
import { read, utils, writeFile } from "xlsx";
import { format, addDays } from "date-fns";
import { useState } from "react";
import "../Assets/scss/loading.scss";
const Loading = (props) => {
  return (
    <div className="overlay">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
export default Loading;
