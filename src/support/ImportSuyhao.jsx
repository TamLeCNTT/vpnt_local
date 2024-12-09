import React from "react";
import { read, utils, writeFile } from "xlsx";
import { format, addDays } from "date-fns";

const ImportSuyhao = (props) => {
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
  
    // Thêm tiêu đề với định dạng in đậm và căn giữa
    utils.sheet_add_aoa(ws, props.header);
  
    // Định dạng header: in đậm và căn giữa
    const headerRange = utils.decode_range(ws['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = utils.encode_cell({ r: 0, c: C }); // lấy ô tiêu đề
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true,size:20}, // in đậm
        alignment: { horizontal: "center", vertical: "center" }, // căn giữa
      };
    }
  
    // Thêm dữ liệu bắt đầu từ dòng 2
    utils.sheet_add_json(ws, props.data, { origin: "A2", skipHeader: true });
  
    // Tự động điều chỉnh độ rộng cột dựa trên nội dung
    const maxLengths = props.header[0].map((_, colIndex) => {
      // Tính toán độ dài lớn nhất giữa tiêu đề và dữ liệu trong mỗi cột
      return Math.max(
        props.header[0][colIndex].length,
        ...props.data.map(row => (row[Object.keys(row)[colIndex]] || "").toString().length)
      );
    });
  
    // Thiết lập độ rộng cột trong worksheet
    ws['!cols'] = maxLengths.map(length => ({ wch: length + 2 })); // +2 để chừa khoảng trống
  
    // Thêm sheet vào workbook và ghi file
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, props.name + ".xlsx");
  };
  

  return (
    <>
      <div className="row">
       
        <div className="col col-md-4  col-sm-6 col-md-3 ">
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

export default ImportSuyhao;
