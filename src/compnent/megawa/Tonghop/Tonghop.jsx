import Header from "../../../Layout/Header";
import { useState, useEffect } from "react";

import Paginations from "../../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImportNhienlieu from "../../../support/ImportNhienlieu";
import { da } from "date-fns/locale";
import nhienlieuService from "../../../service/nhienlieuService";
import TonghopService from "../../../service/TonghopService";
import CryptoJS from "crypto-js";
import Tonghop_view from "./Tonghop_view";
//mã hóa
// const encrypted = CryptoJS.AES.encrypt("data", "vnpt").toString();
// console.log(encrypted);
//giải mã
// const bytes = CryptoJS.AES.decrypt(encrypted, "vnpt");
// const decrypted = bytes.toString(CryptoJS.enc.Utf8);
// console.log(decrypted);
const Tonghop = () => {
  const [listTonghop, setListTonghop] = useState([]);
  const [listOLd, setListOld] = useState([]);
  const [listPg, setListPg] = useState([]);
  const [textsearch, setTextsearch] = useState([]);
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
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  const getlist = (e) => {
    setListPg(e);
  };
  const decryptData = (encryptedData) => {
    let secretKey = "vnpt";
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    } catch (error) {
      console.error("Error decrypting data: ", error);
      return null;
    }
  };
  const encryptData = (data) => {
    let secretKey = "vnpt";
    try {
      const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
      return encryptedData;
    } catch (error) {
      console.error("Error encrypting data: ", error);
      return null;
    }
  };
  const changeTextSearch = async (e) => {
    let listSearch = listOLd;
    let listfiilter =
      String(textsearch).length < String(e.target.value)
        ? listTonghop
        : listOLd;
    setTextsearch(e.target.value);

    if (e.target.value) {
      listSearch = listfiilter.filter(
        (item) =>
          String(
            removeDiacritics(decryptData(item.donvi).toLowerCase())
          ).indexOf(String(removeDiacritics(e.target.value)).toLowerCase()) !=
            -1 ||
          String(
            removeDiacritics(decryptData(item.tenkhachhang).toLowerCase())
          ).indexOf(String(removeDiacritics(e.target.value)).toLowerCase()) !=
            -1 ||
          String(
            removeDiacritics(decryptData(item.account).toLowerCase())
          ).indexOf(String(removeDiacritics(e.target.value)).toLowerCase()) !=
            -1 ||
          String(
            removeDiacritics(decryptData(item.diachi).toLowerCase())
          ).indexOf(String(removeDiacritics(e.target.value)).toLowerCase()) !=
            -1
      );
    }

    setListTonghop(listSearch);
  };
  useEffect(() => {
    TonghopService.getAll().then((res) => {
      setListTonghop(Object.values(res.data));
      setListOld(Object.values(res.data));
    });
  }, []);
  const getdata = (e) => {
    let listdata = [];
    let data = {};
    console.log(e);
    e.map((item, index) => {
      item.donvi = encryptData(item.donvi);
      item.tenkhachhang = encryptData(item.tenkhachhang);
      item.account = encryptData(item.account);
      item.diachi = encryptData(item.diachi);
      item.l2sw = encryptData(item.l2sw);
      item.wan = encryptData(item.wan);
      item.wamdoosan = encryptData(item.wamdoosan);

      TonghopService.update({ id: item.id, data: item }).then((res) => {
        // toast.success("Thanh toán thành công");
        console.log(res.data);
      });
    });
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
                onChange={(e) => changeTextSearch(e)}
                value={textsearch}
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
          <table className="table mt-3 table-bordered   table-hover ">
            <thead className="thead-dark">
              <tr>
                <th>STT</th>
                <th scope="col">Đơn vị</th>
                <th scope="col">Tên khách hàng</th>

                <th scope="col">Account</th>

                <th scope="col">Địa chỉ</th>
                <th scope="col">SVLAN</th>
                <th scope="col">CVLAN</th>
                <th scope="col">PORT/L2-SW</th>
                <th scope="col">L2-SW</th>
                <th scope="col">Quản lý</th>
              </tr>
            </thead>
            <tbody>
              {listPg &&
                listPg
                  .sort((a, b) => b.tram - a.tram)
                  .map((item, index) => {
                    return (
                      <tr className="alert " role="alert" key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{decryptData(item.donvi)}</td>
                        <td>{decryptData(item.tenkhachhang)}</td>

                        <td>{decryptData(item.donvi)}</td>

                        <td>{decryptData(item.diachi)}</td>
                        <td>{item.svlan}</td>
                        <td>{item.cvlan}</td>
                        <td>{item.portl2sw}</td>
                        <td>{decryptData(item.l2sw)}</td>
                        <td>
                          <Tonghop_view data={item} />
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          <Paginations itemsPerPage={20} list={listTonghop} getlist={getlist} />
        </div>
      </main>
    </>
  );
};
export default Tonghop;
