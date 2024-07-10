import Header from "../Layout/Header";
import { useState, useEffect } from "react";

import Paginations from "../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImportNhienlieu from "../support/ImportNhienlieu";
import { da } from "date-fns/locale";
import nhienlieuService from "../service/nhienlieuService";

const Nhienlieu = () => {
  const [lists, setLists] = useState([]);
  const header = [
    [
      "STT",
      "tentram",
      "tgbdac",
      "tgktac",
      "tgbdmn",
      "tgktmn",
      "tongtg",
      "ghichu",
      "tram",
    ],
  ];
  const getdata = (e) => {
    let listdata = [];
    let data = {};
    console.log(e);
    e.map((item, index) => {
      nhienlieuService.update({ id: item.tentram, data: item }).then((res) => {
        // toast.success("Thanh toán thành công");
        console.log(res.data);
      });
    });

    setLists(e);
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
                  <ImportNhienlieu
                    getdata={getdata}
                    header={header}
                    row={0}
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
                <th scope="col">Tên CSHT</th>
                <th scope="col">Tên Trạm</th>

                <th scope="col">Nhiên liệu</th>

                <th scope="col">Định mức nhiệu (lít/giờ)</th>
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
                        <td>{item.tongtg}</td>
                        <td>{item.gio}</td>
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
export default Nhienlieu;
