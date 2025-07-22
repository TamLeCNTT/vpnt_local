import { useState } from "react";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import suyhaoService from "../../service/suyhaoService";
import { set } from "date-fns";
import NhanvienService from "../../service/NhanvienService";
const AddorEditNhanVien = (props) => {
  const [show, setshow] = useState(false);
  const [ttvt, setTTVT] = useState("");
  const [tuyenkt, setTKT] = useState("");
  const [tennhanvien, settennhanvien] = useState("");
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
  const changeTTVT = (e) => {
    setTTVT(e.target.value);
  };
  const changeTKT = (e) => {
    setTKT(e.target.value);
  };
  const changeTenNhanVien = (e) => {
    settennhanvien(e.target.value);
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
          NhanvienService.addData(list)
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
        NhanvienService.UpdateData(itemm)
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
                      Tên nhân viên
                    </label>
                    <input
                      type="text"
                      // disabled={props.status == "edit"}
                      className="form-control"
                      id="code"
                      onChange={(e) => changeTenNhanVien(e)}
                      value={tennhanvien}
                      placeholder="Tên nhân viên"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="rank">
                     Tuyến KT
                    </label>
                    <select
                      className="form-select "
                      onChange={(e) => changeTKT(e)}
                      value={tuyenkt}
                    >
                      <option value="" hidden>
                        Chọn Tuyến kỹ thuật
                      </option>
                      <option value="KT1">
                        KT1A
                      </option>
                      <option value="KT1">
                        KT1B
                      </option>
                      <option value="KT2">
                        KT2
                      </option>
                      <option value="KT3">
                        KT3
                      </option>
                      <option value="KT4">
                        KT4
                      </option>
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
                     
                        <option value="KT15">KT15</option>
                        <option value="KT16">KT16</option>
                        <option value="KT17">KT17</option>
                        <option value="KT18">KT18</option>
                        <option value="KT19">KT19</option>
                    </select>
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  </div>
                  <div className="row mt-4">
                  <div className="col col-12 col-md-6">
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

export default AddorEditNhanVien;
