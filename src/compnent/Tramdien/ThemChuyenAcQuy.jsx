import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import TenTramService from "../../service/TenTramService";
import ChuyenAcQuyService from "../../service/ChuyenAcQuyService";
import "../public/User.scss";
const ThemChuyenAcQuy = (props) => {
  const [loaichuyen, setloaichuyen] = useState("");
  const [loaichuyenerror, setloaichuyenerror] = useState(false);
  const [tentramc, settentramc] = useState("");
  const [tentramcerror, settentramcerror] = useState(false);
  const [tentramckhac, settentramckhac] = useState(false);
  const [listonptionTentram, setlistonptionTentram] = useState([]);
  const [chungloai, setchungloai] = useState("");
  const [chungloaierror, setchungloaierror] = useState("");
  const [chungloaikhac, setchungloaikhac] = useState(false);
  const [serial, setserial] = useState("");
  const [serialerror, setserialerror] = useState(false);
  const [soluong, setsoluong] = useState("");
  const [soluongerror, setsoluongerror] = useState(false);
  const [donvic, setdonvic] = useState("");
  const [donvicerror, setdonvicerror] = useState("");
  const [tentramn, settentramn] = useState("");
  const [tentramnkhac, settentramnkhac] = useState(false);
  const [tentramnerror, settentramnerror] = useState(false);
  const [donvin, setdonvin] = useState("");
  const [donvinerror, setdonvinerror] = useState(false);
  const [ghichu, setghichu] = useState("");
  const [ngaychuyen, setngaychuyen] = useState("");
  const [ngaychuyenerror, setngaychuyenerror] = useState(false);
  const [show, setshow] = useState(false);
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
  const optionloaichuyen = [
    { value: "acquy", label: "Ác quy" },
    { value: "rec", label: "Rec" },
  ];
  const optiondonvi = [
    { value: "TTVT1", label: "TTVT1" },
    { value: "TTVT2", label: "TTVT2" },
    { value: "TTVT3", label: "TTVT3" },
    { value: "TTVT4", label: "TTVT4" },
  ];
  const optionchungloai = [
    { value: "Vision 12V-150Ah", label: "Vision 12V-150Ah" },
    { value: "Posmax 12V-150Ah", label: "Posmax 12V-150Ah" },
    { value: "Posmax 2V-300Ah", label: "Posmax 2V-300Ah" },
    { value: "Postef V-LFP48100", label: "Postef V-LFP48100" },
    { value: "khac", label: "Khác" },
  ];
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
  const save = (e) => {
    let flashcreatenew = 0;
    if (!loaichuyen) {
      toast.error("Vui lòng chọn loại chuyển");
      setloaichuyenerror(true);
    } else {
      setloaichuyenerror(false);
      if (!tentramc) {
        toast.error("Vui lòng chọn tên trạm chuyển");
        settentramcerror(true);
      } else {
        settentramcerror(false);
        if (!chungloai) {
          toast.error("Vui lòng chọn chủng loại");
          setchungloaierror(true);
        } else {
          setchungloaierror(false);
          if (!serial) {
            setserialerror(true);
            toast.error("Vui lòng nhập serial");
          } else {
            setserialerror(false);
            if (!soluong) {
              toast.error("Vui lòng nhập số lượng");
              setsoluongerror(true);
            } else {
              setsoluongerror(false);
              if (!donvic) {
                toast.error("Vui lòng chọn đơn vị quản lý chuyển");
                setdonvicerror(true);
              } else {
                setdonvicerror(false);
                if (!tentramn) {
                  toast.error("Vui lòng chọn tên trạm nhận");
                  settentramnerror(true);
                } else {
                  settentramnerror(false);
                  if (!donvin) {
                    toast.error("Vui lòng chọn đơn vị nhận");
                    setdonvinerror(true);
                  } else {
                    setdonvinerror(false);
                    if (!ngaychuyen) {
                      toast.error("Vui lòng chọn ngày chuyển");
                      setngaychuyenerror(true);
                    } else {
                      setngaychuyenerror(false);
                      flashcreatenew = 1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (flashcreatenew == 1) {
      ChuyenAcQuyService.update({
        id: decryptData(props.dataRedux.user.username) + RandomString(6),
        data: {
          loaichuyen: loaichuyen,
          tentramc: tentramc,
          chungloai: chungloai,
          serial: serial,
          soluong: soluong,
          donvic: donvic,
          tentramn: tentramn,
          donvin: donvin,
          ghichu: ghichu,
          ngaychuyen: ngaychuyen,
          user: decryptData(props.dataRedux.user.username),
        },
      }).then((res) => {
        console.log(res.data);
        props.save(res.data);
      });
      console.log(
        loaichuyen,
        tentramc,
        chungloai,
        serial,
        soluong,
        donvic,
        tentramn,
        donvin,
        ghichu,
        ngaychuyen,
        decryptData(props.dataRedux.user.username) + RandomString(6)
      );
    }
  };
  const openModal = () => {
    console.log(props);
    let list = [];

    TenTramService.getAll().then((res) => {
      console.log(Object.values(res.data));
      Object.values(res.data).map((item) => {
        let option = { value: item.tentram, label: item.tentram };
        list.push(option);
      });
      let option = { value: "khac", label: "Khác" };
      list.push(option);
      setlistonptionTentram(list);
    });
    setshow(true);
  };
  const close = () => {
    setshow(false);
  };

  const changeloaichuyen = (e) => {
    console.log(e);
    setloaichuyen(e.value);
  };
  const changetentram = (e) => {
    if (e.value == "khac") {
      settentramckhac(true);
      settentramc("");
    } else {
      settentramc(e.value);
      settentramckhac(false);
    }
  };
  const changetentramkhac = (e) => {
    settentramc(e.target.value);
  };
  const changechungloai = (e) => {
    if (e.value == "khac") {
      setchungloaikhac(true);
      setchungloai("");
    } else {
      setchungloai(e.value);
      setchungloaikhac(false);
    }
  };
  const changechungloaikhac = (e) => {
    setchungloai(e.target.value);
  };
  const changeserial = (e) => {
    setserial(e.target.value);
  };
  const changesoluong = (e) => {
    if (Number(e.target.value) < 1) setsoluong(1);
    else setsoluong(e.target.value);
  };
  const changedonvic = (e) => {
    setdonvic(e.value);
  };
  const changetentramn = (e) => {
    if (e.value == "khac") {
      settentramnkhac(true);
      settentramn("");
    } else {
      settentramn(e.value);
      settentramnkhac(false);
    }
  };
  const changetentramnkhac = (e) => {
    settentramn(e.target.value);
  };
  const changeghichu = (e) => {
    setghichu(e.target.value);
  };
  const changedonvin = (e) => {
    setdonvin(e.value);
  };
  const changengaychuyen = (e) => {
    setngaychuyen(e.target.value);
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
        <button className="btn btn-lg btn-primary">
          Thêm <i class="bi bi-plus-circle-fill"></i>
        </button>
      </a>
      <div id="tonghop">
        <Modal
          show={show}
          size="lg"
          //fullscreen={true}
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
                  <div className="col col-md-12 tonghop-label">
                    <p class="text-center text-uppercase fs-2">
                      Trạm điều chuyển
                    </p>
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col col-12 col-md-4 mb-4">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Chọn loại
                      </label>
                      <Select
                        onChange={(e) => changeloaichuyen(e)}
                        options={optionloaichuyen}
                        className={loaichuyenerror ? "error" : ""}
                      />
                    </div>
                  </div>
                  <div className="col col-12 col-md-4 mb-4">
                    <div className="md-4">
                      <label
                        htmlFor="code"
                        className="form-label tonghop-label"
                      >
                        Tên trạm
                      </label>
                      <Select
                        onChange={(e) => changetentram(e)}
                        options={listonptionTentram}
                        className={
                          tentramcerror && !tentramckhac ? "error" : ""
                        }
                      />
                    </div>
                  </div>
                  {tentramckhac && (
                    <div className="col col-12 col-md-4 ">
                      <div className="md-4">
                        <label
                          className="form-label tonghop-label"
                          htmlFor="name"
                        >
                          Tên trạm khác
                        </label>
                        <input
                          className={
                            tentramcerror && tentramckhac
                              ? "error form-control"
                              : "form-control"
                          }
                          id="teacher"
                          name="name"
                          onChange={(e) => changetentramkhac(e)}
                          value={tentramc}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  )}
                  <div className="col col-12 col-md-4">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Chủng loại
                      </label>
                      <Select
                        onChange={(e) => changechungloai(e)}
                        className={
                          chungloaierror && !chungloaikhac ? "error" : ""
                        }
                        options={optionchungloai}
                      />
                    </div>
                  </div>
                  {chungloaikhac && (
                    <div className="col col-12 col-md-4 ">
                      <div className="md-4">
                        <label
                          className="form-label tonghop-label"
                          htmlFor="name"
                        >
                          Chủng loại khác
                        </label>
                        <input
                          className={
                            chungloaierror
                              ? "error form-control"
                              : "form-control"
                          }
                          id="teacher"
                          name="name"
                          onChange={(e) => changechungloaikhac(e)}
                          value={chungloai}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  )}
                  <div className="col col-12 col-md-4 ">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Serial
                      </label>
                      <input
                        className={
                          serialerror ? "error form-control" : "form-control"
                        }
                        id="teacher"
                        name="name"
                        onChange={(e) => changeserial(e)}
                        value={serial}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div
                    className={
                      tentramckhac && chungloaikhac
                        ? "col col-12 col-md-3 mt-4"
                        : "col col-12 col-md-3"
                    }
                  >
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Số lượng
                      </label>
                      <input
                        className={
                          soluongerror ? "error form-control" : "form-control"
                        }
                        id="teacher"
                        name="name"
                        onChange={(e) => changesoluong(e)}
                        value={soluong}
                        type="number"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div
                    className={
                      tentramckhac || chungloaikhac
                        ? "col col-12 col-md-5 mt-4"
                        : "col col-12 col-md-5"
                    }
                  >
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Đơn vị quản lí
                      </label>
                      <Select
                        onChange={(e) => changedonvic(e)}
                        options={optiondonvi}
                        className={donvicerror ? "error " : ""}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 mt-5 ">
                  <div className="col col-12 col-md-12 tonghop-label">
                    <p class="text-center text-uppercase fs-2">
                      Trạm nhận điều chuyển
                    </p>
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col col-12 col-md-6 mb-4">
                    <div className="md-4">
                      <label
                        htmlFor="code"
                        className="form-label tonghop-label"
                      >
                        Tên trạm
                      </label>
                      <Select
                        onChange={(e) => changetentramn(e)}
                        options={listonptionTentram}
                        className={
                          tentramnerror && !tentramnkhac ? "error " : ""
                        }
                      />
                    </div>
                  </div>
                  {tentramnkhac && (
                    <div className="col col-12 col-md-6 ">
                      <div className="md-4">
                        <label
                          className="form-label tonghop-label"
                          htmlFor="name"
                        >
                          Tên trạm khác
                        </label>
                        <input
                          className={
                            tentramnerror
                              ? "error form-control"
                              : "form-control"
                          }
                          id="teacher"
                          name="name"
                          onChange={(e) => changetentramnkhac(e)}
                          value={tentramn}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  )}
                  <div className="col col-12 col-md-6">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Đơn vị quản lí
                      </label>
                      <Select
                        onChange={(e) => changedonvin(e)}
                        options={optiondonvi}
                        className={donvinerror ? "error " : ""}
                      />
                    </div>
                  </div>

                  <div className="col col-12 col-md-6">
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Ghi chú
                      </label>
                      <input
                        className="form-control "
                        id="teacher"
                        name="name"
                        onChange={(e) => changeghichu(e)}
                        value={ghichu}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div
                    className={
                      tentramnkhac
                        ? "col col-12 col-md-6 mt-4"
                        : "col col-12 col-md-6"
                    }
                  >
                    <div className="md-4">
                      <label
                        className="form-label tonghop-label"
                        htmlFor="name"
                      >
                        Ngày điều chuyển
                      </label>
                      <input
                        className={
                          ngaychuyenerror
                            ? "error form-control"
                            : "form-control"
                        }
                        id="teacher"
                        name="name"
                        onChange={(e) => changengaychuyen(e)}
                        value={ngaychuyen}
                        type="date"
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
              Lưu mới
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { dataRedux: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: "LOGOUT" }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ThemChuyenAcQuy);
