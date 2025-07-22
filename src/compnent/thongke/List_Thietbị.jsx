import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Paginations from "../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import Swal from "sweetalert2";
import Select from "react-select";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import suyhaoService from "../../service/suyhaoService";
import AddOrEdit from "./AddOrEdit";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import ImportThietbi from "../../support/ImportThietbi";
import Loading from "../../support/Loading";
import portService from "../../service/portService";
import { components } from "react-select";

const List_Thietbị = (props) => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [listRing, setListRing] = useState([]);
  const [list, setList] = useState([]);
  const [listOLd, setListOld] = useState([]);
  const [listPg, setListPg] = useState([]);
  const [textsearch, setTextsearch] = useState([]);
   const [listexport, setListexport] = useState([]);
  const [loading, setloading] = useState(false);
  const [ngaykt, setngaykt] = useState(getTodayDate());
  const usered = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const [ring, setRing] = useState("");
  const [listthietbi, setListthietbi] = useState([]);
  let native = useNavigate();

  const header = [
    [
      "IP",
      "username",
      "Password",
      "Tên hệ thống",
      "Tên SW",
      "RING",
      "Loại",
      "Port UpLink",
      "Số lượng nguồn",
      "UP"
      
    ],
  ];
  const changeRing = (e) => {
    setRing(e ? e.value : null);
    let listfiilter = listOLd;
    let listSearch = listOLd;
    if (textsearch) {
      listSearch = listfiilter.filter(
        (item) =>
          String(decryptData(item.diachi)).indexOf(String(textsearch)) != -1 ||
          String(decryptData(item.tenthuongmai))
            .toLocaleLowerCase()
            .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
          String(item.loai)
            .toLocaleLowerCase()
            .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
          String(item.port).indexOf(String(textsearch)) != -1
      );
    }
    console.log(listSearch);
    if (e && e.value)
      listSearch = listSearch.filter(
        (item) =>
          String(item.ring)
            .toLocaleLowerCase()
            .indexOf(e.value.toLocaleLowerCase()) != -1
      );

    setListthietbi(listSearch);

    console.log(e);
  };
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
    let listfiilter = [...listOLd];
    let listSearch = [...listOLd];
    setTextsearch(e.target.value);
    if (ring) {
      listfiilter = listfiilter.filter(
        (item) =>
          String(item.ring)
            .toLocaleLowerCase()
            .indexOf(String(ring).toLocaleLowerCase()) != -1
      );
      console.log(listfiilter, ring);
    }
    if (e.target.value) {
      listSearch = listfiilter.filter(
        (item) =>
          String(decryptData(item.diachi)).indexOf(String(e.target.value)) !=
            -1 ||
          String(decryptData(item.tenthuongmai))
            .toLocaleLowerCase()
            .indexOf(String(e.target.value).toLocaleLowerCase()) != -1 ||
          String(item.loai)
            .toLocaleLowerCase()
            .indexOf(String(e.target.value).toLocaleLowerCase()) != -1 ||
          String(item.port).indexOf(String(e.target.value)) != -1
      );
    }
    if (!e.target.value) {
      if (ring) {
        setListthietbi(listfiilter);
      } else setListthietbi(listOLd);
    } else setListthietbi(listSearch);
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
        item.id = RandomString(10);
        item.diachi = encryptData(item.diachi);
        item.password = encryptData(item.password);
        item.tenthietbi = encryptData(item.tenthietbi);
        item.tenthuongmai = encryptData(item.tenthuongmai);
        item.username = encryptData(item.username);
        lists.push(item);
      });
      console.log(e)
      suyhaoService
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
  const addoredit = () => {
    suyhaoService.getdata().then((res) => {
      let listSearch = res.data;

      if (textsearch) {
        listSearch = res.data.filter(
          (item) =>
            String(decryptData(item.diachi)).indexOf(String(textsearch)) !=
              -1 ||
            String(decryptData(item.tenthuongmai))
              .toLocaleLowerCase()
              .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
            String(item.loai)
              .toLocaleLowerCase()
              .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
            String(item.port).indexOf(String(textsearch)) != -1
        );
      }
      console.log(listSearch);
      if (ring) {
        listSearch = listSearch.filter(
          (item) =>
            String(item.ring)
              .toLocaleLowerCase()
              .indexOf(String(ring).toLocaleLowerCase()) != -1
        );
        console.log(listSearch, ring);
      }
      setListthietbi(listSearch);
      setListOld(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    suyhaoService.getdata().then((res) => {
      setListthietbi(res.data);
      setListOld(res.data);
      console.log(res.data);
      let listep=[]
      let sl=0
      res.data.map( async(item,index)=>{
        let items={ip:decryptData(item.diachi),user:decryptData(item.username),pass:decryptData(item.password),tenthietbi:decryptData(item.tenthietbi),tenthuongmai:decryptData(item.tenthuongmai),ring:item.ring,loai:item.loai,port:item.port,nguon:item.nguon}
        items.up=0
        // if (item.loai=="OS6400"){
        //   console.log(items)
        // await suyhaoService.getstatus_port_by_A6400(decryptData(item.diachi),decryptData(item.username),decryptData(item.password)).then(
        //     res=>{
        //       console.log(res.data)
        //       items.up=res.data.Up
        //     }
        //   )
        // }
        // else{
        //   if (item.loai=="V2224G"){
        //    sl=sl+1
        //   await suyhaoService.getstatus_port_by_SW2224(decryptData(item.diachi),decryptData(item.username),decryptData(item.password)).then(
        //       res=>{
        //         console.log(res.data)
        //         items.up=res.data.Up
        //       }
        //     )
        //   }
        // }
        listep.push(items)
      })
      console.log(sl)
      setListexport(listep)
      portService.getdataRing().then((res) => {
        
        res.data
          .sort((a, b) => {
            const lastThreeA = a.ten; // Lấy 3 ký tự cuối của a.ten
            const lastThreeB = b.ten; // Lấy 3 ký tự cuối của b.ten
            return lastThreeA.localeCompare(lastThreeB); // So sánh theo thứ tự từ điển
          })
          .map((item, index) => {
            item.value = item.ten;
            item.label = item.ten;
          });

        let list = [];
        list = [...res.data];
        // let item = { value: "", label: "" };
        // list.push(item);
        setListRing(list);
       
      });
    });
  }, []);
  const clearFilter = () => {
    setRing(null); // Xóa lựa chọn lọc
    let listfiilter = listOLd;
    let listSearch = [];
    if (textsearch) {
      listfiilter = listfiilter.filter(
        (item) =>
          String(decryptData(item.diachi)).indexOf(String(textsearch)) != -1 ||
          String(decryptData(item.tenthuongmai))
            .toLocaleLowerCase()
            .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
          String(item.loai)
            .toLocaleLowerCase()
            .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
          String(item.port).indexOf(String(textsearch)) != -1
      );
    }
    setListthietbi(listfiilter);
  };
  const deleteThietbi = async (id) => {
    console.log(id);
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa ?",
      text: "Dữ liệu sẽ xóa vĩnh viễn và không thể khôi phục.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      customClass: {
        popup: "swal-wide", // Thêm lớp tùy chỉnh
      },
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
            <div className="col col-md-4">
              <input
                type="text"
                className="form-control  ms-2 "
                id="teacher"
                onChange={(e) => changeTextSearch(e)}
                value={textsearch}
                placeholder="Nhập nội dung tìm kiếm"
              />
            </div>
            <div className="col col-md-3">
              <Select
                className="select"
                onChange={(e) => changeRing(e)}
                options={listRing}
                value={listRing.find((option) => option.value === ring) || null}
                isClearable={true}
              />
            </div>
            <div className="col col-md-3" onClick={() => imports()}>
            {/* <ImportNhienlieu
                    getdata={getdata}
                    header={header}
                    data={listexport}
                    row={0}
                    name={
                      "DanhSach_Tram_OLT_" +
                      new Date().getFullYear() +
                      "_" +
                      new Date().getMonth() +
                      "_" +
                      new Date().getDate()
                    }
              /> */}
               <ImportNhienlieu
                    getdata={getdata}
                    header={header}
                    data={listexport}
                    row={0}
                    name={
                      "DanhSach_Tram_OLT_" +
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

                  <th scope="col">Loại</th>
                  <th scope="col">Port</th>
                  <th scope="col">Ring</th>
                  <th scope="col">Quản lý</th>
                </tr>
              </thead>
              <tbody>
                {listPg &&
                  listPg .sort((a, b) =>  a.diachi.localeCompare(b.diachi)).map((item, index) => {
                    return (
                      <tr className="alert " role="alert" key={index}>
                        <td className="text-center" scope="row">
                          {index + 1}
                        </td>
                        <td className="text-center">
                          {decryptData(item.diachi)}
                        </td>
                        <td className="text-center">
                          {decryptData(item.tenthuongmai)}
                        </td>

                        <td className="text-center"> {item.loai}</td>
                        <td className="text-center"> {item.port}</td>
                        <td className="text-center"> {item.ring}</td>

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
export default connect(mapStateToProps, mapDispatchToProps)(List_Thietbị);
