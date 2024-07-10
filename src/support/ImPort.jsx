import React from "react";
import { read, utils, writeFile } from "xlsx";
import { format, addDays } from "date-fns";
import { useState } from "react";

const ImPort = (props) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [data, setData] = useState([]);
  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;

    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;

    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  };

  const handleImport = (event) => {
    const files = event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        const ws = wb.Sheets[sheets[0]];
        var range = utils.decode_range(ws["!ref"]);
        range.s.r = props.row;
        ws["!ref"] = utils.encode_range(range);
        if (sheets.length) {
          const rows = utils
            .sheet_to_json(ws, {
              header: props.head,
              defval: "",
            })
            .map((row) => {
              Object.keys(row).forEach((key) => {
                if (!isNaN(row[key]) && row[key] > 25569) {
                  // Kiểm tra nếu là số ngày Excel
                  row[key] = format(
                    excelDateToJSDate(row[key]),
                    "dd/MM/yyyy HH:mm"
                  );
                }
              });
              return row;
            });
          props.getdata(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = () => {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);

    // **Add bold headers**
    const headers = props.header.map((header) => ({
      v: header,
      s: {
        font: {
          bold: true,
        },
      },
    }));
    utils.sheet_add_aoa(ws, [headers]);

    utils.sheet_add_json(ws, props.data, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, `${props.name}.xlsx`);
  };

  return (
    <div className="row">
      <div
        className="col col-lg-3 col-sm-6 col-md-6"
        style={{ textAlign: "left" }}
      >
        <div className="custom-file">
          <input
            type="file"
            name="file"
            hidden
            className="custom-file-input"
            id="inputGroupFile"
            required
            onChange={handleImport}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <label
            className="custom-file-label import-file-label btn btn-lg btn-primary"
            htmlFor="inputGroupFile"
          >
            Import <i className="fa fa-file-import"></i>
          </label>
        </div>
      </div>
      <div className="col col-md-6 col-sm-6 col-md-3">
        <button
          onClick={handleExport}
          className="btn btn-lg btn-primary float-right"
        >
          Export <i className="fa fa-download"></i>
        </button>
      </div>
    </div>
  );
};

export default ImPort;
