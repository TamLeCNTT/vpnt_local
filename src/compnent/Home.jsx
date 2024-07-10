import Header from "../Layout/Header";
import { useState, useEffect } from "react";

import Paginations from "../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImPort from "../support/ImPort";
import { da } from "date-fns/locale";
import nhienlieuService from "../service/nhienlieuService";

const Home = () => {
  const [lists, setLists] = useState([]);
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
    "Loại mhiên liệu",
    "Có ATS",
    "Ghi chú",
    "Mã TT",
  ];
  useEffect(() => {
    nhienlieuService.getAll().then((res) => {
      setlistNhienlieu(Object.values(res.data));
    });
  }, []);
  const getdata = (e) => {
    // console.log(e);
    let listdata = [];
    let data = {};
    e.map((item, index) => {
      if (index != 0 && item.__EMPTY_9) {
        console.log(
          "Vị trí ",
          Number(
            String(item.__EMPTY_8).slice(
              String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                .toLowerCase()
                .indexOf("xăng") + 5,
              String(item.__EMPTY_8 ? item.__EMPTY_8 : "")
                .toLowerCase()
                .indexOf("lít")
            )
          )
        );
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
                  )
                )
              : listNhienlieu.filter((e) => e.tentram == item.__EMPTY_1)[0]
                  .dinhmuc,
          tongnhienlieudau: 0,
          tongnhienlieuxang: 0,

          loainhienlieu: listNhienlieu.filter(
            (e) => e.tentram == item.__EMPTY_1
          )[0].nhienlieu,
          ats: item.__EMPTY_7 ? item.__EMPTY_7 : "",
          ghichu: item.__EMPTY_8 ? item.__EMPTY_8 : "",
          tram: item.__EMPTY_9,
        };
        // console.log(data);
        listdata.push(data);
      }
    });
    listdata = listdata.sort((a, b) => {
      if (a.tram == b.tram) {
        return a.tentram.localeCompare(b.tentram); // Sắp xếp theo tên nếu tuổi giống nhau
      }
      return a.tram.localeCompare(b.tram); // Sắp xếp theo tuổi
    });
    let listDataexport = [];
    console.log(listdata);
    listdata.map((item, index) => {
      let listsumbyTentram = listdata.filter((e) => e.tentram == item.tentram);
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
        .reduce((a, v) => (a = a + Number(v.sophut)), 0);
      let giodau = listsumbyTentram
        .filter(
          (e) =>
            String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
            e.loainhienlieu != "Xăng"
        )
        .reduce((a, v) => (a = a + Number(v.sophut)), 0);
      let nhienlieu = listNhienlieu.filter((e) => e.tentram == item.tentram);

      listdata[index].stt = index + 1;
      if (
        String(listdata[index].ghichu).toLowerCase().indexOf("xăng") == -1 &&
        listdata[index].loainhienlieu != "Xăng"
      ) {
        listdata[index].tongtgdau = giodau;
        listdata[index].tongtgxang = 0;
        listdata[index].tongnhienlieudau = (
          (Number(giodau) / 60) *
          listdata[index].dinhmuc
        ).toFixed(2);
        listdata[index].tongnhienlieuxang = 0;
      } else {
        listdata[index].tongtgdau = 0;
        listdata[index].tongtgxang = gioxang;
        listdata[index].tongnhienlieudau = 0;
        listdata[index].tongnhienlieuxang = (
          (Number(gioxang) / 60) *
          listdata[index].dinhmuc
        ).toFixed(2);
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
            .reduce((a, v) => (a = a + Number(v.sophut)), 0)
            .toFixed(2),
          tongtgxang: listdata
            .filter(
              (e) =>
                (e.tram == listdata[index].tram &&
                  String(e.ghichu).toLowerCase().indexOf("xăng") != -1) ||
                (e.tram == listdata[index].tram && e.loainhienlieu == "Xăng")
            )
            .reduce((a, v) => (a = a + Number(v.sophut)), 0)
            .toFixed(2),
          dinhmuc: 0,
          tongnhienlieudau: listdata
            .filter(
              (e) =>
                e.tram == listdata[index].tram &&
                String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
                e.loainhienlieu != "Xăng"
            )
            .reduce(
              (a, v) => (a = a + (Number(v.sophut) / 60) * Number(v.dinhmuc)),
              0
            )
            .toFixed(2),
          tongnhienlieuxang: listdata
            .filter(
              (e) =>
                (e.tram == listdata[index].tram &&
                  String(e.ghichu).toLowerCase().indexOf("xăng") != -1) ||
                (e.tram == listdata[index].tram && e.loainhienlieu == "Xăng")
            )
            .reduce(
              (a, v) => (a = a + (Number(v.sophut) / 60) * Number(v.dinhmuc)),
              0
            )
            .toFixed(2),

          loainhienlieu: "",
          ats: "",
          ghichu: "",
          tram: "",
        };
        // console.log(data);
        listDataexport.push(listdata[index]);
        let data1 = {
          stt: "",
          tentram: "",
          tgbdac: "",
          tgktac: "",
          tgbdmn: "",
          tgktmn: "",
          sophut: "",
          tongtg: "",
          dinhmuc: "",
          tongnhienlieudau: "",
          tongnhienlieuxang: "",

          loainhienlieu: "",
          ats: "",
          ghichu: "",
          tram: "",
        };
        listDataexport.push(data1);
        listDataexport.push(data);
        data = {
          stt: "",
          tentram: "",
          tgbdac: "",
          tgktac: "",
          tgbdmn: "",
          tgktmn: "",
          sophut: "",
          tongtg: "",
          dinhmuc: "",
          tongnhienlieudau: "",
          tongnhienlieuxang: "",

          loainhienlieu: "",
          ats: "",
          ghichu: "",
          tram: "",
        };
        listDataexport.push(data);
        console.log("con cho con");
      } else {
        listDataexport.push(listdata[index]);
        //     console.log(listdata[index]);
      }
    });
    data = {
      stt: "",
      tentram: "Tổng",
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
        .reduce((a, v) => (a = a + Number(v.sophut)), 0)
        .toFixed(2),
      tongtgxang: listdata
        .filter(
          (e) =>
            String(e.ghichu).toLowerCase().indexOf("xăng") != -1 ||
            e.loainhienlieu == "Xăng"
        )
        .reduce((a, v) => (a = a + Number(v.sophut)), 0)
        .toFixed(2),
      dinhmuc: 0,
      tongnhienlieudau: listdata
        .filter(
          (e) =>
            String(e.ghichu).toLowerCase().indexOf("xăng") == -1 &&
            e.loainhienlieu != "Xăng"
        )
        .reduce(
          (a, v) => (a = a + (Number(v.sophut) / 60) * Number(v.dinhmuc)),
          0
        )
        .toFixed(2),
      tongnhienlieuxang: listdata
        .filter(
          (e) =>
            String(e.ghichu).toLowerCase().indexOf("xăng") != -1 ||
            e.loainhienlieu == "Xăng"
        )
        .reduce(
          (a, v) => (a = a + (Number(v.sophut) / 60) * Number(v.dinhmuc)),
          0
        )
        .toFixed(2),

      loainhienlieu: "",
      ats: "",
      ghichu: "",
      tram: "",
    };

    listDataexport.push(data);
    setLists(listdata);
    setlistexport(listDataexport);
  };
  return (
    <>
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-5 d-flex justify-content-between ">
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
                <div className="col col-md-2">hhhh</div>
                <div className="col col-md-10">
                  <ImPort
                    getdata={getdata}
                    header={header}
                    row={6}
                    data={listexport}
                    name={
                      "DanhSach_HocVien_" +
                      new Date().getFullYear() +
                      "_" +
                      new Date().getMonth() +
                      "_" +
                      new Date().getDate()
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <table className="table">
            <thead className="thead-dark">
              <tr>
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
                <th>"Tổng thời gian chạy MPĐ"</th>
                <th>"Định Mức nhiên liệu (lít/giờ)"</th>
                <th>Tổng nhiên liệu dầu</th>
                <th>Tổng nhiên liệu xăng</th>

                <th>"Loại nhiên liệu"</th>
                <th>Ghi chú</th>
                <th>Đơn vị quản lý</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists
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
                        <td>{item.sophut}</td>
                        <td>{item.tongtg}</td>
                        <td>{item.dinhmuc}</td>

                        <td>{item.tongtgdau}</td>
                        <td>{item.tongtgxang}</td>
                        <td>{item.loainhienlieu}</td>
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
                        <td>{item.teacherId}</td>
                        {/* <td className="manage"> */}
                        {/* <a href="#" className="close" data-dismiss="alert" aria-label="Close" onClick={() => xoa(item.cabinId)}>
                                                            <span aria-hidden="true"><i className="fa fa-close"></i></span>
                                                        </a> */}
                        {/* <Student_Edit id={item.studentId} listst={listst} listgv={listgv} save={save} /> */}
                        {/* </td> */}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};
export default Home;
