import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import TramOLtService from "../../service/TramOLtService";
import Header from "../../Layout/Header";
import "../../Assets/scss/loading.scss";
import Loading from "../../support/Loading";
import Swal from "sweetalert2";
import mainEService from "../../service/mainEService";
import suyhaoService from "../../service/suyhaoService";
const KichONU = (props) => {
  let navtive = useNavigate();
  const [tramolt, settramolt] = useState({});
  const [mac, setMac] = useState("");
  const [listSW, setListSW] = useState([]);
  const [loaichuyenerror, setloaichuyenerror] = useState(false);
  const [checkNet, setCheckNet] = useState(false);
  const [checkMytv, setCheckMytv] = useState(false);
  const [checkVoip, setCheckVoip] = useState(false);
  const [ngaychuyen, setngaychuyen] = useState("");
  const [slot, setslot] = useState({});
  const [portpon, setportpon] = useState("");
  const [onu, setonu] = useState("");
  const [slid, setslid] = useState("");
  const [listonu, setListonu] = useState([]);
  const [disableSlot, setdisableSlot] = useState(false);
  const [listtramolt, setListtramolt] = useState([]);
  const [loading, setloading] = useState(false);
  const optionslot = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  useEffect(() => {
    TramOLtService.getdata().then((res) => {
      res.data.map((item, index) => {
        item.value = item.matram;
        item.label = item.tentram;
      });
      setListtramolt(res.data);
    });
  }, []);

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
  function replaceEncodedCharacters(inputString) {
    // Thay thế %40 bằng #
    let result = inputString.replace(/%40/g, "@");

    // Thay thế %21 bằng @
    result = result.replace(/%23/g, "#");

    return result;
  }

  const changeTramOlt = (e) => {
    console.log(e);
    e.password = replaceEncodedCharacters(e.password);
    console.log(e, e.password);
    settramolt(e);
    if (onu && e && slot && portpon) {
      if (e.loai == "zte-mini")
        setslid(
          e.matram +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      else
        setslid(
          e.matram +
            "" +
            slot.value +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      console.log(e.matram + "" + slot.value + "" + portpon + "" + onu);
    } else {
      setslid("");
    }
  };
  const changeSlotOlt = (e) => {
    console.log(e);
    setslot(e);
    if (onu && tramolt && e && portpon) {
      if (tramolt.loai == "zte-mini")
        setslid(
          tramolt.matram +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      else
        setslid(
          tramolt.matram +
            "" +
            e.value +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      console.log(tramolt.matram + "" + e.value + "" + portpon + "" + onu);
    } else {
      setslid("");
    }
  };
  const changePortpon = (e) => {
    let portponnew = "";
    if (!e.target.value) setportpon("");
    else {
      if (Number(e.target.value) < 0) {
        setportpon(0);
        portponnew = 0;
      } else {
        if (Number(e.target.value) > 16) {
          setportpon(16);
          portponnew = 16;
        } else {
          setportpon(e.target.value);
          portponnew = e.target.value;
        }
      }
    }
    if (onu && tramolt && slot && portponnew) {
      if (tramolt.loai == "zte-mini")
        setslid(
          tramolt.matram +
            "" +
            (Number(portponnew) < 10 ? "0" + portponnew : portponnew) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      else
        setslid(
          tramolt.matram +
            "" +
            slot.value +
            "" +
            (Number(portponnew) < 10 ? "0" + portponnew : portponnew) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      console.log(
        tramolt.matram + "" + slot.value + "" + portponnew + "" + onu
      );
    } else {
      setslid("");
    }
  };
  const changeCheckNet = (e) => {
    setCheckNet(e);
  };
  const changeCheckMytvt = (e) => {
    setCheckMytv(e);
  };
  const changeCheckVoip = (e) => {
    setCheckVoip(e);
  };
  const changeOnu = (e) => {
    let onunew = "";
    if (!e.target.value) setonu("");
    else {
      if (Number(e.target.value) < 1) {
        setonu(1);
        onunew = 1;
      } else {
        if (Number(e.target.value) > 64) {
          setonu(64);
          onunew = 64;
        } else {
          setonu(e.target.value);
          onunew = e.target.value;
        }
      }
    }

    if (onunew && tramolt && slot && portpon) {
      if (tramolt.loai == "zte-mini")
        setslid(
          tramolt.matram +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onunew) < 10 ? "0" + onunew : onunew)
        );
      else
        setslid(
          tramolt.matram +
            "" +
            slot.value +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onunew) < 10 ? "0" + onunew : onunew)
        );
      console.log(tramolt.matram + "" + slot.value + "" + portpon + "" + onu);
    } else {
      setslid("");
    }

    setonu(e.target.value);
    const splitResult = e.target.value.split(",").map((item) => item.trim());
    console.log(splitResult);
    setListonu(splitResult);
  };
  const changeSlid = (e) => {
    setslid(e.target.value);
  };
  const changengaychuyen = (e) => {
    setngaychuyen(e.target.value);
  };
  const ActionONU = async () => {
    if (!tramolt || !tramolt.value) {
      toast.error("Vui lòng chọn trạm olt");
    } else {
      if (!slot || !slot.value) {
        toast.error("Vui lòng chọn slot");
      } else {
        if (!portpon) {
          toast.error("Vui lòng nhập port");
        } else {
          if (!onu) {
            toast.error("Vui lòng nhập onu");
          } else {
            let port = "",
              slid_new = "",
              listSLID = [];
            if (portpon < 10) {
              port = "0" + portpon;
            }
            let list_new = [];
            listonu.map((item, index) => {
              if (Number(item) < 10) {
                item = "0" + item;
              }
              list_new.push(item);
              slid_new = tramolt.matram + slot.value + port + item;
              listSLID.push(slid);
              console.log(tramolt, port, item);
            });
            console.log(listSLID);
            const result = await Swal.fire({
              title: "Bạn chắc chắn muốn kích ONU",
              // text:

              //   "Bạn chắc chắn muốn kích ONU",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Chấp nhận",
              cancelButtonText: "Hủy",
              customClass: {
                popup: "swal-wide", // Thêm lớp tùy chỉnh
              },
            });

            if (result.isConfirmed) {
              setloading(true)
              if (tramolt.loai == "gpon-alu") {
                TramOLtService.Active_Onu_Gpon_Alu({
                  tramolt: tramolt,
                  list_slid: listSLID,
                  slot: slot.value,
                  portpon: port,
                  onu: listonu,
                  checkNet: checkNet,
                  checkMytv: checkMytv,
                  checkVoip: checkVoip,
                }).then((res) => {
                  console.log(res.data);
                  toast.success("Kích onu thành công");
                  setloading(false);
                });
              }
              if (tramolt.loai == "hw-mini") {
                TramOLtService.Active_Onu_Gpon_huawei_mini({
                  tramolt: tramolt,
                  list_slid: listSLID,
                  slot: slot.value,
                  portpon: port,
                  onu: listonu,

                  checkNet: checkNet,
                  checkMytv: checkMytv,
                  checkVoip: checkVoip,
                }).then((res) => {
                  console.log(res.data);
                  toast.success("Kich onu thành công");
                  setloading(false);
                });
              }

              if (tramolt.loai == "huawei") {
                TramOLtService.Active_Onu_Gpon_huawei({
                  tramolt: tramolt,
                  list_slid: listSLID,
                  slot: slot.value,
                  portpon: port,

                  onu: listonu,
                  checkNet: checkNet,
                  checkMytv: checkMytv,
                  checkVoip: checkVoip,
                }).then((res) => {
                  console.log(res.data);
                  toast.success("Kich onu thành công");
                  setloading(false);
                });
              }
              if (tramolt.loai == "gpon-zte") {
                TramOLtService.Active_Onu_Gpon_Zte({
                  tramolt: tramolt,
                  list_slid: listSLID,
                  slot: slot.value,
                  portpon: port,
                  onu: listonu,

                  checkNet: checkNet,
                  checkMytv: checkMytv,
                  checkVoip: checkVoip,
                }).then((res) => {
                  console.log(res.data);
                  toast.success("Kich onu thành công");
                  setloading(false);
                });
              }

              if (tramolt.loai == "zte-mini") {
                TramOLtService.Active_Onu_Gpon_Zte_mini({
                  tramolt: tramolt,
                  list_slid: listSLID,
                  slot: slot.value,
                  portpon: port,

                  onu: listonu,
                  checkNet: checkNet,
                  checkMytv: checkMytv,
                  checkVoip: checkVoip,
                }).then((res) => {
                  console.log(res.data);
                  toast.success("Kich onu thành công");
                  setloading(false);
                });
              }
              if (tramolt.loai == "dasan") {
                let slid_dasan =
                  tramolt.matram +
                  "1" +
                  (Number(portpon) < 10 ? "0" + portpon : portpon) +
                  "" +
                  (Number(onu) < 10 ? "0" + onu : onu);
                TramOLtService.Active_Onu_Gpon_dasan(
                  tramolt.ip,
                  tramolt.username,
                  tramolt.password,
                  slid_dasan,

                  onu < 10 ? "0" + onu : onu,

                  portpon < 10 ? "0" + portpon : portpon
                ).then((res) => {
                  console.log(res.data);
                  toast.success("Kích Onu thành công");
                  setloading(false);
                });
              }
            }
          }
        }
      }
    }
  };
  const SHOWMAC = () => {
    if (!tramolt || !tramolt.value) {
      toast.error("Vui lòng chọn trạm olt");
    } else {
      if (!slot || !slot.value) {
        toast.error("Vui lòng chọn slot");
      } else {
        if (!portpon) {
          toast.error("Vui lòng nhập port");
        } else {
          if (!onu) {
            toast.error("Vui lòng nhập onu");
          } else {
            setloading(true);
            let file_path = "F:\\Vi La\\suyhao\\api\\showmac.txt";
            if (tramolt.loai == "gpon-alu") {
              console.log(tramolt);
              TramOLtService.Show_MAC_Onu_Gpon_Alu(
                tramolt.ip,
                tramolt.username,
                "ans%23150",
                slot.value,
                portpon < 10 ? "0" + portpon : portpon,
                onu < 10 ? "0" + onu : onu
              ).then((res) => {
                console.log(res.data);

                TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then((res) => {
                  console.log(res.data);

                  setMac(res.data);
                });
                setloading(false);
              });
            } else {
              if (tramolt.loai == "gpon-zte") {
                const onuid =
                  "1/" +
                  slot.value +
                  "/" +
                  (portpon < 10 ? "0" + portpon : portpon);

                console.log(onu, portpon, slid, slot, tramolt, onuid);
                TramOLtService.Show_MAC_Onu_Gpon_Zte(
                  tramolt.ip,
                  tramolt.username,
                  "dhtthost%40",
                  slot.value,
                  portpon < 10 ? "0" + portpon : portpon,
                  onu < 10 ? "0" + onu : onu
                ).then((res) => {
                  console.log(res.data);

                  TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then((res) => {
                    console.log(res.data);

                    setMac(res.data);
                  });

                  setloading(false);
                });
              } else {
                if (tramolt.loai == "zte-mini") {
                  const onuid = "1/" + "3/" + portpon;
                  let slid_zte_mini =
                    tramolt.matram +
                    "" +
                    (Number(portpon) < 10 ? "0" + portpon : portpon) +
                    "" +
                    (Number(onu) < 10 ? "0" + onu : onu);
                  console.log(onu, portpon, slid, slot, tramolt, onuid);
                  TramOLtService.Show_MAC_Onu_Gpon_Zte_mini(
                    tramolt.ip,
                    tramolt.username,
                    "dhtthost%40",
                    slot.value,
                    portpon < 10 ? "0" + portpon : portpon,
                    onu < 10 ? "0" + onu : onu
                  ).then((res) => {
                    console.log(res.data);

                    TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then(
                      (res) => {
                        console.log(res.data);

                        setMac(res.data);
                      }
                    );

                    setloading(false);
                  });
                } else {
                  if (tramolt.loai == "huawei" || tramolt.loai == "hw-mini") {
                    const onuid =
                      "0/" +
                      slot.value +
                      "/" +
                      (portpon < 10 ? "0" + portpon : portpon);

                    TramOLtService.Show_MAC_Onu_Gpon_Huawei(
                      tramolt.ip,
                      tramolt.username,
                      "Dhtthost%40345678",
                      slot.value,
                      portpon < 10 ? "0" + portpon : portpon,
                      onu < 10 ? "0" + onu : onu
                    ).then((res) => {
                      console.log(res.data);

                      TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then(
                        (res) => {
                          console.log(res.data);

                          setMac(res.data);
                        }
                      );

                      setloading(false);
                    });
                  } else {
                    TramOLtService.Show_MAC_Onu_Gpon_Dasan(
                      tramolt.ip,
                      tramolt.username,
                      "dhtthost%40",
                      slot.value,
                      portpon < 10 ? "0" + portpon : portpon,
                      onu < 10 ? "0" + onu : onu
                    ).then((res) => {
                      console.log(res.data);

                      TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then(
                        (res) => {
                          console.log(res.data);

                          setMac(res.data);
                        }
                      );

                      setloading(false);
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const TIMONUMOI = () => {
    if (!tramolt || !tramolt.value) {
      toast.error("Vui lòng chọn trạm olt");
    } else {
      if (!slot || !slot.value) {
        toast.error("Vui lòng chọn slot");
      } else {
        if (!portpon) {
          toast.error("Vui lòng nhập port");
        } else {
          if (!onu) {
            toast.error("Vui lòng nhập onu");
          } else {
            setloading(true);
            let file_path = "F:\\Vi La\\suyhao\\api\\showmac.txt";
            if (tramolt.loai == "gpon-alu") {
              console.log(tramolt);
              TramOLtService.Show_ONU_Onu_Gpon_Alu(
                tramolt.ip,
                tramolt.username,
                "ans%23150",
                slot.value,
                portpon < 10 ? "0" + portpon : portpon,
                onu < 10 ? "0" + onu : onu
              ).then((res) => {
                console.log(res.data);

                TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then((res) => {
                  console.log(res.data);

                  setMac(res.data);
                });
                setloading(false);
              });
            } else {
              if (tramolt.loai == "gpon-zte" || tramolt.loai == "zte-mini") {
                const onuid =
                  "1/" +
                  slot.value +
                  "/" +
                  (portpon < 10 ? "0" + portpon : portpon);

                console.log(onu, portpon, slid, slot, tramolt, onuid);
                TramOLtService.Show_ONU_Onu_Gpon_Zte(
                  tramolt.ip,
                  tramolt.username,
                  "dhtthost%40",
                  slot.value,
                  portpon < 10 ? "0" + portpon : portpon,
                  onu < 10 ? "0" + onu : onu
                ).then((res) => {
                  console.log(res.data);
                  TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then((res) => {
                    console.log(res.data);

                    setMac(res.data);
                  });
                  setloading(false);
                });
              } else {
                if (tramolt.loai == "huawei" || tramolt.loai == "hw-mini") {
                  const onuid =
                    "0/" +
                    slot.value +
                    "/" +
                    (portpon < 10 ? "0" + portpon : portpon);

                  TramOLtService.Show_ONU_Onu_Gpon_huawei(
                    tramolt.ip,
                    tramolt.username,
                    "Dhtthost%40345678",
                    slot.value,
                    portpon < 10 ? "0" + portpon : portpon,
                    onu < 10 ? "0" + onu : onu
                  ).then((res) => {
                    console.log(res.data);
                    TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then(
                      (res) => {
                        console.log(res.data);

                        setMac(res.data);
                      }
                    );
                    setloading(false);
                  });
                } else {
                  TramOLtService.Show_ONU_Onu_Gpon_dasan(
                    tramolt.ip,
                    tramolt.username,
                    "dhtthost%40",
                    slot.value,
                    portpon < 10 ? "0" + portpon : portpon,
                    onu < 10 ? "0" + onu : onu
                  ).then((res) => {
                    console.log(res.data);
                    TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then(
                      (res) => {
                        console.log(res.data);

                        setMac(res.data);
                      }
                    );
                    setloading(false);
                  });
                }
              }
            }
          }
        }
      }
    }
  };
  return (
    <>
      {loading && (
        // <div className="overlay">
        //   <div className="spinner-border text-primary" role="status">
        //     <span className="sr-only">Loading...</span>
        //   </div>
        // </div>
        <Loading />
      )}

      <Header />
      <main id="cabin_list" className="main mt-5 ">
        <div className="container">
          <section id="about" className="about">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className=" mb-4 col col-md-12 tonghop-label">
                  <p class="text-center text-uppercase fs-2">
                    Kích hoạt thiết bị onu
                  </p>
                </div>
              </div>
              <div className="row mb-9">
                {/* Chọn loại */}
                <div className="col col-12 col-md-4 mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Chọn trạm <a className="obligatory">*</a>
                    </label>
                    <Select
                      onChange={(e) => changeTramOlt(e)}
                      options={listtramolt}
                      value={tramolt}
                      className={loaichuyenerror ? "error" : ""}
                      isClearable
                    />
                  </div>
                </div>

                {/* Ma tram */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Mã trạm
                    </label>
                    <input
                      className={"form-control"}
                      disabled
                      value={tramolt?.matram || ""}
                    />
                  </div>
                </div>
                {/* HIS */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      HIS
                    </label>
                    <input
                      className={"form-control"}
                      disabled
                      value={tramolt?.his || ""}
                    />
                  </div>
                </div>
                {/* My TV */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      MyTV
                    </label>
                    <input
                      className={"form-control"}
                      disabled
                      value={tramolt?.mytv || ""}
                    />
                  </div>
                </div>
                {/* Loai */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Loại
                    </label>
                    <input
                      className={"form-control text-uppercase"}
                      disabled
                      value={tramolt?.loai || ""}
                    />
                  </div>
                </div>
              </div>
              {/* ---------------  dong 2--------------------------------------------------- */}
              <div className="row mb-9">
                {/* Chọn slot */}
                <div className="col col-12 col-md-1 mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Chọn slot <a className="obligatory">*</a>
                    </label>
                    <Select
                      isDisabled={disableSlot}
                      onChange={(e) => changeSlotOlt(e)}
                      options={optionslot}
                      value={slot}
                      className={loaichuyenerror ? "error" : ""}
                    />
                  </div>
                </div>

                {/* port pon */}
                <div className="col col-12 col-md-1  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Port PON
                    </label>
                    <input
                      className={"form-control"}
                      type="number"
                      value={portpon}
                      onChange={(e) => changePortpon(e)}
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-1  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      ONU
                    </label>
                    <input
                      className={"form-control"}
                      type="number"
                      value={onu}
                      onChange={(e) => changeOnu(e)}
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-3  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      SLID
                    </label>
                    <input
                      className={"form-control"}
                      type="text"
                      value={slid}
                      onChange={(e) => changeSlid(e)}
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-1  mb-4 d-flex align-items-center">
                  <div className="md- d-flex align-items-center ">
                    <div className="d-flex align-items-center ">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checkNet} // Giá trị của checkbox
                        onChange={(e) => changeCheckNet(e.target.checked)} // Xử lý thay đổi checkbox
                      />
                      <label className=" ms-3 " htmlFor="checkbox-slid">
                        NET
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col col-12 col-md-1  mb-4 d-flex align-items-center">
                  <div className="md- d-flex align-items-center ">
                    <div className="d-flex align-items-center ">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checkMytv} // Giá trị của checkbox
                        onChange={(e) => changeCheckMytvt(e.target.checked)} // Xử lý thay đổi checkbox
                      />
                      <label className=" ms-3 " htmlFor="checkbox-slid">
                        MY TV
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col col-12 col-md-1  mb-4 d-flex align-items-center">
                  <div className="md- d-flex align-items-center ">
                    <div className="d-flex align-items-center ">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checkVoip} // Giá trị của checkbox
                        onChange={(e) => changeCheckVoip(e.target.checked)} // Xử lý thay đổi checkbox
                      />
                      <label className=" ms-3 " htmlFor="checkbox-slid">
                        VOIP
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* --------------------------dong 3 */}
              <div className="row mb-9">
                {/* Chọn slot */}
                <div className="col col-12 col-md-12 mb-4 ">
                  <div className="d-flex md-4 justify-content-center align-items-center">
                    <button
                      onClick={() => TIMONUMOI()}
                      className="btn btn-lg btn-info p-3 text-uppercase btn-block fs-1 mr-3 "
                    >
                      TÌM ONU MỚI
                    </button>
                    <button
                      onClick={() => SHOWMAC()}
                      className="btn btn-lg btn-success p-3 text-uppercase btn-block fs-1 ms-5 "
                    >
                      SHOW MAC
                    </button>
                    <button
                      onClick={() => ActionONU()}
                      className="btn btn-lg btn-primary p-3 text-uppercase btn-block fs-1 ms-5 "
                    >
                      Kích ONU
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div
            className="container p-3 border rounded"
            style={{
              backgroundColor: "#222",
              color: "yellow",
              maxWidth: "100vh",
            }}
          >
            <div
              className="mb-3"
              style={{
                height: "80vh",
                overflowY: "auto",
                whiteSpace: "pre",
                fontFamily: "monospace",
              }}
            >
              {mac.length > 0
                ? mac.map((line, index) => <div key={index}>{line}</div>)
                : ""}
            </div>
          </div>
        </div>
      </main>
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
export default connect(mapStateToProps, mapDispatchToProps)(KichONU);
