import React from "react";
import { read, utils, writeFile } from "xlsx";
import * as XLSX from "xlsx"; // Import xlsx
import ExcelJS from "exceljs";
import Loading from "./Loading";
import { saveAs } from "file-saver";
import { useState } from "react";
const ImportBSCs = (props) => {
  const [load, setload] = useState(false);
  // Hàm xử lý import file Excel
  const handleImport = ($event) => {
    setload(true);
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const wb = read(event.target.result); // Đọc file Excel thành workbook
          const sheets = wb.SheetNames; // Lấy tên các sheet trong file

          if (sheets.length) {
            const ws = wb.Sheets[sheets[0]]; // Lấy sheet đầu tiên
            const jsonData = utils.sheet_to_json(ws, { header: 1, defval: "" }); // Đọc tất cả dữ liệu bao gồm tiêu đề

            // Bỏ qua dòng đầu tiên (tiêu đề) và tạo đối tượng với thuộc tính tt01, tt02,...
            const dataWithoutHeader = jsonData.slice(1).map((row, rowIndex) => {
              return row.reduce(
                (acc, value, index) => {
                  // Xử lý thuộc tính thứ 32 là ngày có định dạng dd/mm/yyyy hoặc serial number
                  if (index === 31 && value) {
                    let formattedDate = value;

                    if (typeof value === "string") {
                      // Kiểm tra nếu value là chuỗi, tách theo định dạng dd/mm/yyyy
                      const [day, month, year] = value.split("/");

                      // Kiểm tra tính hợp lệ của ngày
                      const date = new Date(`${year}-${month}-${day}`);
                      if (!isNaN(date.getTime())) {
                        formattedDate = `${day.padStart(
                          2,
                          "0"
                        )}/${month.padStart(2, "0")}/${year}`;
                      }
                    } else if (typeof value === "number") {
                      // Nếu value là số (serial date), chuyển đổi thành Date
                      const serialDate = new Date(
                        (value - 25569) * 86400 * 1000
                      );

                      // Format thành dd/mm/yyyy
                      const day = String(serialDate.getUTCDate()).padStart(
                        2,
                        "0"
                      );
                      const month = String(
                        serialDate.getUTCMonth() + 1
                      ).padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
                      const year = serialDate.getUTCFullYear();
                      if (day > 12) formattedDate = `${day}/${month}/${year}`;
                      else formattedDate = `${month}/${day}/${year}`;
                    }

                    acc[`tt${(index + 1).toString().padStart(2, "0")}`] =
                      formattedDate;
                  } else {
                    acc[`tt${(index + 1).toString().padStart(2, "0")}`] = value;
                  }
                  return acc;
                },
                {
                  tt000: "some-value", // Giá trị ttht có thể là giá trị cố định hoặc tính toán
                  tt00: `row-${rowIndex + 1}`, // Giá trị tt00, có thể là chỉ số hàng, ví dụ 'row-1'
                }
              );
            });

            props.getdata(dataWithoutHeader); // Gửi dữ liệu đã xử lý lên parent component
          }
        } catch (error) {
          console.error("Error reading file:", error);
          alert(
            "An error occurred while processing the file. Please try again."
          );
        }
        setload(false);
      };

      reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
    }
    $event.target.value = null;
  };

  // Hàm xử lý export file Excel

  const handleExport = async () => {
    const listData = props.listData; // Nhận danh sách các sheet từ props

    // Kiểm tra nếu listData trống hoặc không có dữ liệu
    if (
      !listData ||
      listData.length === 0 ||
      listData.every((sheet) => !sheet.data || sheet.data.length === 0)
    ) {
      alert("Không có dữ liệu để xuất.");
      return;
    }

    const workbook = new ExcelJS.Workbook(); // Tạo workbook mới

    try {
      // Duyệt qua từng sheet trong listData
      listData.forEach((sheetInfo, sheetIndex) => {
        const { name, header, data } = sheetInfo; // Lấy tên, tiêu đề, và dữ liệu cho mỗi sheet
        const worksheet = workbook.addWorksheet(
          name || `Sheet ${sheetIndex + 1}`
        ); // Thêm sheet vào workbook

        let updatedHeader = [];

        if (sheetIndex === 2) {
          // Xử lý sheet đặc biệt với header riêng và ô gộp
          worksheet.mergeCells("A1:K1"); // Gộp từ cột A đến J
          const cell = worksheet.getCell("A1");
          cell.value = "TỔNG HỢP SUY HAO THEO GIAO BSC NGÀY " + props.ngay;
          cell.font = { name: "Times New Roman", bold: true, size: 14 };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ADD8E6" }, // Light Blue
          };

          // Thêm header tiếp theo từ hàng thứ 2
          updatedHeader = [
            "Đơn vị",
            "Tuyến KT",
            "SL Thuê bao GPON đến " + props.dateUpdate,
            "SL Thuê bao không đạt ONU RX,TX",
            "SL Thuê bao không đạt OLT RX,TX",

            "SL Thuê báo GPON kém 8362",

            "SL Thuê bao kém (Dự phòng 2dBm)",
            "Tổng SL cổng kém so với chỉ tiêu SL cho phép",
            "Tỷ lệ Thuê bao kém trong ngày theo 8362 (%)",
            "Tỷ lệ Thuê bao kém DP 2dBm trong ngày (%)",
            // "Tỉ lệ bình quân tính BSC(Lũy kế %)",
            "NVKT",
          ];

          worksheet.addRow(updatedHeader); // Thêm header vào sheet
          worksheet.getRow(worksheet.lastRow.number).eachCell((cell) => {
            cell.font = { name: "Times New Roman", bold: true, size: 12 }; // In đậm chữ
            cell.alignment = { horizontal: "center", vertical: "middle" }; // Căn giữa nội dung
          });
          // Định dạng tiêu đề đặc biệt

          // Thêm dữ liệu vào sheet trước khi gộp ô
          data.forEach((row) => {
            worksheet.addRow(Object.values(row));
          });
          worksheet.columns.forEach((column) => {
            // Kích hoạt wrapText và font Times New Roman cho tất cả các ô từ hàng thứ 2
            column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
              if (rowNumber > 2) {
                // Chỉ áp dụng cho hàng thứ 2 trở đi
                cell.font = {
                  name: "Times New Roman",
                  size: 12, // Bạn có thể điều chỉnh kích thước font nếu muốn
                };

                // Nếu cần, bạn có thể thêm các thuộc tính khác, như căn giữa và xuống dòng
              }
            });
          });

          for (let rowIndex = 2; rowIndex <= 27; rowIndex++) {
            worksheet.getCell(`F${rowIndex}`).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF00" }, // Yellow
            };

            const cell = worksheet.getCell(`A${rowIndex}`);
            cell.font = {
              name: "Times New Roman",
            };
            // In đậm và căn giữa nội dung
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
          }
          // Giả sử cột "Tuyến KT" là cột B, bắt đầu từ hàng 2 đến hàng 27
          for (let rowIndex = 2; rowIndex <= 27; rowIndex++) {
            const cell = worksheet.getCell(`B${rowIndex}`); // Cột "Tuyến KT" nằm ở cột B

            if (cell.value === "Tổng TT") {
              // In đậm và đổi màu chữ thành màu đỏ cho toàn bộ hàng
              const row = worksheet.getRow(rowIndex);
              row.eachCell({ includeEmpty: true }, (cell) => {
                cell.font = {
                  name: "Times New Roman",
                  bold: true,
                  color: { argb: "FF0000" }, // Màu đỏ
                };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFCCCB" }, // Màu nền đỏ nhạt (Light Red)
                };
              });
            }
            if (cell.value === "HGI") {
              // In đậm và đổi màu chữ thành màu đỏ cho toàn bộ hàng
              const row = worksheet.getRow(rowIndex);
              row.eachCell({ includeEmpty: true }, (cell) => {
                cell.font = {
                  name: "Times New Roman",
                  bold: true,
                  color: { argb: "FF0000" }, // Màu đỏ
                };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFF00" }, // Màu nền đỏ nhạt (Light Red)
                };
              });
            }
          }

          // Gộp ô cho cột "Đơn vị" sau khi thêm dữ liệu
          let startRow = 3; // Bắt đầu từ hàng 3 (vì hàng 1 và 2 là tiêu đề)
          data.forEach((row, index) => {
            if (index === 0 || data[index].donvi !== data[index - 1].donvi) {
              if (index > 0) worksheet.mergeCells(`A${startRow}:A${index + 2}`);
              startRow = index + 3;
            }
          });
          if (startRow < data.length) {
            worksheet.mergeCells(`A${startRow}:A${data.length + 2}`);
          }
        } 
        
        
        
        
        
        
        
        
        
        
        
        
        
        else {
          if (sheetIndex === 3 || sheetIndex === 4) {
            // Xử lý sheet đặc biệt với header riêng và ô gộp
            worksheet.mergeCells("A1:AH1"); // Gộp từ cột A đến J
            const cell = worksheet.getCell("A1");
            cell.value = "TỔNG HỢP SUY HAO THÁNG " + props.month;
            cell.font = { name: "Times New Roman", bold: true, size: 14 };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "ADD8E6" }, // Light Blue
            };
            worksheet.mergeCells("AI1:AJ1"); // Gộp từ cột A đến J
            const cells = worksheet.getCell("AI1");
            cells.value = "Bình quân	";
            cells.font = { name: "Times New Roman", bold: true, size: 14 };
            cells.alignment = { horizontal: "center", vertical: "middle" };
            cells.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "ADD8E6" }, // Light Blue
            };
            // Thêm header tiếp theo từ hàng thứ 2
            updatedHeader = [
              "Đơn vị",
              "Tuyến KT",
              "SL cổng đến " + props.dateUpdate,
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24",
              "25",
              "26",
              "27",
              "28",
              "29",
              "30",
              "31",
              "Số cổng",
              "Tỷ lệ(%)",
            ];

            worksheet.addRow(updatedHeader); // Thêm header vào sheet
            worksheet.getRow(worksheet.lastRow.number).eachCell((cell) => {
              cell.font = { bold: true, name: "Times New Roman", size: 12 }; // In đậm chữ
              cell.alignment = { horizontal: "center", vertical: "middle" }; // Căn giữa nội dung
            });
            // Định dạng tiêu đề đặc biệt

            // Thêm dữ liệu vào sheet trước khi gộp ô
            data.forEach((row) => {
              worksheet.addRow(Object.values(row));
            });
            worksheet.columns.forEach((column) => {
              // Kích hoạt wrapText và font Times New Roman cho tất cả các ô từ hàng thứ 2
              column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber > 2) {
                  // Chỉ áp dụng cho hàng thứ 2 trở đi
                  cell.font = {
                    name: "Times New Roman",
                    size: 12, // Bạn có thể điều chỉnh kích thước font nếu muốn
                  };
                  cell.height = 18;

                  // Nếu cần, bạn có thể thêm các thuộc tính khác, như căn giữa và xuống dòng
                }
              });
            });

            // Giả sử cột "Tuyến KT" là cột B, bắt đầu từ hàng 2 đến hàng 27
            for (let rowIndex = 2; rowIndex <= 27; rowIndex++) {
              const cell = worksheet.getCell(`B${rowIndex}`); // Cột "Tuyến KT" nằm ở cột B

              if (cell.value === "Tổng TT") {
                // In đậm và đổi màu chữ thành màu đỏ cho toàn bộ hàng
                const row = worksheet.getRow(rowIndex);
                row.eachCell({ includeEmpty: true }, (cell) => {
                  cell.font = {
                    name: "Times New Roman",
                    bold: true,
                    size: 12,
                    color: { argb: "FF0000" }, // Màu đỏ
                  };
                  cell.alignment = { horizontal: "center", vertical: "middle" };
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",

                    fgColor: { argb: "FFFFCCCB" }, // Màu nền đỏ nhạt (Light Red)
                  };
                  cell.height = 18;
                });
              }
              if (cell.value === "HGI") {
                // In đậm và đổi màu chữ thành màu đỏ cho toàn bộ hàng
                const row = worksheet.getRow(rowIndex);
                row.eachCell({ includeEmpty: true }, (cell) => {
                  cell.font = {
                    name: "Times New Roman",
                    bold: true,
                    size: 12,

                    color: { argb: "FF0000" }, // Màu đỏ
                  };
                  cell.height = 18;
                  cell.alignment = { horizontal: "center", vertical: "middle" };
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFF00" }, // Màu nền đỏ nhạt (Light Red)
                  };
                });
              }
            }

            // Gộp ô cho cột "Đơn vị" sau khi thêm dữ liệu
            let startRow = 3; // Bắt đầu từ hàng 3 (vì hàng 1 và 2 là tiêu đề)
            data.forEach((row, index) => {
              if (index === 0 || data[index].donvi !== data[index - 1].donvi) {
                if (index > 0)
                  worksheet.mergeCells(`A${startRow}:A${index + 2}`);
                startRow = index + 3;
              }
            });
            if (startRow < data.length) {
              worksheet.mergeCells(`A${startRow}:A${data.length + 2}`);
            }
          } else {
            // Các sheet khác sử dụng header bình thường và thêm STT
            updatedHeader = ["STT", ...header];
            worksheet.addRow(updatedHeader);

            // Thêm dữ liệu vào sheet và thêm STT
            const updatedData = data.map((row, index) => ({
              STT: index + 1, // Thêm cột số thứ tự
              ...row,
            }));

            updatedData.forEach((row) => {
              worksheet.addRow(Object.values(row));
            });
          }
        }

        // Định dạng cột: điều chỉnh độ rộng
        // Đặt chiều rộng cột cố định và cho phép xuống dòng nếu dữ liệu quá dài

        // Định dạng header: in đậm, căn giữa và tô màu xanh dương nhạt
        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true, name: "Times New Roman", size: 14 };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ADD8E6" }, // Light Blue
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.height = 18;
        });

        // Định dạng nội dung: căn giữa tất cả nội dung và thêm viền cho từng ô
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            row.eachCell((cell) => {
              cell.alignment = { horizontal: "center", vertical: "middle" };
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
          }
        });
        if (sheetIndex === 3 || sheetIndex === 4)
          worksheet.columns.forEach((column, index) => {
            if (index === 0) {
              // Set column A width to 20

              column.font = {
                name: "Times New Roman",
                size: 12,
                bold: true, // Bạn có thể điều chỉnh kích thước font nếu muốn
              };
              column.width = 25.15;
            } else if (
              (index >= 1 && index <= 2) ||
              (index >= 34 && index <= 35)
            ) {
              // Set columns B to J width to 15
              column.width = 12;
            } else {
              // Set column K width to 20
              column.width = 5;
            }

            // Kích hoạt wrapText cho tất cả các ô trong cột
            column.eachCell({ includeEmpty: true }, (cell) => {
              cell.alignment = {
                wrapText: true,
                horizontal: "center",
                vertical: "middle",
              };
            });
            const cell = worksheet.getCell("A1");
            cell.font = { bold: true, name: "Times New Roman", size: 14 };
          });
        else {
          worksheet.columns.forEach((column, index) => {
            if (index === 0) {
              // Set column A width to 20

              column.font = {
                name: "Times New Roman",
                size: 12,
                bold: true, // Bạn có thể điều chỉnh kích thước font nếu muốn
              };
              column.width = 25.15;
            } else if (index >= 1 && index <= 9) {
              // Set columns B to J width to 15
              column.width = 12;
            } else if (index === 10) {
              // Set column K width to 20
              column.width = 20;
            }

            // Enable wrapText for all cells in the column
            column.eachCell({ includeEmpty: true }, (cell) => {
              cell.alignment = {
                wrapText: true,
                horizontal: "center",
                vertical: "middle",
              };
            });
          });

          if (sheetIndex === 2) {
            worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
              if (rowIndex >= 3 && rowIndex <= 27) {
                row.height = 18;
              }
              const cell = worksheet.getCell("A1");
              cell.font = { bold: true, name: "Times New Roman", size: 14 };
            });
          }
        }
      });

      // Lưu file Excel với tên được truyền từ props, nếu không có thì sử dụng tên mặc định
      const fileName = props.name ? props.name : "ExportedFile.xlsx";
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Lỗi khi xuất file:", error);
      alert("Đã xảy ra lỗi khi xuất file. Vui lòng thử lại.");
    }
  };

  return (
    <>
      {load && (
        <>
          <Loading />
        </>
      )}
      <div className="row">
        {/* Khu vực import file */}
        <div
          className="col col-lg-4 col-sm-6 col-md-6"
          style={{ textAlign: "left" }}
        >
          <div className="custom-file">
            <input
              type="file"
              name="file"
              hidden={true}
              className="custom-file-input p-3"
              id="inputGroupFile"
              required
              onChange={handleImport} // Gọi hàm import khi chọn file
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

        {/* Khu vực export file */}
        <div className="col col-md-4 col-sm-6 col-md-3">
          <button
            onClick={handleExport} // Gọi hàm export khi nhấn nút
            className="btn btn-lg btn-primary float-right"
          >
            Export <i className="fa fa-download"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ImportBSCs;
