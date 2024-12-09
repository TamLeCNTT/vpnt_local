import React from "react";
import { read, utils } from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns"; // Import hàm format từ date-fns

const ImPortMayNo = (props) => {
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
    event.target.value=null;
  };

  const handleExport = async () => {
    console.log(props.data);
    if (!props.data || props.data.length === 0) {
      console.error("No data available to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // **Thêm tiêu đề**
    const headerRow = worksheet.addRow(props.header);

    // **Định dạng tiêu đề**
    headerRow.font = { bold: true, size: 14 }; // In đậm và kích thước chữ
    headerRow.alignment = { horizontal: "center", vertical: "middle" }; // Căn giữa
    const centerRow = worksheet.addRow([
      "Trung tâm viễn thông 1",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
     
    ]); // Hàng này sẽ có dữ liệu trong cột A, và các cột khác để trống
    centerRow.font = { bold: true }; // In đậm
    centerRow.alignment = { horizontal: "center", vertical: "middle" }; // Căn giữa

    // **Tô màu xanh nhạt cho hàng "Trung tâm 1" và gộp ô từ cột A đến P**

    worksheet.mergeCells(`A${centerRow.number}:N${centerRow.number}`);
    centerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        size: 16,
        fgColor: { argb: "ADD8E6" }, // Màu vàng
      };
    });
    // **Thêm dữ liệu và căn giữa**
    props.data.forEach((row) => {
      const formattedRow = Object.keys(row).map((key) => {
        if (!isNaN(row[key]) && row[key] > 425569) {
          return format(excelDateToJSDate(row[key]), "dd/MM/yyyy HH:mm");
        }
        return row[key];
      });
      const dataRow = worksheet.addRow(formattedRow);

      // Căn giữa tất cả các ô trong hàng dữ liệu
      dataRow.alignment = { horizontal: "center", vertical: "middle" };
    });

    // **Thêm viền cho tất cả các ô**
    const rowCount = worksheet.rowCount;
    const columnCount = worksheet.columnCount;

    for (let row = 1; row <= rowCount; row++) {
      for (let col = 1; col <= columnCount; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    // tô màu vượt VHMPĐ
    const dataRowvout = worksheet.getRows(2, worksheet.rowCount - 1);
    dataRowvout.forEach((row) => {
      // Giả sử cột ghi chú là cột O (index 15)
      const noteCell = row.getCell(14);
      if (noteCell.value && noteCell.value.toString().includes("vượt VHMPĐ")) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            size: 16,
            fgColor: { argb: "FFFF00" }, // Màu vàng
          };
        });
      }
    });

    // **Gộp ô từ cột A đến F cho hàng có giá trị "Tổng"**
    const dataRows = worksheet.getRows(2, worksheet.rowCount - 1); // Lấy tất cả các hàng dữ liệu
    let centerCount = 2;

    dataRows.forEach((row) => {
      if (row.getCell(2).value === "Tổng") {
        // Giả sử giá trị "Tổng" nằm ở cột B (index 2)
        const rowIndex = row.number;
        worksheet.mergeCells(`A${rowIndex}:F${rowIndex}`);
        let mergedCell = worksheet.getCell(`A${rowIndex}`);
        mergedCell.value = "Tổng";
        // Định dạng hàng có chữ "Tổng"
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            size: 16,
            fgColor: { argb: "FFFF00" }, // Màu vàng
          };
        });

        const centerRow = worksheet.insertRow(
          rowIndex + 1,
          new Array(16).fill("")
        ); // Thêm hàng mới với 16 ô trống (từ cột A đến P)
        centerRow.getCell(1).value = `Trung tâm viễn thông ${centerCount}`; // Gán giá trị "Trung tâm 2", "Trung tâm 3", v.v.
        centerRow.font = { bold: true };
        worksheet.mergeCells(`A${centerRow.number}:N${centerRow.number}`);
        centerRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            size: 16,
            fgColor: { argb: "ADD8E6" }, // Màu vàng
          };
        });
        centerCount++;
      }
    });
    const dataRow = worksheet.getRows(2, worksheet.rowCount - 1);
    dataRow.forEach((row) => {
      if (row.getCell(2).value === "Tổng cộng") {
        // Giả sử giá trị "Tổng" nằm ở cột B (index 2)
        const rowIndex = row.number;
        worksheet.mergeCells(`A${rowIndex}:F${rowIndex}`);
        worksheet.mergeCells(`A${rowIndex - 1}:F${rowIndex - 1}`);
        let mergedCell = worksheet.getCell(`A${rowIndex}`);
        let mergedCells = worksheet.getCell(`A${rowIndex - 1}`);
        mergedCell.value = "Tổng cộng";
        mergedCells.value = "Tổng";
        // Định dạng hàng có chữ "Tổng"
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            size: 16,
            fgColor: { argb: "7CFC00" }, // Màu vàng
          };
        });
        const previousRow = worksheet.getRow(rowIndex - 1);
        previousRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" }, // Màu vàng
          };
        });
        const noteRowIndex = rowIndex + 1;
        worksheet.addRow([]);
        worksheet.addRow([]);

        // Đặt giá trị cho hàng chú thích
        const noteCell = worksheet.getCell(`A${noteRowIndex}`);
        noteCell.value = `Ghi chú:  
        - Các trường hợp vẫn vận hành máy sau khi có điện AC 1h sẽ áp dụng công văn 853/VNPT-HGI-KT-ĐT ngày 08/10/2018
        - Vận hành trước khi mất điện sẽ bị trừ thời gian.`;
        // Gộp ô từ cột A đến P cho hàng chú thích
        worksheet.mergeCells(`A${noteRowIndex}:N${noteRowIndex + 1}`);
        // Định dạng hàng chú thích
        noteCell.font = { italic: true, size: 12 };
        noteCell.alignment = {
          horizontal: "left",
          vertical: "top",
          wrapText: true,
        };
      }
    });
    // **Gộp ô**
    const mergeColumns = ["M"]; // Các cột cần gộp
    let firstRow = 2; // Hàng đầu tiên có dữ liệu (sau tiêu đề)
    let lastRow = 2;
    let previousValue = worksheet.getCell(`B${firstRow}`).value; // Giá trị của cột B

    for (let row = 3; row <= worksheet.rowCount; row++) {
      const currentValue = worksheet.getCell(`B${row}`).value; // Giá trị hiện tại của cột B
      if (currentValue === previousValue) {
        lastRow = row;
      } else {
        if (lastRow > firstRow) {
          mergeColumns.forEach((column) => {
            const range = `${column}${firstRow}:${column}${lastRow}`;

            if (lastRow > 175 && lastRow < 180) {
              const dataRows = worksheet.getRows(175, 1);
              // dataRows.forEach((rows, index) => {
              //   console.log(`Row ${row}:`, rows.values);
              // });
            }

            let cellValue = 0;

            // Tìm giá trị không phải 0 để gán cho ô gộp
            for (let r = firstRow; r <= lastRow; r++) {
              let value = worksheet.getCell(`${column}${r}`).value;
              // console.log(column, r, worksheet.getCell(`H175`).value);
              if (value !== null && value !== undefined && value !== 0) {
                cellValue = value;
                break;
              }
            }
            worksheet.mergeCells(range);
            let mergedCell = worksheet.getCell(`${column}${firstRow}`);
            mergedCell.value = cellValue;
          });
        }
        firstRow = row;
        lastRow = row;
        previousValue = currentValue;
      }
    }

    // Gộp ô cuối cùng nếu cần thiết
    if (lastRow > firstRow) {
      mergeColumns.forEach((column) => {
        const range = `${column}${firstRow}:${column}${lastRow}`;

        let cellValue = null;

        for (let r = firstRow; r <= lastRow; r++) {
          let value = worksheet.getCell(`${column}${r}`).value;
          if (value !== null && value !== undefined && value !== 0) {
            cellValue = value;
            break;
          }
        }

        if (cellValue === null) cellValue = 0;
        try {
          worksheet.mergeCells(range);
        } catch (error) {
          console.log(error.message);
        }

        let mergedCell = worksheet.getCell(`${column}${firstRow}`);
        mergedCell.value = cellValue;
      });
    }





 firstRow = 2; // Hàng đầu tiên có dữ liệu
 lastRow = 2;
