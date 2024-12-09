import Header from "../../Layout/Header";
import { useState, useEffect } from "react";

import Paginations from "../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import { da } from "date-fns/locale";

import portService from "../../service/portService";
import { Modal } from "react-bootstrap";
import suyhaoService from "../../service/suyhaoService";
const ListRing = () => {
  const [lists, setLists] = useState([]);
  const [show, setshow] = useState(false);

  const [tenthietbi, settenthietbi] = useState("");
  const [loaithietbi, setloaithietbi] = useState("");
  const [listthietbi, setlistthietbi] = useState([]);
  const openModal = () => {
    setshow(true);
  };
  const ChangeTypeDevice = (e) => {
    console.log(e);
    setloaithietbi(e.target.value);
  };
  const ChangeNameDevice = (e) => {
    settenthietbi(e.target.value);
  };
  useEffect(() => {
    portService.getdataRing().then(res => {
      setLists(res.data)
    })
  }, []);
  const RandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const save = () => {

  };
  const getdata = (e) => {
    console.log(e);
    portService.addDataRing(e).then((res) => {
      console.log(res.data);
    });
  };
  return (
    <>
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-5 ">
            <div className="col col-md-5">
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
            <div className="col col-sm-1">

              <button
                className="btn btn-lg btn-primary mx-1 float-right"
                onClick={() => openModal()}
              >
                {/* <i className="fa fa-plus" aria-hidden="true"></i> */}
                Thêm <i className="fa fa-plus" aria-hidden="true"></i>
              </button>

            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-5">
              <div className="row">

                <div className="col col-md-10">
                  <ImportNhienlieu
                    getdata={getdata}
                    header={[]}
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
          <table className="table mt-3 table-bordered   table-hover ">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Tên Ring</th>
                <th scope="col">Đơn vị</th>

              </tr>
            </thead>
            <tbody>
              {lists &&
                lists
                  .sort((a, b) => {
                    // Sắp xếp theo attribute1 (chuỗi) trước
                    const result = a.donvi.localeCompare(b.donvi);
                    if (result !== 0) return result;
                    // Nếu attribute1 bằng nhau, sắp xếp theo attribute2 (số)
                    return a.ten.localeCompare(b.ten);;
                  })
                  .map((item, index) => {
                    return (
                      <tr
                        className={
                          item.status == "down" ||
                            item.status == "Down" ||
                            Number(item.rx) < Number(item.low)
                            ? "alert tr-backgroud "
                            : "alert"
                        }
                        role="alert"
                        key={index}
                      >

                        <td className="text-center">{item.ten}</td>
                        <td className="text-center">{item.donvi}</td>
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
export default ListRing;
