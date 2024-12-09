import Header from "../Layout/Header";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Paginations from "../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImportNhienlieu from "../support/ImportNhienlieu";
import { da } from "date-fns/locale";
import nhienlieuService from "../service/nhienlieuService";
import Swal from "sweetalert2";

const Nhienlieu = () => {
  const [lists, setLists] = useState([]);
  const [listOLd, setListOld] = useState([]);
  const [listPg, setListPg] = useState([]);
  const [show, setshow] = useState(false);
  const [listold, setListsold] = useState([]);
  const [tentram, settentram] = useState("");
  const [tencsht, settencsht] = useState("");
  const [loainhienlieu, setloainhienlieu] = useState("");
  const [dinhmuc, setdinhmuc] = useState("");
  const [trangthai,settrangthai ] = useState("");
  const [search,setSearch ] = useState("");
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
  const getdata = (e) => {
    let listdata = [];
    let data = {};
    console.log(e);
    nhienlieuService.addData(e).then(res=>{
      toast.success("Thêm dữ liệu thành công!")
      nhienlieuService.getdata().then(res=>{
        console.log(res.data)
        setLists(res.data)
      })
      console.log(res.data)
    }).catch(err=>{
      toast.error(err)
    })

   
  };
  useEffect(()=>{
    nhienlieuService.getdata().then(res=>{
      console.log(res.data,"ok")
      setLists(res.data)
      setListOld(res.data)
      setListsold(res.data)
    })
  },[])
  const openModal=(status)=>{
    if (status!=1){
      settentram(status.tentram)
      settencsht(status.tencsht)
      setloainhienlieu(status.nhienlieu)
      setdinhmuc(status.dinhmuc)
      settrangthai("edit")
    }
    else{
      settentram("")
      settencsht("")
      setloainhienlieu("")
      setdinhmuc("")
      settrangthai("add")
    }
    setshow(true)
  }
  const save=()=>{
if (tentram && tencsht && loainhienlieu&&dinhmuc){
  if(!Number(dinhmuc))
    toast.error("Vui lòng nhập đúng định dạng số cho định mức")
  else{
  let item={
    tentram:tentram,
    tencsht:tencsht,
    nhienlieu:loainhienlieu,
    dinhmuc:dinhmuc
  }
  let listSave=lists
  listSave.push(item)
  if (trangthai=="add")
  nhienlieuService.addData(listSave).then(res=>{
    console.log(res.data)
    toast.success("Thêm dữ liệu thành công")
   

    setLists([...listSave])
    setListOld([...listSave])
    if (search){
      search(search)
    }
  }).catch(er=>{
    toast.error("Dữ liệu đã tồn tại")
  
  })
  else{
    nhienlieuService.UpdateData(item).then(res=>{
      console.log(res.data)
      toast.success("Cập nhật dữ liệu thành công")
      let listSave=lists
      console.log(item)
      let index=listSave.findIndex(e=>e.tentram==item.tentram)
    
      listSave[index].nhienlieu=item.nhienlieu
      listSave[index].dinhmuc=item.dinhmuc

      console.log(listSave[index])
      setLists([...listSave])
      setListOld([...listSave])
     
      if (search){
        search(search)
      }
    }).catch(er=>{
      toast.error("Dữ liệu đã tồn tại")
    
    })
  }
}}
else{
  toast.error("Vui lòng nhập đủ thông tin!")
}
    // setshow(false)
  }
  const ChangeTentram=(e)=>{
    settentram(e.target.value)
  }
  const ChangeTencsht=(e)=>{
    settencsht(e.target.value)
  }
  const ChangeLoainhienlieu=(e)=>{
    setloainhienlieu(e.target.value)
  }
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d") // Thay thế đ
      .replace(/Đ/g, "D"); // Thay thế Đ
  };
  const ChangeDinhmuc=(e)=>{
    setdinhmuc(e.target.value)
  }

  const changetext = async (e) => {
    let listfiilter = listOLd;
    let listSearch = [];
    setSearch(e);

    if (e) {
      listSearch = listfiilter.filter(
        (item) =>
          String((item.tentram)).toLocaleLowerCase().indexOf(String(e).toLocaleLowerCase()) !=
            -1 ||
            removeVietnameseTones(String((item.nhienlieu))
            .toLocaleLowerCase())
            .indexOf(removeVietnameseTones(String(e).toLocaleLowerCase())) != -1 ||
          String(item.dinhmuc)
            .toLocaleLowerCase()
            .indexOf(String(e).toLocaleLowerCase()) != -1 
      );
    }
    if (!e) setLists(listOLd);
    else setLists(listSearch);
  };
  const getlist = (e) => {
    setListPg(e);
  };
  const deleteNhienlieu = async (id) => {
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
      customClass: {
        popup: 'swal-wide' // Thêm lớp tùy chỉnh
      },
    });

    if (result.isConfirmed) {
      nhienlieuService.deletedata(id).then((res) => {
        setLists(lists.filter((e) => e.id != id));
        toast.success("Xóa thiết bị thành công");
      });
    }
  };
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
                onChange={(e) => changetext(e.target.value)}
                value={search}
                placeholder="Nhập nội dung tìm kiếm"
              />
            </div>


            <div className="col col-sm-1">

            <button
          className="btn btn-lg btn-primary mx-1 float-right"
          onClick={() => openModal(1)}
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
        
                <th scope="col">Tên Trạm</th>

                <th scope="col">Loại hiên liệu</th>

                <th scope="col">Định mức nhiệu (lít/giờ)</th>
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
                        <td className="text-center" scope="row">{index + 1}</td>
                        <td className="text-center">{item.tentram}</td>
                       
                        <td className="text-center">{item.nhienlieu}</td>
                        <td className="text-center">{item.dinhmuc}</td>
                        <td className="text-center"> 
                          <button
                                className="btn btn-lg fs-2 mx-2 btn-primary"
                                onClick={() => openModal(item)}
                              >
                                <i className="fa fa-pen" aria-hidden="true"></i>
                              </button>
                              <button
                              className="btn btn-lg  fs-2 btn-danger"
                              onClick={() => deleteNhienlieu(item.tentram)}
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





      <Modal
        show={show}
        onHide={() => setshow(false)}
        size="lg"
        dialogClassName="modal-90w modal_show"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            <h3 className="text-center tonghop-label">
             
             THÊM TRẠM MÁY NỔ MỚI
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <section id="about" className="about">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label htmlFor="code" className="form-label tonghop-label">
                     Tên CSHT
                    </label>
                    <input
                      type="text"
                   
                      className="form-control"
                      id="code"
                      onChange={(e) => ChangeTencsht(e)}
                      value={tencsht}
                      placeholder="Tên CSHT"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Tên trạm
                    </label>
                    <input
                      className="form-control"
                      disabled={trangthai=="edit"}
                      id="teacher"
                      name="name"
                      onChange={(e) => ChangeTentram(e)}
                      value={tentram}
                      type="text"
                      placeholder="Tên trạm"
                    />
                  </div>
                </div>
              </div>
           
              <div className="row mt-4">
                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="rank">
                      Loại nhiên liệu
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => ChangeLoainhienlieu(e)}
                      value={loainhienlieu}
                    >
                      <option value="" hidden>
                        Chọn loại nhiên liệu
                      </option>
                      <option value="Xăng">Xăng</option>
                      <option value="Dầu">Dầu</option>
                     
                    </select>
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                     Định mức (lít/giờ)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="course"
                      onChange={(e) => ChangeDinhmuc(e)}
                      value={dinhmuc}
                      placeholder="Định mức"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-lg d-block fs-3 btn-primary p-3"
            onClick={(e) => save()}
          >
           Thêm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Nhienlieu;