let previousBValue = worksheet.getCell(`B${firstRow}`).value; // Giá trị cột B
const columnsToMerge = ["H","I", "J", "K", "L"]; // Các cột cần gộp

// Hàm gộp ô
function mergeColumnCells(column, firstRow, lastRow, value) {
  const range = `${column}${firstRow}:${column}${lastRow}`;
  try {
    worksheet.mergeCells(range); // Gộp ô
    worksheet.getCell(`${column}${firstRow}`).value = value; // Gán giá trị cho ô gộp
  } catch (error) {
    console.error(`Failed to merge cells ${range}:`, error.message);
  }
}

for (let row = 3; row <= worksheet.rowCount; row++) {
  const currentBValue = worksheet.getCell(`B${row}`).value; // Giá trị hiện tại của cột B
  let isGroupMatching = true;

  // Kiểm tra nếu tất cả các cột đều có giá trị giống nhau
  for (const column of columnsToMerge) {
    const previousValue = worksheet.getCell(`${column}${firstRow}`).value;
    const currentValue = worksheet.getCell(`${column}${row}`).value;
    if (currentValue !== previousValue || currentBValue !== previousBValue) {
      isGroupMatching = false;
      break;
    }
  }

  if (isGroupMatching) {
    lastRow = row; // Mở rộng nhóm gộp
  } else {
    // Gộp ô cho các cột trong nhóm
    if (lastRow > firstRow) {
      for (const column of columnsToMerge) {
        const value = worksheet.getCell(`${column}${firstRow}`).value;
        mergeColumnCells(column, firstRow, lastRow, value);
      }
    }
    // Bắt đầu nhóm mới
    firstRow = row;
    lastRow = row;
    previousBValue = currentBValue;
  }
}

// Gộp ô cho nhóm cuối cùng
if (lastRow > firstRow) {
  for (const column of columnsToMerge) {
    const value = worksheet.getCell(`${column}${firstRow}`).value;
    mergeColumnCells(column, firstRow, lastRow, value);
  }
}


    // **Thiết lập chiều rộng cột dựa trên tiêu đề**
    props.header.forEach((header, index) => {
      const maxLength = Math.max(
        ...props.data.map((row) => (row[header] || "").toString().length),
        header.length
      );
      worksheet.getColumn(index + 1).width = maxLength + 8; // Thêm một số khoảng trắng cho dễ đọc
    });

    // **Lưu file Excel**
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        saveAs(new Blob([buffer]), `${props.name}.xlsx`);
      })
      .catch((error) => {
        console.error("Error saving file:", error);
      });
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

export default ImPortMayNo;
