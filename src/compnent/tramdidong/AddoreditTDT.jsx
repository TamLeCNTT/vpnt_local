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
import TramdidongService from "../../service/TramdidongService";
const AddoreditTDT = (props) => {
  const [show, setshow] = useState(false);

  const [ring, setRing] = useState("không");
  const [tenhethong, setTenhethong] = useState("");

  const [diachi, setDiachi] = useState("");
  const [tenthietbi, setTenthietbi] = useState("");
  const [loai, setLoai] = useState("");
  const [port, setPort] = useState("");
  const [nguon, setNguon] = useState(2);
  const [oldUsername, setOldUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [listSW, setListSW] = useState([]);
  const [listTDD, setListTDD] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [hide, sethide] = useState(true);

  const [switchs, setSwitch] = useState("");

  const [tentram, setTentram] = useState("");
  const [tenCSHT, setTenCSHT] = useState("");
  const [loaiDV, setLoaiDV] = useState("");
  const [cong, setCong] = useState("");
  const [DP, setDP] = useState(false);
  const ChangeDP = () => {
    setDP(!DP);
  };
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
    if (tenCSHT && tentram && loaiDV && cong && switchs) {
      if (props.status == "edit") {
        let item = {};
        item.tencsht = tenCSHT;
        item.tentram = tentram;
        item.dp = DP;
        item.dichvu = loaiDV;
        item.port = cong;
        item.switch = switchs;
        item.id = props.data.id;
        console.log(props.data, item);

        if (
          listTDD.findIndex(
            (e) => e.tentram == tentram && e.dichvu == loaiDV && e.dp == DP && e.id!=props.data.id
          ) == -1
        ) {
          TramdidongService.UpdateData(item).then((res) => {
            console.log(res.data);
            toast.success("Cập nhất thành công");
            props.addoredit();
            setshow(false);
          });
        } else {
          toast.info("Dữ liệu đã tồn tại");
        }
      } else {
        let item = {};
        item.tencsht = tenCSHT;
        item.tentram = tentram;
        item.dp = DP;
        item.dichvu = loaiDV;
        item.port = cong;
        item.switch = switchs;
        console.log(item);
        let list_save = [];
        list_save.push(item);

        if (
          listTDD.findIndex(
            (e) => e.tentram == tentram && e.dichvu == loaiDV && e.dp == DP
          ) == -1
        ) {
          TramdidongService.addData(list_save).then((res) => {
            console.log(res.data);
            toast.success("Thêm dữ liệu thành công");

            props.addoredit();
            setshow(false);
          });
        } else {
          toast.info("Dữ liệu đã tồn tại");
        }
      }
      props.addoredit();
    } else {
      toast.info("Vui lòng nhập đầy đủ thông tin");
    }
  };
  const openModal = () => {
    setshow(true);
    sethide(false);
    suyhaoService.getdata().then((res) => {
      res.data.map((item, index) => {
        item.value = item.id;
        item.label = decryptData(item.tenthuongmai);
      });
      let list = [...res.data];

      setListSW(list);
    });
    TramdidongService.getdata().then((res) => {
      setListTDD(res.data);
    });
    if (props.status == "edit") {
      let data = props.data;
      console.log(data);
      setCong(data.port);
      let flag = false;
      if (data.dp == 1) flag = true;
      console.log(flag);
      setDP(data.dp == "1" ? true : false);
      setLoaiDV(data.dichvu);
      setTentram(data.tentram);
      setTenCSHT(data.tencsht);
      setSwitch(data.switch);
    } else {
      setCong("");
      setDP(false);
      setLoaiDV("");
      setTentram("");
      setTenCSHT("");
      setSwitch("");
    }
  };

  const changeCong = (e) => {
    setCong(e.target.value);
  };

  const changeTenTram = (e) => {
    setTentram(e.target.value);
  };
  const changeTenCSHT = (e) => {
    setTenCSHT(e.target.value);
  };
  const ChangeDV = (e) => {
    console.log(e.target.value);
    setLoaiDV(e.target.value);
  };
  const changeSWitch = (e) => {
    setSwitch(e ? e.value : null);
    console.log(e);
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
                      Mã trạm<a className="obligatory">*</a>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      onChange={(e) => changeTenTram(e)}
                      value={tentram}
                      placeholder="Mã Trạm"
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Tên trạm<a className="obligatory">*</a>
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changeTenCSHT(e)}
                      value={tenCSHT}
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
                      Loại dịch vụ<a className="obligatory">*</a>
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => ChangeDV(e)}
                      value={loaiDV}
                    >
                      <option value="" hidden>
                        Chọn loại dịch vụ
                      </option>
                      <option value="2G">2G</option>
                      <option value="3G">3G</option>
                      <option value="4G"> 4G</option>
                      <option value="5G"> 5G</option>
                      <option value="2G+3G">2G+3G</option>
                      <option value="3G+4G">3G+4G</option>

                      <option value="2G+3G+4G">2G+3G+4G</option>
                    </select>
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      Port<a className="obligatory">*</a>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="course"
                      onChange={(e) => changeCong(e)}
                      value={cong}
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
                      Chọn switch
                    </label>
                    <Select
                      onChange={(e) => changeSWitch(e)}
                      options={listSW}
                      value={
                        listSW.find((option) => option.value === switchs) ||
                        null
                      }
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-6 mb-4 mt-5">
                  <div className="md-4">
                    <input
                      class="mr-3"
                      type="checkbox"
                      checked={DP}
                      id="defaultCheck1"
                      onClick={() => ChangeDP()}
                    />
                    <label class="mx-3" for="defaultCheck1">
                      DP
                    </label>
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

export default AddoreditTDT;
