import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Paginations from "../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import Swal from "sweetalert2";

import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import suyhaoService from "../../service/suyhaoService";
import AddOrEdit from "./AddOrEdit";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import ImportThietbi from "../../support/ImportThietbi";
import Loading from "../../support/Loading";
import mainEService from "../../service/mainEService";
const List_mainE = (props) => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [list, setList] = useState([]);
  const [listOLd, setListOld] = useState([]);
  const [listPg, setListPg] = useState([]);
  const [textsearch, setTextsearch] = useState([]);
  const [loading, setloading] = useState(false);
  const [ngaykt, setngaykt] = useState(getTodayDate());
  const usered = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  const [listthietbi, setListthietbi] = useState([]);
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
    let listfiilter = listOLd;
    let listSearch = [];
    setTextsearch(e.target.value);

    if (e.target.value) {
      listSearch = listfiilter.filter(
        (item) =>
          String(decryptData(item.diachi)).indexOf(String(e.target.value)) !=
            -1 ||
          String(decryptData(item.tenthietbi))
            .toLocaleLowerCase()
            .indexOf(String(e.target.value).toLocaleLowerCase()) != -1 ||
          String(item.loai)
            .toLocaleLowerCase()
            .indexOf(String(e.target.value).toLocaleLowerCase()) != -1 ||
          String(item.port).indexOf(String(e.target.value)) != -1
      );
    }
    if (!e.target.value) setListthietbi(listOLd);
    else setListthietbi(listSearch);
  };
  const getdata = (e) => {
    let listdata = [];
    let data = {};
    setloading(true);
    console.log(e);
    listthietbi.map((item, i) => {
      e = Object.values(e).filter(
        (items) => items.diachi != decryptData(item.diachi)
      );
    });
    console.log(e);
    let lists = listthietbi;
    if (e && Object.values(e).length > 0) {
      e.map((item, index) => {
        item.ip = encryptData(item.ip);
        item.password = encryptData(item.password);
        item.tentram = encryptData(item.tentram);
        item.username = encryptData(item.username);
        lists.push(item);
      });
      mainEService
        .addData(e)
        .then((res) => {
          toast.success("Import dữ liệu thành công");
          setloading(false);
          console.log(res.data);
          setListthietbi([...lists]);
          setListOld(lists);
        })
        .catch((e) => {
          toast.error("File không đúng định dạng ");
          setloading(false);
          console.log(e);
        });
    } else {
      toast.info("Dữ liệu đã tồn tại!");
      setloading(false);
    }
  };
  const addoredit = () => {
    suyhaoService.getdata().then((res) => {
      setListthietbi(res.data);
      setListOld(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    mainEService.getdata().then((res) => {
      setListthietbi(res.data);
      setListOld(res.data);
      console.log(res.data);
    }).catch(e=>{
      setListthietbi([]);
      setListOld([]);
    });
  }, []);
  const deleteThietbi = async (id) => {
    console.log(id);
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa ?",
      text: "Dữ liệu sẽ xóa vĩnh viễn và không thể khôi phục.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      suyhaoService.deletedata(id).then((res) => {
        setListthietbi(listthietbi.filter((e) => e.id != id));
        toast.success("Xóa thiết bị thành công");
      });
    }
  };
  const imports = () => {
    setloading(true);
  };
  return (
    <>
      {loading && (
        // <div className="overlay">
        //   <div className="spinner-border text-primary" role="status">
        //     <span className="sr-only">Loading...</span>
        //   </div>
        // </div>
        <Loading />
      )}
      <Header />

      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-3">
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
            <div className="col col-md-1" onClick={() => imports()}>
              <ImportThietbi
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
            <div className="col col-2 col-md-2 d-flex flex-column justify-content-center align-items-start">
              <AddOrEdit
                status="add"
                listthietbi={listthietbi}
                addoredit={addoredit}
              />
              {/* <NavLink to="/themchuyenacquy">
                <button className="btn btn-lg d-block fs-2 btn-primary">
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
              </NavLink> */}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table mt-3 table-bordered   table-hover ">
              <thead className="thead-dark">
                <tr id="tramchuyen">
                  <th>STT</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Tên thiêt bị</th>
                  <th scope="col">Quản lý</th>
                </tr>
              </thead>
              <tbody>
                {listPg &&
                  listPg.map((item, index) => {
                    return (
                      <tr className="alert " role="alert" key={index}>
                        <td scope="row">{index + 1}</td>
                        <td>{decryptData(item.ip)}</td>
                        <td>{decryptData(item.tentram)}</td>

                     

                        <td>
                          <div class="d-flex justify-content-center mx-2">
                            <AddOrEdit
                              status="edit"
                              data={item}
                              addoredit={addoredit}
                              listthietbi={listthietbi}
                            />
                            <button
                              className="btn btn-lg  fs-2 btn-danger"
                              onClick={() => deleteThietbi(item.id)}
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <Paginations itemsPerPage={20} list={listthietbi} getlist={getlist} />
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
export default connect(mapStateToProps, mapDispatchToProps)(List_mainE);
