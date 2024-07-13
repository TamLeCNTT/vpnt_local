import Header from "../../Layout/Header";
import { useState, useEffect } from "react";

import Paginations from "../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import { da } from "date-fns/locale";
import Select from "react-select";
import TenTramService from "../../service/TenTramService";
const TenTram = () => {
  const [lists, setLists] = useState([]);
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
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
      TenTramService.update({ id: item.tentram, data: item }).then((res) => {
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
          <div className="container mt-4">
            <h1 className="mb-4">Chọn một loại kem</h1>
            <Select options={options} />
          </div>
        </div>
      </main>
    </>
  );
};
export default TenTram;
