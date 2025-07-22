import Header from "../../Layout/Header";
import { useState, useEffect } from "react";

import ImportNhienlieu from "../../support/ImportNhienlieu";

import portService from "../../service/portService";
import AddAndEditRing from "./AddAndEditRing";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const ListRing = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    portService.getdataRing().then((res) => {
      setLists(res.data);
    });
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
      portService.deletedata_ring(id).then((res) => {
        setLists(lists.filter((e) => e.id != id));
        toast.success("Xóa thiết bị thành công");
      });
    }
  };
  const addoredit = () => {
    portService.getdataRing().then((res) => {
      setLists(res.data);
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
              <AddAndEditRing
                status="add"
                addoredit={addoredit}
                // listthietbi={listthietbi}
              />
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
                <th scope="col">Quản lý</th>
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
                    return a.ten.localeCompare(b.ten);
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
                        <td>
                          <div class="d-flex justify-content-center mx-2">
                            <AddAndEditRing
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
export default ListRing;
