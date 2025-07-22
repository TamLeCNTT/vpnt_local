import Header from "../Layout/Header";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Paginations from "../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImPort from "../support/ImPort";
import { da } from "date-fns/locale";
import nhienlieuService from "../service/nhienlieuService";
import "../Assets/scss/Home.scss";
import Select from "react-select";
import ImPortMayNo from "../support/ImPortMayNo";
import { parse, differenceInMinutes } from "date-fns";
const Home = () => {
  const [lists, setLists] = useState([]);
  const [listOLd, setListOld] = useState([]);
  const [listpg, setListpg] = useState([]);
  const [listNhienlieu, setlistNhienlieu] = useState([]);
  const [listexport, setlistexport] = useState([]);
  const header = [
    "STT",
    "Tên trạm",
    "Thời gian sự cố AC",
    "Thời gian kết thúc AC",
    "Thời gian bắt đầu chạy MPĐ",
    "Thời gian kết  thúc chạy MPĐ",
    "Thời gian CBMN (phút)",
    "Tổng thời gian chạy MPĐ dầu",
    "Tổng thời gian chạy MPĐ xăng",
    "Định Mức nhiên liệu (lít/giờ)",
    "Tổng nhiên liệu dầu (lít)",
    "Tổng nhiên liệu xăng(lít)",

    "Có ATS",
    "Ghi chú",
  ];
  const optiondonvi = [
    { value: "tatca", label: "Tất cả" },
    { value: "TTVT1", label: "TTVT1" },
    { value: "TTVT2", label: "TTVT2" },
    { value: "TTVT3", label: "TTVT3" },
    { value: "TTVT4", label: "TTVT4" },
  ];
  useEffect(() => {
    nhienlieuService.getdata().then((res) => {
      setlistNhienlieu(Object.values(res.data));
    });
  }, []);
  const getdata = (e) => {
    console.log(e);
    setListpg([]);
    setLists([]);
    let listdata = [];
    let data = {};
    const format = "dd/MM/yyyy HH:mm";
    let err = false;
    e.map((item, index) => {
      if (index != 0 && item.__EMPTY_9) {
        // console.log(
        //   item.__EMPTY_1,
        //   differenceInMinutes(
        //     parse(item.__EMPTY_5, format, new Date()),
        //     parse(item.__EMPTY_3, format, new Date())
        //   ),
        //   item.__EMPTY_3,
        //   item.__EMPTY_5 ? item.__EMPTY_5 : "khong cos kt"
        // );
        try {
          data = {
            stt: index,
            tentram: item.__EMPTY_1,
            tgbdac: item.__EMPTY_2 ? item.__EMPTY_2 : "",
            tgktac: item.__EMPTY_3 ? item.__EMPTY_3 : "",
            tgbdmn: item.__EMPTY_4 ? item.__EMPTY_4 : "",
            tgktmn: item.__EMPTY_5 ? item.__EMPTY_5 : "",
            sophut: item.__EMPTY_6,

            tongtgdau: 0,
            tongtgxang: 0,
            dinhmuc:
              String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                .toLowerCase()
                .indexOf("xăng") != -1
                ? Number(
                    String(item.__EMPTY_8).slice(
                      String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                        .toLowerCase()
                        .indexOf("xăng") + 5,
                      String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                        .toLowerCase()
                        .indexOf("lít")
                        ? String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                            .toLowerCase()
                            .indexOf("lít")
                        : String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                            .toLowerCase()
                            .indexOf("lit")
                    )
                  )
                : Number(
                    listNhienlieu.filter((e) => e.tentram == item.__EMPTY_1)[0]
                      .dinhmuc
                  ),
            tongnhienlieudau: 0,
            tongnhienlieuxang: 0,

            loainhienlieu:
              String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                .toLowerCase()
                .indexOf("xăng") != -1
                ? "UC"
                : listNhienlieu.filter((e) => e.tentram == item.__EMPTY_1)[0]
                    .nhienlieu,
            ats: item.__EMPTY_7 ? item.__EMPTY_7 : "",
            ghichu:
              differenceInMinutes(
                parse(item.__EMPTY_5, format, new Date()),
                parse(item.__EMPTY_3, format, new Date())
              ) &&
              differenceInMinutes(
                parse(item.__EMPTY_5, format, new Date()),
                parse(item.__EMPTY_3, format, new Date())
              ) > 60
                ? item.__EMPTY_8
                  ? "Trừ " +
                    (differenceInMinutes(
                      parse(item.__EMPTY_5, format, new Date()),
                      parse(item.__EMPTY_3, format, new Date())
                    ) -
                      60) +
                    " phút vượt VHMPĐ" +
                    item.__EMPTY_8
                  : "Trừ " +
                    (differenceInMinutes(
                      parse(item.__EMPTY_5, format, new Date()),
                      parse(item.__EMPTY_3, format, new Date())
                    ) -
                      60) +
                    " phút vượt VHMPĐ"
                : String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                    .toLowerCase()
                    .indexOf("xăng") != -1
                ? "Xăng 3 lít/h"
                : item.__EMPTY_8
                ? item.__EMPTY_8
                : "",
            tram: item.__EMPTY_9,
            phut:
              differenceInMinutes(
                parse(item.__EMPTY_5, format, new Date()),
                parse(item.__EMPTY_3, format, new Date())
              ) &&
              differenceInMinutes(
                parse(item.__EMPTY_5, format, new Date()),
                parse(item.__EMPTY_3, format, new Date())
              ) > 60
                ? Number(item.__EMPTY_6) -
                  (Number(
                    differenceInMinutes(
                      parse(item.__EMPTY_5, format, new Date()),
                      parse(item.__EMPTY_3, format, new Date())
                    )
                  ) -
                    60)
                : item.__EMPTY_6,
          };
        } catch {
          toast.error("Trạm " + item.__EMPTY_1 + " không tồn tại");
          err = true;
        }
        // console.log(data);
        listdata.push(data);
      }
    });
    if (!err) {
      console.log(listdata);
      listdata = listdata.sort((a, b) => {
        // Điều kiện 1: Sắp xếp theo 'tram'
        if (a.tram !== b.tram) {
          return a.tram.localeCompare(b.tram);
        }

        // Điều kiện 2: Sắp xếp theo 'tentram' nếu 'tram' giống nhau
        if (a.tentram !== b.tentram) {
          return a.tentram.localeCompare(b.tentram);
        }

        // Điều kiện 3: Sắp xếp theo 'diachi' nếu 'tram' và 'tentram' giống nhau
        return a.ghichu.localeCompare(b.ghichu);
      });
      let listDataexport = [];
      // console.log(listdata);
      listdata.map((item, index) => {
        let listsumbyTentram = listdata.filter(
          (e) => e.tentram == item.tentram
        );
        // console.log("danh sach", listsumbyTentram);
        // console.log(
        //   listsumbyTentram.filter(
        //     (e) =>
        //       String(e.ghichu).toLowerCase().indexOf("xăng") != -1 ||
        //       e.loainhienlieu == "Xăng"
        //   )
        // );
        let gioxang = listsumbyTentram
          .filter(
            (e) =>
              String(e.ghichu).toLowerCase().indexOf("xăng") != -1 ||
              e.loainhienlieu == "Xăng"
          )
          .reduce((a, v) => (a = a + Number(v.phut)), 0);
        let gioxanguc = listsumbyTentram
          .filter((e) => String(e.ghichu).toLowerCase().indexOf("xăng") != -1)
          .reduce((a, v) => (a = a + Number(v.phut)), 0);
        let giodau = listsumbyTentram
          .filter(
            (e) =>
              String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
              e.loainhienlieu != "Xăng"
          )
          .reduce((a, v) => (a = a + Number(v.phut)), 0);
        let nhienlieu = listNhienlieu.filter((e) => e.tentram == item.tentram);

        listdata[index].stt = index + 1;
        if (
          String(listdata[index].ghichu).toLowerCase().indexOf("xăng") == -1 &&
          listdata[index].loainhienlieu != "Xăng"
        ) {
          listdata[index].tongtgdau = giodau;
          listdata[index].tongtgxang = 0;
          listdata[index].tongnhienlieudau = Number(
            ((Number(giodau) / 60) * listdata[index].dinhmuc).toFixed(2)
          );
          listdata[index].tongnhienlieuxang = 0;
        } else {
          listdata[index].tongtgdau = 0;
          listdata[index].tongnhienlieudau = 0;
          let tonggioxang = 0;
          console.log(listdata[index], gioxang, gioxanguc);
          if (
            String(listdata[index].ghichu).toLowerCase().indexOf("xăng") == -1
          ) {
            console.log("ko");
            tonggioxang =
              gioxanguc != 0 && gioxang != gioxanguc
                ? gioxang - gioxanguc
                : gioxang;
          } else {
            console.log("co");
            tonggioxang = gioxanguc;
          }
          listdata[index].tongtgxang = tonggioxang;
          listdata[index].tongnhienlieuxang = Number(
            ((Number(tonggioxang) / 60) * listdata[index].dinhmuc).toFixed(2)
          );
        }
        //listdata[index].dinhmuc = Number(nhienlieu[0].dinhmuc);
        //[index].loainhienlieu = nhienlieu[0].nhienlieu;
        // listdata[index].tongnhienlieu = (
        //   (Number(gio) / 60) *
        //   Number(nhienlieu[0].dinhmuc)
        // ).toFixed(2);

        //console.log(listdata[index].tram == "TTVT1");
        if (
          (listdata[index + 1] &&
            listdata[index].tram != listdata[index + 1].tram) ||
          !listdata[index + 1]
        ) {
          // console.log(listdata.filter((e) => e.tram == listdata[index].tram));

          data = {
            stt: "",
            tentram: "Tổng",
            tgbdac: "",
            tgktac: "",
            tgbdmn: "",
            tgktmn: "",
            sophut: listdata
              .filter((e) => e.tram == listdata[index].tram)
              .reduce((a, v) => (a = a + Number(v.sophut)), 0),
            tongtgdau: listdata
              .filter(
                (e) =>
                  e.tram == listdata[index].tram &&
                  String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
                  e.loainhienlieu != "Xăng"
              )
              .reduce((a, v) => (a = a + Number(v.phut)), 0)
              .toFixed(0),
            tongtgxang: listdata
              .filter(
                (e) =>
                  (e.tram == listdata[index].tram &&
                    String(e.ghichu).toLowerCase().indexOf("xăng") != -1) ||
                  (e.tram == listdata[index].tram && e.loainhienlieu == "Xăng")
              )
              .reduce((a, v) => (a = a + Number(v.phut)), 0)
              .toFixed(0),
            dinhmuc: 0,
            tongnhienlieudau: Number(
              listdata
                .filter(
                  (e) =>
                    e.tram == listdata[index].tram &&
                    String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
                    e.loainhienlieu != "Xăng"
                )
                .reduce(
                  (a, v) => (a = a + (Number(v.phut) / 60) * Number(v.dinhmuc)),
                  0
                )
                .toFixed(2)
            ),
            tongnhienlieuxang: Number(
              listdata
                .filter(
                  (e) =>
                    (e.tram == listdata[index].tram &&
                      String(e.ghichu).toLowerCase().indexOf("xăng") != -1) ||
                    (e.tram == listdata[index].tram &&
                      e.loainhienlieu == "Xăng")
                )
                .reduce(
                  (a, v) => (a = a + (Number(v.phut) / 60) * Number(v.dinhmuc)),
                  0
                )
                .toFixed(2)
            ),

            loainhienlieu: "",
            ats: "",
            ghichu: "",
            tram: "",
          };
          // console.log(data);

          listDataexport.push(listdata[index]);
          // let data1 = {
          //   stt: "",
          //   tentram: "",
          //   tgbdac: "",
          //   tgktac: "",
          //   tgbdmn: "",
          //   tgktmn: "",
          //   phut: "",
          //   tongtg: "",
          //   dinhmuc: "",
          //   tongnhienlieudau: "",
          //   tongnhienlieuxang: "",

          //   loainhienlieu: "",
          //   ats: "",
          //   ghichu: "",
          //   tram: "",
          // };
          // listDataexport.push(data1);
          listDataexport.push(data);
          // data = {
          //   stt: "",
          //   tentram: "",
          //   tgbdac: "",
          //   tgktac: "",
          //   tgbdmn: "",
          //   tgktmn: "",
          //   phut: "",
          //   tongtg: "",
          //   dinhmuc: "",
          //   tongnhienlieudau: "",
          //   tongnhienlieuxang: "",

          //   loainhienlieu: "",
          //   ats: "",
          //   ghichu: "",
          //   tram: "",
          // };
          // listDataexport.push(data);
          // console.log("con cho con");
        } else {
          listDataexport.push(listdata[index]);
          //     console.log(listdata[index]);
        }
      });
      data = {
        stt: "",
        tentram: "Tổng cộng",
        tgbdac: "",
        tgktac: "",
        tgbdmn: "",
        tgktmn: "",
        sophut: listdata.reduce((a, v) => (a = a + Number(v.sophut)), 0),
        tongtgdau: listdata
          .filter(
            (e) =>
              String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
              e.loainhienlieu != "Xăng"
          )
          .reduce((a, v) => (a = a + Number(v.phut)), 0)
          .toFixed(0),
        tongtgxang: listdata
          .filter(
            (e) =>
              String(e.ghichu).toLowerCase().indexOf("xăng") != -1 ||
              e.loainhienlieu == "Xăng"
          )
          .reduce((a, v) => (a = a + Number(v.phut)), 0)
          .toFixed(0),
        dinhmuc: 0,
        tongnhienlieudau: Number(
          listdata
            .filter(
              (e) =>
                String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
                e.loainhienlieu != "Xăng"
            )
            .reduce(
              (a, v) => (a = a + (Number(v.phut) / 60) * Number(v.dinhmuc)),
              0
            )
            .toFixed(2)
        ),
        tongnhienlieuxang: Number(
          listdata
            .filter(
              (e) =>
                String(e.ghichu).toLowerCase().indexOf("xăng") != -1 ||
                e.loainhienlieu == "Xăng"
            )
            .reduce(
              (a, v) => (a = a + (Number(v.phut) / 60) * Number(v.dinhmuc)),
              0
            )
            .toFixed(2)
        ),

        loainhienlieu: "",
        ats: "",
        ghichu: "",
        tram: "",
      };

      listDataexport.push(data);
      setLists(listdata);
      setListOld(listdata);
      const updatedList = listDataexport.map((person) => {
        // Tạo đối tượng mới không có thuộc tính 'age'
        const { phut, loainhienlieu, tram, ...rest } = person;
        return rest;
      });
      setlistexport(updatedList);

      console.log(updatedList);
    }
  };
  const changedonvic = (e) => {
    if (e.value == "tatca") {
      setLists(listOLd);
    } else {
      setLists(listOLd.filter((item) => item.tram == e.value));
    }
  };
  const backupConfig = async () => {
    console.log("hello");
    const response = await fetch("http://localhost:3001/backup");
    console.log(response);
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 160, // Set a fixed width for the control
      backgroundColor: "transparent", // Transparent background to blend with the header
      border: "none", // Remove default border
      boxShadow: "none", // Remove default shadow
      cursor: "pointer", // Pointer cursor to indicate interactivity
      minHeight: "initial", // Remove default minHeight
      height: "auto", // Adjust to content
      alignItems: "center", // Center items vertically
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#fff", // Matching text color with the header
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff", // Matching text color with the header
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#333", // Matching indicator color with the header
      "&:hover": {
        color: "#333", // Keep the color consistent on hover
      },
    }),
    indicatorSeparator: () => ({
      display: "none", // Remove the separator line
    }),
    menu: (provided) => ({
      ...provided,
      width: 160, // Match the width of the control
      borderRadius: "4px",
      fontWeight: "bold",
      color: "#fff",
      overflow: "hidden",
      border: "1px solid #ccc",
      marginTop: 0, // Align menu with control
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 150, // Set a max height for the dropdown list
      overflowY: "auto", // Enable vertical scrolling if needed
      padding: 0,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#f1f1f1"
        : "#fff",
      color: state.isSelected ? "#fff" : "#333",
      cursor: "pointer",
      whiteSpace: "nowrap", // Prevent text wrapping
      overflow: "hidden",
      textOverflow: "ellipsis", // Show ellipsis for overflowed text
    }),
  };

  const getlist = (e) => {
    setListpg(e);
  };
  return (
    <>
      <Header />

      <main id="cabin_list" className="main">
        {/* <div>
          <button onClick={backupConfig}>Backup Configuration</button>
        </div> */}
        <div className="container">
          <div className="row mt-4">
            <div className="col col-md-3 col-lg-12 b-2">
              <NavLink to="/">
                <i class="fa-solid fa-home" /> Trang chủ &nbsp;
              </NavLink>
              / Thống kê nhiên liệu máy nổ
            </div>
          </div>
          <div className="row mt-4 d-flex justify-content-between ">
            <div className="col col-md-7">
              <input
                type="text"
                className="form-control  ms-2 "
                id="teacher"
                // onChange={(e) => changetext(e)}
                // value={text}
                placeholder="Nhập nội dung tìm kiếm"
              />
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-5">
              <div className="row">
                <div className="col col-md-10">
                  <ImPortMayNo
                    getdata={getdata}
                    header={header}
                    row={6}
                    data={listexport}
                    name={
                      "TỔNG HỢP NHIÊN LIỆU THÁNG " +
                                          (new Date().getMonth() + 1) 
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive table-fixed-header ">
            <table className="table mt-3 table-bordered   table-hover  text-al">
              <thead className="thead-primary">
                <tr className="align-middle">
                  <th>STT</th>
                  <th scope="col">Tên trạm</th>
                  <th scope="col">Thời gian sự cố AC</th>

                  <th scope="col">Thời gian kết thúc AC</th>

                  <th scope="col">Thời gian bắt đầu chạy MPĐ</th>
                  {/* <th scope="col">Quãng đường </th>
                                            <th scope="col">Thời gian </th>
                                            <th scope="col">Thời gian đêm</th> */}
                  <th scope="col">Thời gian kết thúc chạy MPĐ</th>
                  <th>Thời gian CBMN (phút)</th>
                  {/* <th>"Tổng thời gian chạy MPĐ"</th> */}
                  {/* <th>Định Mức nhiên liệu (lít/giờ)</th> */}
                  <th>Tổng TG nhiên liệu dầu (phút)</th>
                  <th>Tổng TG nhiên liệu xăng (phút)</th>

                  <th>Tổng nhiên liệu dầu (lít)</th>
                  <th>Tổng nhiên liệu xăng (lít)</th>
                  <th>Ghi chú</th>
                  <th>
                    {" "}
                    <Select
                      onChange={(e) => changedonvic(e)}
                      options={optiondonvi}
                      styles={customStyles}
                      placeholder="Đơn vị quản lý"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {listpg &&
                  listpg
                    .sort((a, b) => b.tram - a.tram)
                    .map((item, index) => {
                      return (
                        <tr className="alert " role="alert" key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.tentram}</td>
                          <td>{item.tgbdac}</td>

                          <td>{item.tgktac}</td>

                          <td>{item.tgbdmn}</td>
                          <td>{item.tgktmn}</td>
                          <td>{item.phut}</td>
                          {/* <td>{item.tongtg}</td> */}
                          {/* <td>{item.dinhmuc}</td> */}

                          <td>{item.tongtgdau}</td>
                          <td>{item.tongtgxang}</td>
                          <td>{item.tongnhienlieudau}</td>
                          <td>{item.tongnhienlieuxang}</td>
                          <td>{item.ghichu}</td>
                          <td>{item.tram}</td>

                          {/* <td >
                                                            {item.distance ? item.distance + " Km" : ""}
                                                        </td>


                                                        <td>
                                                            {item.hours}
                                                        </td>
                                                        <td>
                                                            {item.nightTime}
                                                        </td> */}

                          {/* <td className="manage"> */}
                          {/* <a href="#" className="close" data-dismiss="alert" aria-label="Close" onClick={() => xoa(item.cabinId)}>
                                                            <span aria-hidden="true"><i className="fa fa-close"></i></span>
                                                        </a> */}
                          {/* <Student_Edit id={item.studentId} listst={listst} listgv={listgv} save={save} /> */}
                          {/* </td> */}
                        </tr>
                      );
                    })}
                <tr className="text-td tong  " role="alert">
                  <td colSpan={6} className="text-td">
                    Tổng
                  </td>
                  <td>
                    {lists
                      ? lists.reduce((a, v) => (a = a + Number(v.phut)), 0)
                      : 0}
                  </td>

                  <td>
                    {" "}
                    {lists
                      ? lists
                          .filter(
                            (e) =>
                              String(e.ghichu).toLowerCase().indexOf("xăng") ==
                                -1 && e.loainhienlieu != "Xăng"
                          )
                          .reduce((a, v) => (a = a + Number(v.phut)), 0)
                          .toFixed(2)
                      : 0}
                  </td>
                  {/* <td>{item.tongtg}</td> */}
                  <td>
                    {" "}
                    {lists
                      ? lists
                          .filter(
                            (e) =>
                              String(e.ghichu).toLowerCase().indexOf("xăng") !=
                                -1 || e.loainhienlieu == "Xăng"
                          )
                          .reduce((a, v) => (a = a + Number(v.phut)), 0)
                          .toFixed(2)
                      : 0}
                  </td>
                  <td>
                    {" "}
                    {lists
                      ? lists
                          .filter(
                            (e) =>
                              String(e.ghichu).toLowerCase().indexOf("xăng") ==
                                -1 && e.loainhienlieu != "Xăng"
                          )
                          .reduce(
                            (a, v) =>
                              (a =
                                a + (Number(v.phut) / 60) * Number(v.dinhmuc)),
                            0
                          )
                          .toFixed(2)
                      : 0}
                  </td>
                  <td>
                    {" "}
                    {lists
                      ? lists
                          .filter(
                            (e) =>
                              String(e.ghichu).toLowerCase().indexOf("xăng") !=
                                -1 || e.loainhienlieu == "Xăng"
                          )
                          .reduce(
                            (a, v) =>
                              (a =
                                a + (Number(v.phut) / 60) * Number(v.dinhmuc)),
                            0
                          )
                          .toFixed(2)
                      : 0}
                  </td>

                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <Paginations itemsPerPage={20} list={lists} getlist={getlist} />
        </div>
      </main>
    </>
  );
};
export default Home;
