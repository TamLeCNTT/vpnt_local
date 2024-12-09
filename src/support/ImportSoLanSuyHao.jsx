import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ImportSoLanSuyHao = (props) => {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();

    // Assuming props.listData is an array of objects where each object has 'name' and 'data' keys
    props.data.forEach((item) => {
      const { name, data } = item; // Get the name of the sheet and its data

      const worksheet = workbook.addWorksheet(name); // Create a new sheet with the given name

      worksheet.mergeCells("A1:G1");
      const cell = worksheet.getCell("A1");
      cell.value = " DANH SÁCH THUÊ BAO SUY HAO KÉM THEO 8362 NGÀY " + name;
      cell.font = { bold: true, size: 14, name: "Times New Roman" };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ADD8E6" }, // Light Blue
      };

      let updatedHeader = [
        "STT",
        "Trung tâm viễn thông",
        "Tuyến",
        "Account Fiber",
        "Số lần kém",
        "Thông tin nhân viên",
        "Ngày bắt đầu suy hao",
      ];

      worksheet.addRow(updatedHeader);
      worksheet.getRow(worksheet.lastRow.number).eachCell((cell) => {
        cell.font = { bold: true, name: "Times New Roman", size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      data.forEach((row, index) => {
        const rowData = [index + 1, ...Object.values(row)];
        const newRow = worksheet.addRow(rowData);
        const solanCell = newRow.getCell(5);
        console.log(solanCell)
        if (Number(solanCell.value) > 1) {
            solanCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFCCCB" }, // Red color
            };
        }
      });

      updatedHeader.forEach((header, index) => {
        const maxLength = Math.max(
          ...data.map((row) => (row[header] || "").toString().length),
          header.length
        );
        worksheet.getColumn(index + 1).width = maxLength + 2;
      });

      worksheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
    });

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

export default ImportSoLanSuyHao;
