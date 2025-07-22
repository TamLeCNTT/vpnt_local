import { useState } from "react";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import suyhaoService from "../../service/suyhaoService";
import { set } from "date-fns";
import TramOLtService from "../../service/TramOLtService";
import portService from "../../service/portService";
const AddAndEditRing = (props) => {
  const [show, setshow] = useState(false);

  const [TTVT, setTTVT] = useState("");
  const [nameRing, setNameRing] = useState("");

  const [oldUsername, setOldUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hide, sethide] = useState(true);

  const [matram, setmatram] = useState("");
  const [tenhetong, settenhetong] = useState("");
  const [tentram, settentram] = useState("");
  const [loaitram, setloaitram] = useState("");
  const [his, sethis] = useState("");
  const [mytv, setmytv] = useState("");
  const [ims, setims] = useState("");
  const [diachi, setDiachi] = useState("");
  const [port, setPort] = useState("");
  const [taikhoan, settaikhoan] = useState("");
  const [matkhau, setmatkhau] = useState("");
  const [load, setload] = useState(false);
  const openModal = () => {
    setshow(true);
    if (props.status == "edit") {
      let data = props.data;

      setNameRing(data.ten);
      setTTVT(data.donvi);
    } else {
      setNameRing("");
      setTTVT("");
    }
  };

  const changeNameRing = (e) => {
    setNameRing(e.target.value);
  };
  const changeTTVT = (e) => {
    setTTVT(e.target.value);
  };
  const save = () => {
    let list = [];
    console.log(props.data);

    if (nameRing && TTVT) {
      if (props.status == "edit") {
        let datasave = { id: props.data.id, ten: nameRing, donvi: TTVT };
        console.log(datasave, props.data);
        portService.UpdateData_ring(datasave).then((res) => {
          console.log(res.data);
          toast.success("Cập nhật thành công");
          props.addoredit();
          setshow(false);
        });
      } else {
        let datasave = { ten: nameRing, donvi: TTVT };
        list.push(datasave);
        portService.addDataRing(list).then((res) => {
          console.log(res.data);
          toast.success("Thêm dữ liệu thành công");
          props.addoredit();
          setshow(false);
        });
        console.log(nameRing, TTVT);
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
                ? "CẬP NHẬT THIẾT BỊ"
                : "THÊM THIẾT BỊ MỚI"}{" "}
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
                      TÊN RING
                    </label>
                    <input
                      type="text"
                      // disabled={props.status == "edit"}
                      className="form-control"
                      id="code"
                      onChange={(e) => changeNameRing(e)}
                      value={nameRing}
                      placeholder="Tên Ring"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      ĐƠN VỊ
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => changeTTVT(e)}
                      value={TTVT}
                    >
                      <option value="" hidden>
                        Chọn đơn vị quản lý
                      </option>
                      <option value="DPC">DPC</option>
                      <option value="HAN">HAN</option>
                      <option value="HHG">HHG</option>
                      <option value="LMY">LMY</option>
                      <option value="NBY">NBY</option>
                      <option value="TPT">TPT</option>
                      <option value="TTN">TTN</option>
                      <option value="VTH">VTH</option>

                      <option value="VTY">VTY</option>
                      <option value="VVN">VVN</option>
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

export default AddAndEditRing;
