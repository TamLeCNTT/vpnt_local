import Header from "../../Layout/Header";
import { useState, useEffect } from "react";

import Paginations from "../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import ImportNhienlieu from "../../support/ImportNhienlieu";

import TonghopService from "../../service/TonghopService";
import CryptoJS from "crypto-js";

import ThemChuyenAcQuy from "./ThemChuyenAcQuy";
import ChuyenAcQuyService from "../../service/ChuyenAcQuyService";
import { toast } from "react-toastify";
//mã hóa
// const encrypted = CryptoJS.AES.encrypt("data", "vnpt").toString();
// console.log(encrypted);
//giải mã
// const bytes = CryptoJS.AES.decrypt(encrypted, "vnpt");
// const decrypted = bytes.toString(CryptoJS.enc.Utf8);
// console.log(decrypted);
const ChuyenAcQuy = (props) => {
  const [listchuyentram, setListchuyentram] = useState([]);
  const [listOLd, setListOld] = useState([]);
  const [listPg, setListPg] = useState([]);
  const [textsearch, setTextsearch] = useState([]);
  const usered = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  let native = useNavigate();
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
        ? listchuyentram
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
            -1 ||
          String(
            removeDiacritics(decryptData(item.l2sw).toLowerCase())
          ).indexOf(String(removeDiacritics(e.target.value)).toLowerCase()) !=
            -1 ||
          String(removeDiacritics(item.svlan.toLowerCase())).indexOf(
            String(removeDiacritics(e.target.value)).toLowerCase()
          ) != -1 ||
          String(removeDiacritics(item.cvlan.toLowerCase())).indexOf(
            String(removeDiacritics(e.target.value)).toLowerCase()
          ) != -1
      );
    }

    setListchuyentram(listSearch);
  };
  useEffect(() => {
    if (!usered) {
      toast.error("Bạn không đủ quyền hạn");
      native("/");
    } else {
      ChuyenAcQuyService.getAll().then((res) => {
        if (Number(props.dataRedux.user.roleId) > 99)
          setListchuyentram(Object.values(res.data));
        else {
          setListchuyentram(
            Object.values(res.data).filter(
              (e) =>
                String(e.user) ==
                String(decryptData(props.dataRedux.user.username))
            )
          );
          console.log(Object.values(res.data));
        }
      });
    }
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
  const save = (e) => {};
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
                <div className="col col-md-2">
                  <ThemChuyenAcQuy save={save} />
                </div>
                <div className="col col-md-10">
                  <ImportNhienlieu
                    getdata={getdata}
                    header={header}
                    row={0}
                    name={
                      "DanhSach_Chuyen_" +
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
              <tr id="tramchuyen">
                <th>STT</th>
                <th scope="col">Loại chuyển</th>
                <th scope="col">Tên trạm chuyển</th>

                <th scope="col">Chủng loại</th>

                <th scope="col">Serial</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Đơn vị quản lý chuyển</th>
                <th scope="col">Tên trạm nhận</th>
                <th scope="col">Đơn vị quản lý nhận</th>
                <th scope="col">Ghi chú</th>
                <th scope="col">Ngày điều chuyển</th>
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
                        <td scope="row">{index + 1}</td>
                        <td>{item.loaichuyen}</td>
                        <td>{item.tentramc}</td>

                        <td>{item.chungloai}</td>

                        <td>{item.serial}</td>
                        <td>{item.soluong}</td>
                        <td>{item.donvic}</td>
                        <td>{item.tentramn}</td>
                        <td>{item.donvin}</td>
                        <td>{item.ghichu}</td>
                        <td>{item.ngaychuyen}</td>
                        <td></td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          <Paginations
            itemsPerPage={20}
            list={listchuyentram}
            getlist={getlist}
          />
        </div>
      </main>
    </>
  );
};
const mapStateToProps = (state) => {
  return { dataRedux: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: "LOGOUT" }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChuyenAcQuy);
