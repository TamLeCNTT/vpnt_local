import React from "react";
import { read, utils, writeFile } from "xlsx";
import { format, addDays } from "date-fns";

const ImportNhienlieu = (props) => {
  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        const ws = wb.Sheets[sheets[0]];
        var range = utils.decode_range(ws["!ref"]);
        range.s.r = props.row; // <-- zero-indexed, so setting to 1 will skip row 3
        ws["!ref"] = utils.encode_range(range);
        // ws['!ref'] = "A2:C3"
        if (sheets.length) {
          const rows = utils.sheet_to_json(ws, {
            header: props.head,
            defval: "",
          });
          props.getdata(rows);

          // setMovies(rows)
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = () => {
    console.log(props.data);
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, props.header);
    utils.sheet_add_json(ws, props.data, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, props.name + ".xlsx");
  };

  return (
    <>
      <div className="row">
        <div
          className="col col-lg-3  col-sm-6 col-md-2 "
         
        >
          <div className="custom-file">
            <input
              type="file"
              name="file"
              hidden={true}
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
              import <i className="fa fa-file-import"></i>
            </label>
          </div>
        </div>
        <div className="col col-md-2 col-sm-6 col-md-3 ">
          <button
            onClick={handleExport}
            className="btn btn-lg btn-primary float-right"
          >
            Export <i className="fa fa-download"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ImportNhienlieu;
