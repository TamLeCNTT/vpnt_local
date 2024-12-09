import { useState } from "react";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import suyhaoService from "../../service/suyhaoService";
import { set } from "date-fns";
import TramOLtService from "../../service/TramOLtService";
const AddTramOlt = (props) => {
  const [show, setshow] = useState(false);

  const [tenthietbi, setTenthietbi] = useState("");
  const [loai, setLoai] = useState("");

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
    //     let student = props.listst.filter((item) => item.studentId == props.id)[0];
    //     console.log();
    //     setcode(student.code);
    //     setcourse(student.course);
    //     setname(student.name);
    //     setrank(student.rank);
    //     setteacher(student.teacherId);
    setshow(true);
    if (props.status == "edit") {
      let data = props.data;
      console.log(data);
      setmatram(data.matram);
      settentram(data.tentram);
      setloaitram(data.loai);
      sethis(data.his);
      setims(data.ims);
      setmytv(data.mytv);
      setPort(data.port);
      setDiachi(data.ip);
      settenhetong(data.tenhethong);
      settaikhoan("");
      setmatkhau("");
    } else {
      setmatram("");
      settentram("");
      setloaitram("");
      sethis("");
      setims("");
      setmytv("");
      setPort("");
      setDiachi("");
      settaikhoan("");
      setmatkhau("");
    }
  };
  const changematram = (e) => {
    setmatram(e.target.value);
  };
  const changetentram = (e) => {
    settentram(e.target.value);
  };
  const changeloaitram = (e) => {
    setloaitram(e.target.value);
  };
  const changehis = (e) => {
    sethis(e.target.value);
  };
  const changemytv = (e) => {
    setmytv(e.target.value);
  };
  const changeims = (e) => {
    setims(e.target.value);
  };

  const changeDiachi = (e) => {
    setDiachi(e.target.value);
  };

  const changeport = (e) => {
    setPort(e.target.value);
  };
  const changeTaikhoan = (e) => {
    settaikhoan(e.target.value);
  };
  const changeTenhethong = (e) => {
    settenhetong(e.target.value);
  };
  const changeMatkhau = (e) => {
    setmatkhau(e.target.value);
  };

  const changeOldUsername = (e) => {
    setOldUsername(e.target.value);
  };
  const changeNewUsername = (e) => {
    setNewUsername(e.target.value);
  };
  const changeOldPassword = (e) => {
    setOldPassword(e.target.value);
  };
  const changeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const changeHide = () => {
    sethide(!hide);
  };
  const save = () => {
    let list = [];
    console.log(props.data);

    if (matram && tentram && his && mytv && ims && diachi && port && loaitram) {
      let itemm = {};
      if (props.status != "edit") {
        if (taikhoan && matkhau) {
          itemm = {
            matram: matram,
            tentram: tentram,
            his: his,
            mytv: mytv,
            ims: ims,
            ip: diachi,
            port: port,
            username: taikhoan,
            password: matkhau,
            loai: loaitram,
            tenhethong: tenhetong,
          };
          list.push(itemm);
          TramOLtService.addData(list)
            .then((res) => {
              toast.success("Thêm dữ liệu thành công");

              props.save();
            })
            .catch((err) => {
              toast.error("Thêm dữ liệu thất bại");
              console.log(err);
            });
          console.log(list);
        } else {
          toast.info("Vui lòng đủ thông tin");
        }
      } else {
        itemm = {
          matram: matram,
          tentram: tentram,
          his: his,
          mytv: mytv,
          ims: ims,
          ip: diachi,
          port: port,
          username: oldUsername,
          password: oldPassword,
          loai: loaitram,
          tenhethong: tenhetong,
        };
        itemm.id = props.data.id;
        console.log(oldUsername);
        if (!oldUsername || !oldPassword) {
          itemm.username = props.data.username;
          itemm.password = props.data.password;
        } else {
          if (
            itemm.username == props.data.username &&
            itemm.password == props.data.password
          ) {
            console.log(newPassword, newUsername);
            itemm.username = newUsername;
            itemm.password = newPassword;
          } else {
            toast.info("Thông tin tài khoản và mật khẩu cũ không đúng!");
            return;
          }
        }
        list.push(itemm);
        console.log(list);
        TramOLtService.UpdateData(itemm)
          .then((res) => {
            toast.success("Cập nhật dữ liệu thành công");
            props.save();
            console.log(res.data);
            setshow(false);
          })
          .catch((err) => {
            toast.error("Cập nhật dữ liệu thất bại");
            console.log(err);
          });
        console.log(itemm);
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
                      SLID
                    </label>
                    <input
                      type="text"
                      // disabled={props.status == "edit"}
                      className="form-control"
                      id="code"
                      onChange={(e) => changematram(e)}
                      value={matram}
                      placeholder="Mã trạm"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Tên OLT
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changetentram(e)}
                      value={tentram}
                      type="text"
                      placeholder="Tên trạm"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-4">
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
                      Loại OLT
                    </label>
                    <select
                      className="form-select "
                      onChange={(e) => changeloaitram(e)}
                      value={loaitram}
                    >
                      <option value="" hidden>
                        Chọn loại OLT
                      </option>
                      <option value="hw-mini">HUAWEI MINI</option>
                      <option value="huawei">HUAWEI</option>
                      <option value="zte-mini">ZTE MINI</option>
                      <option value="gpon-zte"> ZTE</option>
                      <option value="gpon-alu">ALU</option>
                      <option value="dasan">DASAN</option>
                    </select>
                  </div>
                </div>

                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      HSI
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="course"
                      onChange={(e) => changehis(e)}
                      value={his}
                      placeholder="Vlan HSI"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label htmlFor="code" className="form-label tonghop-label">
                      MY TV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      onChange={(e) => changemytv(e)}
                      value={mytv}
                      placeholder="Vlan My TV"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      IMS
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changeims(e)}
                      value={ims}
                      type="text"
                      placeholder="Vlan IMS"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label htmlFor="code" className="form-label tonghop-label">
                      Địa chỉ IP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      onChange={(e) => changeDiachi(e)}
                      value={diachi}
                      placeholder="Địa chỉ IP"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Port Uplink
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changeport(e)}
                      value={port}
                      type="text"
                      placeholder="Port UpLink"
                    />
                  </div>
                </div>
              </div>
              {props.status == "edit" ? (
                <>
                  <div className="row mb-2 mt-4 ">
                    <div className="col col-12 col-md-12 tonghop-label">
                      <p class="text-center text-uppercase fs-2">
                        Cập nhật tài khoản
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-12 col-md-6">
                      <div className="md-2">
                        <label
                          htmlFor="code"
                          className="form-label tonghop-label"
                        >
                          Tài khoản cũ
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="code"
                          onChange={(e) => changeOldUsername(e)}
                          value={oldUsername}
                          placeholder="Tài khoản cũ"
                        />
                      </div>
                    </div>
                    <div className="col col-12 col-md-6">
                      <div className="md-4">
                        <label
                          className="form-label tonghop-label"
                          htmlFor="name"
                        >
                          Mật khẩu cũ
                        </label>
                        <input
                          className="form-control"
                          id="teacher"
                          name="name"
                          onChange={(e) => changeOldPassword(e)}
                          value={oldPassword}
                          type={hide ? "password" : "text"}
                          placeholder="Mật khẩu cũ"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col col-12 col-md-6">
                      <div className="md-4">
                        <label
                          htmlFor="code"
                          className="form-label tonghop-label"
                        >
                          Tài khoản mới
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="code"
                          onChange={(e) => changeNewUsername(e)}
                          value={newUsername}
                          placeholder="Tài khoản mới"
                        />
                      </div>
                    </div>
                    <div className="col col-12 col-md-6">
                      <div className="md-4">
                        <label
                          className="form-label tonghop-label"
                          htmlFor="name"
                        >
                          Mật khẩu mới
                        </label>
                        <input
                          className="form-control"
                          id="teacher"
                          name="name"
                          onChange={(e) => changeNewPassword(e)}
                          value={newPassword}
                          type={hide ? "password" : "text"}
                          placeholder="Mật khẩu mới"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <div className="row mt-3">
                    <div className="col col-12 col-md-6">
                      <div className="md-4">
                        <label
                          htmlFor="code"
                          className="form-label tonghop-label"
                        >
                          Tài khoản
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="code"
                          onChange={(e) => changeTaikhoan(e)}
                          value={taikhoan}
                          placeholder="Tài khoản "
                        />
                      </div>
                    </div>
                    <div className="col col-12 col-md-6">
                      <div className="md-4">
                        <label
                          className="form-label tonghop-label"
                          htmlFor="name"
                        >
                          Mật khẩu
                        </label>

                        <input
                          className="form-control"
                          id="teacher"
                          name="name"
                          onChange={(e) => changeMatkhau(e)}
                          value={matkhau}
                          type={hide ? "password" : "text"}
                          placeholder="Mật khẩu "
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="row mt-3">
                <div className="col col-12 col-md-6">
                  <input
                    class="mr-3"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                    onClick={() => changeHide()}
                  />
                  <label class="mx-3" for="defaultCheck1">
                    Hiển thị mật khẩu
                  </label>
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

export default AddTramOlt;
