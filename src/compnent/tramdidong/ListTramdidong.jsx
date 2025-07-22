import Header from "../../Layout/Header";
import { useState, useEffect } from "react";

import ImportNhienlieu from "../../support/ImportNhienlieu";

import portService from "../../service/portService";
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import TramdidongService from "../../service/TramdidongService";
import AddoreditTDT from "./AddoreditTDT";
import suyhaoService from "../../service/suyhaoService";
import CryptoJS from "crypto-js";
const ListTramdidong = () => {
  const [lists, setLists] = useState([]);
  const [listSW, setListSW] = useState([]);
  const [ring, setRing] = useState("");
  const [listRing, setListRing] = useState([]);
  const [listOLd, setListOld] = useState([]);
    const [textsearch, setTextsearch] = useState([]);
  useEffect(() => {
    suyhaoService.getdata().then((res) => {
      res.data.map((item, index) => {
        item.value = item.id;
        item.label = decryptData(item.tenthuongmai);
        item.ring=item.ring
      });
      let list = [...res.data];

      setListSW(list);
     
      TramdidongService.getdata().then((res) => {
        // res.data.map((items,index)=>{
        //     let indexs=list.findIndex(e=>e.value==items.switch)
        //     items.ring=list[index].ring
        //     console.log(indexs)
        // })
        setLists(res.data);
        setListOld(res.data)
         portService.getdataRing().then((res) => {
                // console.log(res.data);
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
    });
  }, []);
  const changeTextSearch = async (e) => {
    let listfiilter = [...listOLd];
    let listSearch = [...listOLd];
    setTextsearch(e.target.value);
    if (ring) {
      listfiilter = listfiilter.filter(
        (item) =>
          String(findSwbyId(item.switch).ring)
            .toLocaleLowerCase()
            .indexOf(String(ring).toLocaleLowerCase()) != -1
      );
      console.log(listfiilter, ring);
    }
    if (e.target.value) {
      listSearch = listfiilter.filter(
        (item) =>
          String((item.tencsht)).indexOf(String(e.target.value)) !=
            -1 ||
          String((item.tentram))
            .toLocaleLowerCase()
            .indexOf(String(e.target.value).toLocaleLowerCase()) != -1 ||
          String(item.dichvu)
            .toLocaleLowerCase()
            .indexOf(String(e.target.value).toLocaleLowerCase()) != -1  ||
            String(findSwbyId(item.switch).label).indexOf(String(e.target.value)) != -1
           
      );
    }
   console.log(listSearch)
    if (!e.target.value) {
      if (ring) {
        setLists(listfiilter);
      } else setLists(listOLd);
    } else setLists(listSearch);
  };
  const changeRing = (e) => {
    setRing(e ? e.value : null);
    let listfiilter = listOLd;
    let listSearch = listOLd;
    if (textsearch) {
      listSearch = listfiilter.filter(
        (item) =>
          String((item.tencsht)).indexOf(String(textsearch)) !=
        -1 ||
      String((item.tentram))
        .toLocaleLowerCase()
        .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
      String(item.dichvu)
        .toLocaleLowerCase()
        .indexOf(String(textsearch).toLocaleLowerCase()) != -1  ||
        String(findSwbyId(item.switch).label).indexOf(String(textsearch)) != -1
      );
    }
    console.log(listSearch);
    if (e && e.value)
      listSearch = listSearch.filter(
        (item) =>
          String(findSwbyId(item.switch).ring)
            .toLocaleLowerCase()
            .indexOf(e.value.toLocaleLowerCase()) != -1
      );

      setLists(listSearch);

    // console.log(e);
  };
  const findSwbyId = (id) => {
    
    let index = listSW.findIndex((e) => e.id == id);
    console.log(listSW[index])
    return listSW[index];
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
  const save = () => {};
  const getdata = (e) => {
    console.log(e);
    portService.addDataRing(e).then((res) => {
      console.log(res.data);
    });
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
      TramdidongService.deletedata(id).then((res) => {
        setLists(lists.filter((e) => e.id != id));
        toast.success("Xóa thiết bị thành công");
      });
    }
  };
  const addoredit = () => {
    TramdidongService.getdata().then((res) => {
         let listSearch = res.data;
   
         if (textsearch) {
           listSearch = res.data.filter(
             (item) =>
              String((item.tencsht)).indexOf(String(textsearch)) !=
             -1 ||
           String((item.tentram))
             .toLocaleLowerCase()
             .indexOf(String(textsearch).toLocaleLowerCase()) != -1 ||
           String(item.dichvu)
             .toLocaleLowerCase()
             .indexOf(String(textsearch).toLocaleLowerCase()) != -1  ||
             String(findSwbyId(item.switch).label).indexOf(String(textsearch)) != -1
           );
         }
         console.log(listSearch);
         if (ring) {
           listSearch = listSearch.filter(
             (item) =>
              String(findSwbyId(item.switch).ring)
             .toLocaleLowerCase()
             .indexOf(String(ring).toLocaleLowerCase()) != -1
           );
           console.log(listSearch, ring);
         }
         setLists(listSearch);
         setListOld(res.data);
         console.log(res.data);
       });
  };
  return (
    <>
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-5 ">
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
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-sm-1">
              <AddoreditTDT
                status="add"
                addoredit={addoredit}
                // listthietbi={listthietbi}
              />
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            {/* <div className="col col-md-5">
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
            </div> */}
          </div>
          <table className="table mt-3 table-bordered   table-hover ">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Mã Trạm</th>
                <th scope="col">Tên Trạm</th>
                <th scope="col">Dịch vụ</th>
                <th scope="col">DP</th>
                <th scope="col">Port</th>
                <th scope="col">Switch</th>
                <th scope="col">Ring</th>
                <th scope="col">Quản lý</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists
                  .sort((a, b) => b.id-a.id)
                  .map((item, index) => {
                    return (
                      <tr className="text-center" role="alert" key={index}>
                        <td className="text-center">{item.tentram}</td>
                        <td className="text-center">{item.tencsht}</td>
                        <td className="text-center">{item.dichvu}</td>
                        <td className="text-center">
                          {item.dp == 1 ? "DP" : "Không"}
                        </td>
                        <td className="text-center">{item.port}</td>
                        <td className="text-center">
                          {findSwbyId(item.switch).label}
                        </td>
                        <td className="text-center">
                          {findSwbyId(item.switch).ring}
                        </td>
                        <td>
                          <div class="d-flex justify-content-center mx-2">
                            <AddoreditTDT
                              status="edit"
                              data={item}
                              addoredit={addoredit}
                              // listthietbi={listthietbi}
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
      </main>
    </>
  );
};
export default ListTramdidong;
