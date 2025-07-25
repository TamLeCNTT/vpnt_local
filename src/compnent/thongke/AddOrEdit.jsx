import { useState } from "react";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import Select from "react-select";
import suyhaoService from "../../service/suyhaoService";
import portService from "../../service/portService";
import { set } from "date-fns";
const AddOrEdit = (props) => {
  const [show, setshow] = useState(false);
  const [listRing, setListRing] = useState([]);
  const [ring, setRing] = useState("không");
  const [tenhethong, setTenhethong] = useState("");
  const [diachi, setDiachi] = useState("");
  const [tenthietbi, setTenthietbi] = useState("");
  const [loai, setLoai] = useState("");
  const [port, setPort] = useState("");
  const [porton, setPorton] = useState(2);
  const [portoff, setPortoff] = useState(2);
  const [nguon, setNguon] = useState(2);
  const [oldUsername, setOldUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hide, sethide] = useState(true);
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
  const validateIpAddress = (ip) => {
    // Regular expression to match an IP address
    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
    return ipPattern.test(ip);
  };
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
  const validateNumberList = (input) => {
    // Regular expression to match the format "number,number,number"
    const pattern = /^([^,]+,)*[^,]+$/;

    return pattern.test(input);
  };
  const mergeAndRemoveDuplicates = (str1, str2) => {
    // Chuyển đổi các chuỗi thành mảng số
    const arr1 = str1
      .split(",")
      .map(Number)
      .filter((num) => num !== 0);
    const arr2 = str2
      .split(",")
      .map(Number)
      .filter((num) => num !== 0);

    // Gộp hai mảng lại với nhau
    const mergedArray = [...arr1, ...arr2];

    // Loại bỏ các phần tử trùng lặp
    const uniqueArray = [...new Set(mergedArray)];

    // Chuyển đổi mảng kết quả thành chuỗi
    const resultString = uniqueArray.join(",");

    // Cập nhật kết quả
    return resultString;
  };
  const save = async (e) => {
    let itemold = props.listthietbi.filter(
      (e) => decryptData(e.diachi) == diachi
    )
      ? props.listthietbi.filter((e) => decryptData(e.diachi) == diachi)[0]
      : null;
    if (props.status == "edit") {
      itemold.loai = loai;
      console.log(diachi);
      itemold.diachi = encryptData(diachi);
      itemold.tenthietbi = encryptData(tenhethong);
      itemold.tenthuongmai = encryptData(tenthietbi);
      itemold.ring = ring;
      itemold.nguon = nguon;
      itemold.porton=porton
      itemold.portoff=portoff
      itemold.port = mergeAndRemoveDuplicates(port, ",");
      if (newUsername && newUsername) {
        if (
          decryptData(itemold.password) == oldPassword &&
          decryptData(itemold.username) == oldUsername
        ) {
          itemold.password = encryptData(newPassword);
          itemold.username = encryptData(newUsername);

          suyhaoService.UpdateData(itemold).then((res) => {
            console.log(res.data);
            toast.success("Thêm thiết bị thành công");
          });
        } else {
          toast.error("Mật khẩu và tài khoản cũ không chính xác");
        }
      } else
        suyhaoService.UpdateData(itemold).then((res) => {
          console.log(res.data);
          props.addoredit();
          toast.success("Cập nhật thiết bị thành công");
          setshow(false);
        });
    } else {
      let list = [];
      let item = {};

      if (itemold) {
        const result = await Swal.fire({
          title: "Địa chỉ đã tồn tại. Bạn có gộp port với địa chỉ cũ ?",
          text: "Dữ liệu cơ bản sẽ được giữ nguyên. Chỉ gộp phần port lại với nhau",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Gộp",
          cancelButtonText: "Hủy",
          customClass: {
            popup: "large-popup", // Add custom class for styling
          },
        });

        if (result.isConfirmed) {
          itemold.port = mergeAndRemoveDuplicates(itemold.port, port);
          suyhaoService.UpdateData(itemold).then((res) => {
            console.log(res.data);
            toast.success("Thêm thiết bị thành công");
            props.addoredit();
            setshow(false);
          });
        }
      } else {
        if (!validateIpAddress(diachi)) {
          toast.error("Vui lòng nhập địa chỉ Ip đúng định dạng");
        } else if (!validateNumberList(port)) {
          toast.error("Vui lòng nhập port đúng định dạng số,số,số");
        } else {
          item.id = RandomString(10);
          item.username = encryptData(newUsername);
          item.password = encryptData(newPassword);
          item.diachi = encryptData(diachi);
          item.tenthietbi = encryptData(tenhethong);
          item.tenthuongmai = encryptData(tenthietbi);
          item.loai = loai;
          item.port = port;
          item.ring = ring;
          item.nguon = nguon;
          item.porton=porton
          item.portoff=portoff
          list.push(item);
          suyhaoService.addData(list).then((res) => {
            console.log(res.data);
            toast.success("Thêm thiết bị thành công");
            setshow(false);
            props.addoredit();
          });
        }
      }
    }
  };
  const openModal = () => {
    //     let student = props.listst.filter((item) => item.studentId == props.id)[0];
    //     console.log();
    //     setcode(student.code);
    //     setcourse(student.course);
    //     setname(student.name);
    //     setrank(student.rank);
    //     setteacher(student.teacherId);
    portService.getdataRing().then((res) => {
      console.log(res.data);
      res.data
        .sort((a, b) => {
          const lastThreeA = a.ten; // Lấy 3 ký tự cuối của a.ten
          const lastThreeB = b.ten; // Lấy 3 ký tự cuối của b.ten
          return lastThreeA.localeCompare(lastThreeB); // So sánh theo thứ tự từ điển
        })
        .map((item, index) => {
          item.value = item.ten;
          item.label = item.ten;
        });
      let list = [...res.data];

      setListRing(list);
    });
    setshow(true);
    sethide(false);
    if (props.status == "edit") {
      console.log(props.data);
      setDiachi(decryptData(props.data.diachi));
      setLoai(props.data.loai);
      setTenthietbi(decryptData(props.data.tenthuongmai));
      setPort(props.data.port);
      setRing(
        props.data.ring != "OK" && props.data.ring != "ok" && props.data.ring
          ? props.data.ring
          : "Không"
      );
      setTenhethong(decryptData(props.data.tenthietbi));
      setNguon(props.data.nguon);
    } else {
      setDiachi("");
      setLoai("");
      setTenthietbi("");
      setTenhethong("");
      setPort("");
      setNguon(2);
      setNewPassword("Dhtthost@3");
      setNewUsername("admin");
      setRing("Không");
    }
  };

  const changeDiachi = (e) => {
    setDiachi(e.target.value);
  };
  const changeTenthietbi = (e) => {
    setTenthietbi(e.target.value);
  };
  const changeLoaithietbi = (e) => {
    setLoai(e.target.value);
    if (String(e.target.value).includes("OS6")) {
      setNewPassword("dhtthost@");
      setNewUsername("admin");
    } else {
      setNewPassword("Dhtthost@3");
      setNewUsername("admin");
    }
  };

  const changePortDown = (e) => {
    setPortoff(e.target.value);
  };
  const changePortUp = (e) => {
    setPorton(e.target.value);
  };
  const changeCong = (e) => {
    setPort(e.target.value);
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
  const changeRing = (e) => {
    setRing(e ? e.value : null);
    console.log(e);
  };
  const changeTenhethong = (e) => {
    setTenhethong(e.target.value);
  };
  const changeNguon = (e) => {
    if (Number(e.target.value) < 1) {
      setNguon(1);
    } else {
      setNguon(e.target.value);
    }
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
        backdrop="static"
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
                      Địa chỉ<a className="obligatory">*</a>
                    </label>
                    <input
                      type="text"
                      disabled={props.status == "edit"}
                      className="form-control"
                      id="code"
                      onChange={(e) => changeDiachi(e)}
                      value={diachi}
                      placeholder="Địa chỉ thiết bị"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Tên thiết bị<a className="obligatory">*</a>
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changeTenthietbi(e)}
                      value={tenthietbi}
                      type="text"
                      placeholder="Tên thiết bị"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="rank">
                      Loại thiết bị<a className="obligatory">*</a>
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => changeLoaithietbi(e)}
                      value={loai}
                    >
                      <option value="" hidden>
                        Chọn loại thiết bị
                      </option>
                      <option value="V2724G">V2724G</option>
                      <option value="V2224G">V2224G</option>
                      <option value="ECS4120-28FV2-AF">
                        {" "}
                        ECS4120-28FV2-AF
                      </option>
                      <option value="OS6400">OS6400</option>
                      <option value="OS6450">OS6450</option>
                      <option value="S5800">S5800</option>
                    </select>
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      Cổng thiết bị<a className="obligatory">*</a>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="course"
                      onChange={(e) => changeCong(e)}
                      value={port}
                      placeholder="Cổng thiết bị"
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col col-12 col-md-6 mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      {/* Chọn slot onu mới <a className="obligatory">*</a> */}
                      Chọn Ring
                    </label>
                    <Select
                      onChange={(e) => changeRing(e)}
                      options={listRing}
                      value={
                        listRing.find((option) => option.value === ring) || null
                      }
                    />
                  </div>
                </div>

                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      Tên hệ thống<a className="obligatory">*</a>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="course"
                      onChange={(e) => changeTenhethong(e)}
                      value={tenhethong}
                      placeholder="Tên hệ thống"
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col col-12 col-md-4">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      Số lượng nguồn<a className="obligatory">*</a>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="course"
                      onChange={(e) => changeNguon(e)}
                      value={nguon}
                      placeholder="Số nguồn"
                    />
                  </div>
                </div>
             
             
                <div className="col col-12 col-md-4">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      Số Port Up<a className="obligatory">*</a>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="course"
                      onChange={(e) => changePortUp(e)}
                      value={porton}
                      placeholder="Số nguồn"
                    />
                  </div>
                </div>
             
             
                <div className="col col-12 col-md-4">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      Số Port Down<a className="obligatory">*</a>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="course"
                      onChange={(e) => changePortDown(e)}
                      value={portoff}
                      placeholder="Số nguồn"
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
                          Tài khoản<a className="obligatory">*</a>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="code"
                          onChange={(e) => changeNewUsername(e)}
                          value={newUsername}
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
                          Mật khẩu<a className="obligatory">*</a>
                        </label>

                        <input
                          className="form-control"
                          id="teacher"
                          name="name"
                          onChange={(e) => changeNewPassword(e)}
                          value={newPassword}
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
                    checked={!hide}
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

export default AddOrEdit;
