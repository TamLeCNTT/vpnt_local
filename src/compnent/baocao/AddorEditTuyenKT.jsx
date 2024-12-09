import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import TuyenKTService from "../../service/TuyenKTService";
const AddorEditTuyenKT = (props) => {
  const [show, setshow] = useState(false);

  const [ip, setIp] = useState("");
  const [tuyenkt, setTuyenKT] = useState("");
  const [ttvt, setTTVT] = useState("");
  const [tenhetong, settenhetong] = useState("");

  const openModal = () => {

    setshow(true);
    if (props.status == "edit") {
      let data = props.data;
      console.log(data);
      setIp(data.id)
      setTuyenKT(data.tuyenkt)
      setTTVT(data.trungtamvienthong)
    
      settenhetong(data.tenhethong);
  
    } else {
    setIp("")
    setTuyenKT("")
    setTTVT("")
    settenhetong("")
    }
  };
  const changeIP = (e) => {
    setIp(e.target.value);
  };
  const changeTTVT = (e) => {
    setTTVT(e.target.value);
  };
  const changeTuyenKT = (e) => {
    setTuyenKT(e.target.value);
  };

  const changeTenhethong = (e) => {
    settenhetong(e.target.value);
  };

  const save = () => {
    let list = [];
  console.log(ip,tenhetong,tuyenkt,ttvt)

    if (ip && tenhetong && tuyenkt && ttvt) {
      let itemm = {};
      if (props.status != "edit") {
        
          itemm = {
            id: ip,
            tenhethong: tenhetong,
            ip: ip,
            pon: ip,
            tuyenkt: tuyenkt,
       
            trungtamvienthong: ttvt,
          };
          list.push(itemm);
          TuyenKTService.addData(list).then((res) => {
            toast.success("Thêm tuyến kĩ thuật thành công");
            console.log(res.data);
            props.save("add",itemm)
            setshow(false)
          }).catch(e=>{
            toast.error("Thêm dữ liệu thất bại !!!")
          })
          console.log(list);
      
      } else {
        itemm = {
            id: ip,
            tenhethong: tenhetong,
            ip: ip,
            pon: ip,
            tuyenkt: tuyenkt,
            trungtamvienthong: ttvt,
          };
          TuyenKTService.UpdateData(itemm).then(res=>{
            console.log(res.data)
            toast.success("Cập nhật dữ liệu thành công")
            props.save("edit",itemm)
            setshow(false)
          })
          .catch(e=>{
            toast.error("Cập nhật dữ liệu thất bại !!!")
          })
      }
    } else {
      toast.info("Vui lòng đủ thông tin");
    }

    // console.log(matram,tentram,his,mytv,ims,diachi,port,taikhoan,matkhau,loaitram)
  };
  return (
    <>
      {props.status == "edit" ? (
        <button
          className="btn btn-lg fs-2 mx-2 btn-primary"
          onClick={() => openModal()}
        >
          <i className="fa fa-pen" aria-hidden="true"></i>
        </button>
      ) : (
        <button
          className="btn btn-lg btn-success mx-1 float-right"
          onClick={() => openModal()}
        >
          {/* <i className="fa fa-plus" aria-hidden="true"></i> */}
          Thêm <i className="fa fa-plus" aria-hidden="true"></i>
        </button>
      )}
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
              {" "}
              {props.status == "edit"
                ? "CẬP NHẬT TUYẾN KĨ THUẬT"
                : "THÊM TUYẾN KĨ THUẬT MỚI"}{" "}
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
                     IP cổng
                    </label>
                    <input
                      type="text"
                      // disabled={props.status == "edit"}
                      className="form-control"
                      id="code" disabled={props.status=="edit"}
                      onChange={(e) => changeIP(e)}
                      value={ip}
                      placeholder=" IP cổng"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Tên hệ thống
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changeTenhethong(e)}
                      value={tenhetong}
                      type="text"
                      placeholder="Tên hệ thống"
                    />
                  </div>
                </div>
              </div>
             
              <div className="row mt-4">
                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="rank">
                      Tuyến kĩ thuật
                    </label>
                    <select
                      className="form-select "
                      onChange={(e) => changeTuyenKT(e)}
                      value={tuyenkt}
                    >
                      <option value="" hidden>
                        Chọn tuyến kĩ thuật
                      </option>
                      <option value="KT1A">KT1A</option>
                      <option value="KT1B">KT1B</option>
                      <option value="KT2">KT2</option>
                      <option value="KT3">KT3</option>
                      <option value="KT4">KT4</option>
                      <option value="KT5">KT5</option>
                      <option value="KT6">KT6</option>
                      <option value="KT7">KT7</option>
                      <option value="KT8">KT8</option>
                      <option value="KT9">KT9</option>
                      <option value="KT10">KT10</option>
                      <option value="KT10A">KT10A</option>
                      <option value="KT11">KT11</option>
                      <option value="KT12">KT12</option>
                      <option value="KT13">KT13</option>
                      <option value="KT14">KT14</option>
                      <option value="KT15">KT15</option>
                      <option value="KT16">KT16</option>
                      <option value="KT17">KT17</option>
                      <option value="KT18">KT18</option>
                      <option value="KT19">KT19</option>
                    </select>
                  </div>
                </div>

                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="rank">
                     Trung tâm viễn thông 
                    </label>
                    <select
                      className="form-select "
                      onChange={(e) => changeTTVT(e)}
                      value={ttvt}
                    >
                      <option value="" hidden>
                        Chọn Trung tâm viễn thông
                      </option>
                      <option value="Trung tâm Viễn thông 1">Trung tâm Viễn thông 1</option>
                      <option value="Trung tâm Viễn thông 2">Trung tâm Viễn thông 2</option>
                      <option value="Trung tâm Viễn thông 3">Trung tâm Viễn thông 3</option>
                      <option value="Trung tâm Viễn thông 4">Trung tâm Viễn thông 4</option>
                    </select>
                  </div>
                </div>
              </div>
            
            
             
            </div>
          </section>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-lg d-block fs-3 btn-primary p-3"
            onClick={(e) => save(e)}
          >
            {" "}
            {props.status == "edit" ? "Lưu" : "Thêm"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddorEditTuyenKT;
