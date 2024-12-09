import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { da } from "date-fns/locale";
import TramOLtService from "../../service/TramOLtService";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import TuyenKTService from "../../service/TuyenKTService";
import AddorEditTuyenKT from "./AddorEditTuyenKT";
import AddorEditSL_Cong from "./AddorEditSL_Cong";
import Paginations from "../../support/Paginations";
import Swal from "sweetalert2";

const ListTuyenKT_TT = () => {
  const [lists, setLists] = useState([]);
  const [listOld, setListOld] = useState([]);
  const [listPg, setListPg] = useState([]);
  const [text,settext]=useState("")
  const header = [
    ["id", "tenhethong", "ip", "pon", "tuyenkt", "trungtamvienthong"],
  ];
  const getdata = (e) => {
    let listdata = [];
    let data = {};
    console.log(e);

    TuyenKTService.addData_TT(e).then((res) => {
      // toast.success("Thanh toán thành công");
      console.log(res.data);
    });

    setLists(e);
  };
  const getlist = (e) => {
    setListPg(e);
  };
  useEffect(() => {
    TuyenKTService.getdata_TT()
      .then((res) => {
        setLists(res.data);
        setListOld(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        setLists([]);
      });
  }, []);
  
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
        popup: 'swal-wide' // Thêm lớp tùy chỉnh
      },
    });

    if (result.isConfirmed) {
      TuyenKTService.DeleteDataTuyenKt_TT(id).then((res) => {
        setLists(lists.filter((e) => e.tuyenkt != id));
       setListOld(listOld.filter((e) => e.tuyenkt != id))
       
        toast.success("Xóa tuyến kĩ thuật thành công");
        if (text){
          search(text)
        }
      });
    }
  };
  const save=(status,item)=>{

   if (status=="add"){
    let listSave=lists
    listSave.push(item)
    setLists([...listSave])
    setListOld([...listSave])

   }
   else{

    let listSave=lists
    console.log(item)
    let index=listSave.findIndex(e=>e.tuyenkt==item.tuyenkt)

    listSave[index].matt=item.matt
    listSave[index].tennv=item.tennv
    listSave[index].sl=item.sl
    listSave[index].ttvt=item.ttvt
    console.log(listSave[index])
    setLists([...listSave])
    setListOld([...listSave])
 
    if (text){
      search(text)
    }
   }
  }
  const search=(e)=>{
    settext(e)
   let listSearch = listOld.filter(
      (item) =>
        String((item.tuyenkt)) .toLocaleLowerCase().indexOf(String(e) .toLocaleLowerCase()) !=
          -1 ||
        String((item.tennv))
          .toLocaleLowerCase()
          .indexOf(String(e).toLocaleLowerCase()) != -1 ||
        String(item.ttvt)
          .toLocaleLowerCase()
          .indexOf(String(e).toLocaleLowerCase()) != -1 
    );
    setLists(listSearch)
  }
  return (
    <>
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
              <AddorEditSL_Cong status="add" save={save} />
            </div>
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

                <th scope="col">Tuyến KT</th>

                <th scope="col">TTVT</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Nhân viên kỹ thuật</th>
                <th scope="col">Quản lý</th>
              </tr>
            </thead>
            <tbody>
              {listPg &&
                listPg
                  .sort((a, b) => a.ttvt.localeCompare(b.ttvt))
                  .map((item, index) => {
                    return (
                      <tr className="alert " role="alert" key={index}>
                        <td className="text-center"> {index + 1}</td>
                        <td className="text-center">{item.tuyenkt}</td>
                        <td className="text-center">{item.ttvt}</td>

                        <td className="text-center">{item.sl}</td>
                        <td className="text-center">{item.tennv}</td>
                        <td className="text-center">
                          {" "}
                          <AddorEditSL_Cong
                            status="edit"
                            data={item}
                            save={save}
                          />
                          <button
                            className="btn btn-lg  fs-2 btn-danger"
                            onClick={() => Delete_TuyenKT(item.tuyenkt)}
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
export default ListTuyenKT_TT;
