import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "./Tonghop.scss";
const TSLCD_view = (props) => {
  const [donvi, setdonvi] = useState("");
  const [name, setname] = useState("");
  const [tenkhachhang, settenkhachhang] = useState("");
  const [account, setacccount] = useState("");
  const [dichvu, setdichvu] = useState("");
  const [diachi, setdiachi] = useState("");
  const [lt, setlt] = useState("");
  const [nt, setnt] = useState("");
  const [bw, setbw] = useState("");
  const [svlan, setsvlan] = useState("");
  const [cvlan, setcvlan] = useState("");
  const [porttl2sw, setporttl2sw] = useState("");
  const [l2sw, setl2sw] = useState("");
  const [portupe, setportupe] = useState("");
  const [upe, setupe] = useState("");
  const [wan, setwan] = useState("");
  const [gw, setgw] = useState("");
  const [mask, setmask] = useState("");
  const [wamdoosan, setwamdoosan] = useState("");
  const [somay, setsomay] = useState("");
  const [magd, setmagd] = useState("");
  const [soao, setsoao] = useState("");
  const [vrf, setvrf] = useState("");
  const [lienhe, setlienhe] = useState("");

  const [soxe, setsoxe] = useState("");
  const [code, setcode] = useState("");
  const [course, setcourse] = useState("");

  const [rank, setrank] = useState("");
  const [teacher, setteacher] = useState("");
  const [show, setshow] = useState(false);

  let navitive = useNavigate();
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
  const save = (e) => {
    if (!code) toast.error("Vui lòng nhập mã học viên");
    else {
      if (!name) toast.error("Vui lòng tên học viên");
      else if (!course) toast.error("Vui lòng nhập khoá học");
      else if (!rank) toast.error("Vui lòng nhập hạng đào tạo");
      else if (!teacher) toast.error("Vui lòng chọn giáo viên");
      else {
        let student = {
          code: code,
          name: name,
          course: course,
          rank: rank,
          teacherId: teacher,
          distance: 0,
          hours: "",
          nightTime: "",
        };
        console.log(student);
      }
    }
  };
  const openModal = () => {
    console.log(props.data);
    setdonvi(decryptData(props.data.donvi));
    settenkhachhang(decryptData(props.data.tenkhachhang));
    setacccount(decryptData(props.data.account));
    setdichvu(props.data.dichvu);
    setdiachi(decryptData(props.data.diachi));
    setlt(props.data.lt);
    setnt(props.data.nt);
    setbw(props.data.bw);
    setsvlan(props.data.svlan);
    setcvlan(props.data.cvlan);
    setporttl2sw(props.data.portl2w);
    setl2sw(decryptData(props.data.l2sw));
    setportupe(props.data.portupe);
    setupe(props.data.upe);
    setwan(decryptData(props.data.wan));
    setgw(props.data.gw);
    setmask(props.data.mask);
    setwamdoosan(decryptData(props.data.ip));
    setsomay(props.data.somay);
    setmagd(props.data.magd);
    setsoao(props.data.soao);
    setvrf(props.data.vrf);
    setlienhe(props.data.lienhe);
    setshow(true);
  };
  const close = () => {
    setshow(false);
  };
  const changename = (e) => {
    setname(e.target.value);
    console.log(e.target.value);
  };
  const changesoxe = (e) => {
    setsoxe(e.target.value);
  };
  const changecode = (e) => {
    setcode(e.target.value);
    console.log(e.target.value);
  };
  const changcourse = (e) => {
    setcourse(e.target.value);
  };
  const changerank = (e) => {
    setrank(e.target.value);
    console.log(e.target.value);
  };
  const changeteacher = (e) => {
    setteacher(e.target.value);
  };

  return (
    <>
      <a
        href="#"
        className="edit"
        data-dismiss="alert"
        aria-label="edit"
        onClick={() => openModal()}
      >
        <span aria-hidden="true">
          <i className="fa fa-edit"></i>
        </span>
      </a>
      <div id="tonghop">
        <Modal
          show={show}
          //size="lg"
          fullscreen={true}
          onHide={() => setshow(false)}
          dialogClassName="modal-190w modal_show"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <h3 className="text-center tonghop-label">THÔNG TIN CHI TIẾT </h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <section id="about" className="about">
              <div className="container" data-aos="fade-up">
                <div className="row mb-4">
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        htmlFor="code"
                        className="form-label tonghop-label"
                      >
                        Đơn vị
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        onChange={(e) => changecode(e)}
                        value={donvi}
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Account
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={account}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Dịch vụ
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={dichvu}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        BW
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={bw}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col col-md-6">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Tên khách hàng
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={tenkhachhang}
                        type="text"
                        placeholder="Tên học viên"
                      />
                    </div>
                  </div>
                  <div className="col col-md-6">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Địa chỉ
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={diachi}
                        type="text"
                        placeholder="Địa chỉ"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col col-md-1">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        LT
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={lt}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-1">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        NT
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={nt}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-1">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        SVLAN
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={svlan}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-1">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        CVLAN
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={cvlan}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-2">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        PORT/L2-SW
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={porttl2sw}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        L2-SW
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={l2sw}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-2">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        PORT/UPE
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={portupe}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-1">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        UPE
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={upe}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        WAN
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={wan}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        GW
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={gw}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        MASK
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={mask}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        IP
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={wamdoosan}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Số máy/Acc
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={somay}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Mã GD
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={magd}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Số ảo
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={soao}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col col-md-3">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        VRF
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={vrf}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col col-md-12">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        LIÊN HỆ
                      </label>
                      <input
                        className="form-control"
                        id="teacher"
                        name="name"
                        onChange={(e) => changename(e)}
                        value={lienhe}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-lg fs-3 btn-primary p-3 mr-6"
              onClick={(e) => close()}
            >
              Đóng
            </button>
            <button
              className="btn btn-lg d-block fs-3 btn-primary p-3"
              onClick={(e) => save(e)}
            >
              Lưu thay đổi
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default TSLCD_view;
