import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { da } from "date-fns/locale";
import TramOLtService from "../../service/TramOLtService";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import TuyenKTService from "../../service/TuyenKTService";
import AddTramOlt from "../olt/AddTramOlt";
import AddorEditTuyenKT from "./AddorEditTuyenKT";
import Loading from "../../support/Loading";
import Paginations from "../../support/Paginations";
import Swal from "sweetalert2";

const ListTuyenKT = () => {
  const [lists, setLists] = useState([]);
  const [listOld, setListOld] = useState([]);
  const [listPg, setListPg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flag, setlag] = useState(false);
  const [text, settext] = useState("");
  const header = [
    ["id", "tenhethong", "ip", "pon", "tuyenkt", "trungtamvienthong"],
  ];
  const getdata = (e) => {
    console.log(e);
    TuyenKTService.addData(e).then((res) => {
      toast.success("Thêm dữ liệu thành công");
      console.log(res.data);
    });
    setLists(e);
  };
  const search = (e) => {
    settext(e);
    console.log(listOld);
    let listSearch = listOld.filter(
      (item) =>
        String(item.id).indexOf(String(e)) != -1 ||
        String(item.tenhethong)
          .toLocaleLowerCase()
          .indexOf(String(e).toLocaleLowerCase()) != -1 ||
        String(item.tuyenkt)
          .toLocaleLowerCase()
          .indexOf(String(e).toLocaleLowerCase()) != -1 ||
        String(item.trungtamvienthong).indexOf(String(e)) != -1
    );
    setLists(listSearch);
  };
  useEffect(() => {
    setLoading(true);
    TuyenKTService.getdata()
      .then((res) => {
        setLoading(false);
        setLists(res.data);
        setListOld(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        setLists([]);
      });
  }, [flag]);
  const save = (status, item) => {
    setLoading(true);
    if (status == "add") {
      let listSave = lists;
      listSave.push(item);
      setLists([...listSave]);
      setListOld([...listSave]);
      if (text) {
        search(text);
      }
      setLoading(false);
    } else {
      let listSave = lists;
      console.log(item);
      let index = listSave.findIndex((e) => e.id == item.id);
      listSave[index].ip = item.ip;
      listSave[index].pon = item.pon;
      listSave[index].tuyenkt = item.tuyenkt;
      listSave[index].tenhethong = item.tenhethong;
      listSave[index].trungtamvienthong = item.trungtamvienthong;
      console.log(listSave[index]);
      setLists([...listSave]);
      setListOld([...listSave]);
      setLoading(false);
      if (text) {
        search(text);
      }
    }
  };
  const getlist = (e) => {
    setListPg(e);
  };

  const Delete_TuyenKT = async (id) => {
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
      TuyenKTService.DeleteDataTuyenKt(id).then((res) => {
        setLists(lists.filter((e) => e.id != id));
        setListOld(listOld.filter((e) => e.id != id));
        toast.success("Xóa tuyến kĩ thuật thành công");
        if (text) {
          search(text);
        }
      });
    }
  };
  return (
    <>
      {loading && <Loading />}
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-5  ">
            <div className="col col-md-5">
              <input
                type="text"
                className="form-control  ms-2 "
                id="teacher"
                onChange={(e) => search(e.target.value)}
                value={text}
                placeholder="Nhập nội dung tìm kiếm"
              />
            </div>
            <div className="col col-md-1">
              <AddorEditTuyenKT status="add" save={save} />
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-5">
              <div className="row">
                <div className="col col-md-10">
                  <ImportNhienlieu
                    getdata={getdata}
                    header={header}
                    data={[]}
                    row={0}
                    name={
                      "Mau_tuyen_kt_" +
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
                <th scope="col">IP</th>

                <th scope="col">Tên hệ thống</th>

                <th scope="col">Tuyến kỹ thuật</th>
                <th scope="col">TTVT</th>
                <th scope="col">Quản lý</th>
              </tr>
            </thead>
            <tbody>
              {listPg &&
                listPg.map((item, index) => {
                  return (
                    <tr className="alert " role="alert" key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.id}</td>

                      <td className="text-center">{item.tenhethong}</td>

                      <td className="text-center">{item.tuyenkt}</td>
                      <td className="text-center">{item.trungtamvienthong}</td>

                      <td className="text-center">
                        {" "}
                        <AddorEditTuyenKT
                          status="edit"
                          data={item}
                          save={save}
                        />
                        <button
                          className="btn btn-lg  fs-2 btn-danger"
                          onClick={() => Delete_TuyenKT(item.id)}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <Paginations itemsPerPage={20} list={lists} getlist={getlist} />
        </div>
      </main>
    </>
  );
};
export default ListTuyenKT;
