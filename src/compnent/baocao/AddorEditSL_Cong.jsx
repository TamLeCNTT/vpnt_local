import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import TuyenKTService from "../../service/TuyenKTService";
import mainEService from "../../service/mainEService";
const AddorEditSL_Cong = (props) => {
  const [show, setshow] = useState(false);

  const [ip, setIp] = useState("");
  const [tuyenkt, setTuyenKT] = useState("");
  const [ttvt, setTTVT] = useState("");
  const [tenhetong, settenhetong] = useState("");
  const [sl, setSl] = useState("");
  const [nhanvien, setNhanvien] = useState("");
  const openModal = () => {
    setshow(true);
    if (props.status == "edit") {
      let data = props.data;
      console.log(data);
      setSl(data.sl);
      setTuyenKT(data.tuyenkt);
      setTTVT(data.ttvt);

      setNhanvien(data.tennv);
    } else {
      setSl("");
      setTuyenKT("");
      setTTVT("");
      setNhanvien("");
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

  const changeSL = (e) => {
    setSl(e.target.value);
  };
  const ChangeNhanvien = (e) => {
    setNhanvien(e.target.value);
  };
  const save = () => {
    let list = [];
    console.log(sl, nhanvien, tuyenkt, ttvt);

    if (sl && nhanvien && tuyenkt && ttvt) {
      let itemm = {};
      let matt = "";
      if (ttvt == "Trung tâm Viễn thông 1") matt = "ttvt1";
      else if (ttvt == "Trung tâm Viễn thông 2") matt = "ttvt2";
      else if (ttvt == "Trung tâm Viễn thông 3") matt = "ttvt3";
      else matt = "ttvt4";
      if (props.status != "edit") {
        itemm = {
          matt: matt,
          tennv: nhanvien,
          sl:sl,
          ttvt: ttvt,
          tuyenkt: tuyenkt,
        };
        list.push(itemm);
        TuyenKTService.addData_TT(list)
          .then((res) => {
            toast.success("Thêm tuyến kĩ thuật thành công");
           
          
            console.log(res.data);
            props.save("add", itemm);
            setshow(false);
          })
          .catch((e) => {
            toast.error("Thêm dữ liệu thất bại !!!");
          });
        console.log(list);
      } else {
        itemm = {
          matt: matt,
          tennv: nhanvien,
          sl:sl,
          ttvt: ttvt,
          tuyenkt: tuyenkt,
        };
        TuyenKTService.UpdateData_TT(itemm)
          .then((res) => {
            console.log(res.data);
            toast.success("Cập nhật dữ liệu thành công");
            let time=new Date()
            let date=time.getDate()+"/"+ (Number(time.getMonth())+1)
            mainEService.writeDatainFile("timeUpdateSL_cong.txt", date)
            props.save("edit", itemm);
            setshow(false);
          })
          .catch((e) => {
            toast.error("Cập nhật dữ liệu thất bại !!!");
          });
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
                ? "CẬP NHẬT TUYẾN KỸ THUẬT"
                : "THÊM TUYẾN KỸ THUẬT MỚI"}{" "}
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
                      Tuyến KT
                    </label>
                    <input
                      type="text"
                      // disabled={props.status == "edit"}
                      className="form-control"
                      id="code"
                      disabled={props.status == "edit"}
                      onChange={(e) => changeTuyenKT(e)}
                      value={tuyenkt}
                      placeholder=" Tuyến KT"
                    />
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
                      <option value="Trung tâm Viễn thông 1">
                        Trung tâm Viễn thông 1
                      </option>
                      <option value="Trung tâm Viễn thông 2">
                        Trung tâm Viễn thông 2
                      </option>
                      <option value="Trung tâm Viễn thông 3">
                        Trung tâm Viễn thông 3
                      </option>
                      <option value="Trung tâm Viễn thông 4">
                        Trung tâm Viễn thông 4
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Số lượng cổng
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changeSL(e)}
                      value={sl}
                      type="Number"
                      placeholder="Số lượng"
                    />
                  </div>
                </div>
                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="rank">
                      Nhân viên kỹ thuật
                    </label>
                    <input
                      type="text"
                      // disabled={props.status == "edit"}
                      className="form-control"
                      id="code"
                      onChange={(e) => ChangeNhanvien(e)}
                      value={nhanvien}
                      placeholder="Tên nhân viên"
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

export default AddorEditSL_Cong;
