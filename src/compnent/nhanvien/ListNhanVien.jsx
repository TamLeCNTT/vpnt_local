import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { da } from "date-fns/locale";
import NhanvienService from "../../service/NhanvienService";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import AddorEditNhanVien from "./AddorEditNhanVien";
const ListNhanVien = () => {
  const [lists, setLists] = useState([]);
  const [listexport, setListexport] = useState([]);
  const [listold, setListold] = useState([]);
  const [text, setText] = useState([]);
  const header = [["STT","Tên nhân viên","Tuyến kĩ thuật","trung tâm viễn thông"]];
  const getdata = (e) => {
    let listdata = [];
    let data = {};
    console.log(e);

    NhanvienService.addData(e).then((res) => {
      toast.success("Thêm dữ liệu thành công");
      console.log(res.data);
    }).catch(e=>{
      console.log(e)
    });

    // setLists(e);
    // setListexport(e)
    
  };
  const setdata=(list)=>{
    let listSave=[]
    list.map((data,index)=>{
      let item={}
      item.matram=data.matram
      item.tentram=data.tentram
      item.tenhethong=data.tenhethong
      item.his=data.his
      item.mytv=data.mytv
      item.ims=data.ims
      item.loai=data.loai
      item.username=data.username
      item.password=data.password
      item.ip=data.ip
      item.port=data.port

      listSave.push(item)
    })
    setListexport(listSave)
    
  }
  useEffect(() => {
    NhanvienService.getdata().then((res) => {
     
      console.log(res.data)
      setLists(res.data)
      setListexport(res.data)
     
    });
  }, []);
  const search=(e)=>{
    console.log("oak")
    setText(e)
    setLists([])
    let listfiilter = listold;
    let listSearch = [];
   
    console.log(listfiilter)
    if (e) {
      listSearch = listfiilter.filter(
        (item) =>
          String((item.ip)).indexOf(String(e)) !=
            -1 ||
          String( (item.loai))
            .toLocaleLowerCase()
            .indexOf(String(e).toLocaleLowerCase()) != -1 ||
            String( (item.matram))
            .toLocaleLowerCase()
            .indexOf(String(e).toLocaleLowerCase()) != -1 ||
          String(item.tentram)
            .toLocaleLowerCase()
            .indexOf(String(e).toLocaleLowerCase()) != -1 ||
          String(item.his).indexOf(String(e)) != -1
      );
    }
    if (!e) {
      setLists(listold);
      setListexport(listold);
    }
    else {
      setLists(listSearch);
      setListexport(listSearch);
    }
  }
  const save=()=>{
   
      NhanvienService.getdata().then((res) => {
        
      
        setdata(res.data)
        let listfiilter = res.data;
        let listSearch = [];
       
        console.log(listfiilter)
        if (text) {
          listSearch = listfiilter.filter(
            (item) =>
              String((item.ip)).indexOf(String(text)) !=
                -1 ||
              String( (item.loai))
                .toLocaleLowerCase()
                .indexOf(String(text).toLocaleLowerCase()) != -1 ||
              String(item.tentram)
                .toLocaleLowerCase()
                .indexOf(String(text).toLocaleLowerCase()) != -1 ||
              String(item.his).indexOf(String(text)) != -1
          );
        }
        if (!text) {
          setLists(res.data);
          setListexport(res.data)
        }
        else {
          setLists(listSearch);
          setListexport(listSearch);
        
        }
      });
    
  }

  const Delete_olt = async (id) => {
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
      NhanvienService.deletedata(id).then((res) => {
        setLists(lists.filter((e) => e.id != id));
        setListold(listold.filter((e) => e.id != id))
        setListexport(lists.filter((e) => e.id != id));
        toast.success("Xóa thiết bị thành công");
      });
    }
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
                onChange={(e) => search(e.target.value)}
                value={text}
                placeholder="Nhập nội dung tìm kiếm"
              />
            </div>
            <div className="col col-md-1">
            <AddorEditNhanVien
                status="add"
                save={save}
              />
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-5">
              <div className="row">
                <div className="col col-md-10">
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
              </div>
            </div>
           
          </div>
          <table className="table mt-3 table-bordered   table-hover ">
            <thead className="thead-dark">
              <tr>
                <th>STT</th>
               

                <th scope="col">TÊN NHÂN VIÊN</th>
                <th scope="col">TUYẾN KỸ THUẬT</th>
                <th scope="col">TRUNG TÂM VIỄN THÔNG</th>
                {/* <th scope="col">Port Uplink</th> */}
                <th scope="col">QUẢN LÝ</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists
                  .sort((a, b) => b.trungtamvienthong - a.trungtamvienthong)
                  .map((item, index) => {
                    return (
                      <tr className="alert " role="alert" key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{item.tennhanvien}</td>
                        <td className="text-center">{item.tuyenkt}</td>  
                         <td className="text-center">{item.trungtamvienthong}</td>
                   
                       
                        {/* <td>{item.port}</td> */}
                        <td>  
                          
                          {/* <AddTramOlt data={item} save={save}
                status="edit"
               
              /> */}
               <button
                              className="btn btn-lg  fs-2 btn-danger"
                              onClick={() => 
                                Delete_olt(item.id)}
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
              
              
              </td>
                        {/* <td className="manage"> */}
                        {/* <a href="#" className="close" data-dismiss="alert" aria-label="Close" onClick={() => xoa(item.cabinId)}>
                                                            <span aria-hidden="true"><i className="fa fa-close"></i></span>
                                                        </a> */}
                        {/* <Student_Edit id={item.studentId} listst={listst} listgv={listgv} save={save} /> */}
                        {/* </td> */}
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
export default ListNhanVien;
