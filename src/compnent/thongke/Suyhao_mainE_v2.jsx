import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./thongke.scss";
import TramOLtService from "../../service/TramOLtService";
import suyhaoService from "../../service/suyhaoService";
import CryptoJS from "crypto-js";
import ImportSuyhao from "../../support/ImportSuyhao";
import suyhao_olt_Service from "../../service/suyhao_olt_Service";
import mainEService from "../../service/mainEService";
import Loading from "../../support/Loading";
import { toast } from "react-toastify";
const Suyhao_mainE_v2 = () => {
  const [lists, setLists] = useState([]);
  const [dinhmuc, setdinhmuc] = useState(2);
  let flash = 0;
  let flagnumber = 0;
  const [loading, setloading] = useState(false);
  const [listPg, setListPg] = useState([]);
  const [list_export, setlist_export] = useState([]);
  const [flag, setflag] = useState(false);
  const [load, setload] = useState(false);
  const [gio, setgio] = useState(7);
  const [phut, setphut] = useState(0);
  const [status, setStatus] = useState(false);
  const header = [
    [
      "SITE NAME",
      "IP ADDRESS",
      "HOSTNAME",
      "PORT",
      "Thông số suy hao",
      "W_low",
      "SITE NEIGHBORS",
      "IP NEIGHBORS",
      "HOSTNAME NEIGHBORS",
      "PORT NEIGHBORS",
    ],
  ];
  let navitive = useNavigate();
  useEffect(() => {
    mainEService
      .getDatainFile("timebackup.txt")
      .then((res) => {
        console.log(res.data.data);
        if (res.data.data) {
          setStatus(true);
          mainEService.autorun(res.data.data).then((res) => {});
        } else {
          setStatus(false);
        }
      })
      .catch((err) => {});
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 19 && minutes === 0) {
        setload(!load);
      }
    };

    const intervalId = setInterval(checkTime, 60000); // Kiểm tra mỗi phút

    return () => clearInterval(intervalId); // Xóa interval khi component unmount
  }, []);
  const min = (a, b, c) => {
    let i1 = Number(b) - Number(a);
    let i2 = 999999;
    return i1 < i2 ? i1 : i2;
  };
  const TenGigE = (text) => {
    // Sử dụng Regular Expression để trích xuất phần sau 'TenGigE'
    const match = text.match(/TenGigE(\d+\/\d+\/\d+\/\d+)/);
    if (match) {
      return match[1];
    }
    return "Không tìm thấy";
  };
  const TE = (text) => {
    // Sử dụng Regular Expression để trích xuất phần sau 'TenGigE'
    const match = text.match(/Te(\d+\/\d+\/\d+\/\d+)/);
    if (match) {
      return match[1];
    }
    return "Không tìm thấy";
  };
  const changedinhmuc = (e) => {
    let dinhmuc = "";
    if (!e.target.value) setdinhmuc("");
    else if (Number(e.target.value) < 1) {
      setdinhmuc(1);
      dinhmuc = 1;
    } else {
      setdinhmuc(e.target.value);
      let list = lists;
      dinhmuc = e.target.value;
      setLists(list);
    }
    console.log(lists);
    let listshow_export_suyhao = [];
    lists.map((item, index) => {
      if (
        Number(item.RXpower) < 99 &&
        Number(item.RXpower) - Number(item.w_low) < dinhmuc
      ) {
        let item_export = {};
        item_export.tenthietbi = decryptData(item.tenthietbi);
        item_export.diachi = decryptData(item.diachi);
        item_export.tenhethong = item.tenhethong;
        item_export.port = item.port;
        item_export.RXpower = item.RXpower;
        item_export.w_low = item.w_low;
        item_export.nbsitename = item.nBSiteName;
        item_export.ip = item.nBSIp;
        item_export.hostname = item.nBHostName;
        item_export.nbport = item.nBPort;
        listshow_export_suyhao.push(item_export);
        console.log(listshow_export_suyhao)
        setlist_export(listshow_export_suyhao.sort((x, y) => (Number(x.RXpower) - Number(x.w_low)) - (Number(y.RXpower) - Number(y.w_low))));
      }
    });
  };
  const changeHour = (e) => {
    setgio(e.target.value);
  };
  const changeMinute = (e) => {
    setphut(e.target.value);
  };
  const Loadpage = () => {
    setload(!load);
  };
  useEffect(() => {
    flagnumber = 0;
    const fetchData = () => {
      // setloading(true)
      let listshow_export_suyhao = [];
      mainEService
        .getdata()
        .then((ress) => {
          let listupe = ress.data;
          ress.data.map((item, index) => {
            let listshow_export_suyhao = list_export;

            mainEService
              .get_rx_power_by_upe(
                decryptData(item.ip),
                decryptData(item.username),
                decryptData(item.password)
              )
              .then((res) => {
                if (res) {
                  res &&
                    res.data &&
                    res.data.data &&
                    res.data.data.map((items, i) => {
                      let newitem = {};
                      newitem.diachi = item.ip;
                      newitem.tenthietbi = item.tentram;
                      newitem.username = item.username;
                      newitem.password = item.password;
                      newitem.tenhethong = item.tenhethong;
                      newitem.port = items.port;
                      newitem.RXpower = items.rx_power;
                      newitem.w_low = items.rx_min;
                      newitem.w_high = "";
                      let listNeibor = res.data.data1;
                      newitem.nBHostName = listNeibor.filter(
                        (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                      ).length
                        ? listNeibor.filter(
                            (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                          )[0].DeviceID + "0"
                        : "";
                      newitem.nBPort = listNeibor.filter(
                        (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                      ).length
                        ? listNeibor.filter(
                            (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                          )[0].PortID
                        : "";
                      newitem.nBSiteName = listupe.filter(
                        (e) => e.tenhethong == newitem.nBHostName
                      ).length
                        ? decryptData(
                            listupe.filter(
                              (e) => e.tenhethong == newitem.nBHostName
                            )[0].tentram
                          )
                        : "";
                      newitem.nBSIp = listupe.filter(
                        (e) => e.tenhethong == newitem.nBHostName
                      ).length
                        ? decryptData(
                            listupe.filter(
                              (e) => e.tenhethong == newitem.nBHostName
                            )[0].ip
                          )
                        : "";

                      console.log(
                        listupe.filter(
                          (e) => e.tenhethong == newitem.nBHostName
                        ),
                        newitem.nBHostName,
                        listupe
                      );

                      if (
                        Number(items.rx_power) < 99 &&
                        Number(items.rx_power) - Number(items.rx_min) < dinhmuc
                      ) {
                        let item_export = {};
                        item_export.tenthietbi = decryptData(item.tentram);
                        item_export.diachi = decryptData(item.ip);
                        item_export.tenhethong = item.tenhethong;
                        item_export.port = items.port;
                        item_export.RXpower = items.rx_power;
                        item_export.w_low = items.rx_min;
                        item_export.nbsitename = newitem.nBSiteName;
                        item_export.ip = newitem.nBSIp;
                        item_export.hostname = newitem.nBHostName;
                        item_export.nbport = newitem.nBPort;
                        listshow_export_suyhao.push(item_export);
                        setlist_export(listshow_export_suyhao.sort((x, y) => (x.RXpower - x.w_low) - (y.RXpower - y.w_low)));
                      }
                      setLists((prevList) => {
                        // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                        const exists = prevList.some(
                          (item) =>
                            item.diachi === newitem.diachi &&
                            item.port === newitem.port
                        );

                        // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                        if (!exists) {
                          return [...prevList, newitem].sort(
                            (a, b) =>
                              min(a.w_low, a.RXpower, a.w_high) -
                              min(b.w_low, b.RXpower, b.w_high)
                          );
                        } else {
                          return prevList; // Giữ nguyên nếu đã tồn tại
                        }
                      });

                      if (0 == Number(index)) {
                        setloading(false);
                        if (flagnumber == 0) {
                          flagnumber = 1;
                          toast.success("Quét hoàn thành!!!");
                        }
                      } else {
                        //  setloading(true)
                      }
                    });
                } else {
                  console.log("eror");
                }
                setflag(true);
              });
          });
        })
        .catch((e) => {
          /// setloading(true)
          mainEService
            .getdata()
            .then((ress) => {
              let listupe = ress.data;
              ress.data.map((item, index) => {
                let listshow_export_suyhao = list_export;
                mainEService
                  .get_rx_power_by_upe(
                    decryptData(item.ip),
                    decryptData(item.username),
                    decryptData(item.password)
                  )
                  .then((res) => {
                    if (res) {
                      console.log(res.data);
                      res &&
                        res.data &&
                        res.data.data &&
                        res.data.data.map((items, i) => {
                          let newitem = {};
                          newitem.diachi = item.ip;
                          newitem.tenthietbi = item.tentram;
                          newitem.username = item.username;
                          newitem.password = item.password;
                          newitem.tenhethong = item.tenhethong;
                          newitem.port = items.port;
                          newitem.RXpower = items.rx_power;
                          newitem.w_low = items.rx_min;
                          newitem.w_high = "";
                          let listNeibor = res.data.data1;
                          newitem.nBHostName = listNeibor.filter(
                            (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                          ).length
                            ? listNeibor.filter(
                                (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                              )[0].DeviceID + "0"
                            : "";
                          newitem.nBPort = listNeibor.filter(
                            (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                          ).length
                            ? listNeibor.filter(
                                (e) => TE(e.LocalIntrfce) == TenGigE(items.port)
                              )[0].PortID
                            : "";
                          newitem.nBSiteName = listupe.filter(
                            (e) => e.tenhethong == newitem.nBHostName
                          ).length
                            ? decryptData(
                                listupe.filter(
                                  (e) => e.tenhethong == newitem.nBHostName
                                )[0].tentram
                              )
                            : "";
                          newitem.nBSIp = listupe.filter(
                            (e) => e.tenhethong == newitem.nBHostName
                          ).length
                            ? decryptData(
                                listupe.filter(
                                  (e) => e.tenhethong == newitem.nBHostName
                                )[0].ip
                              )
                            : "";

                          console.log(
                            listupe.filter(
                              (e) => e.tenhethong == newitem.nBHostName
                            ),
                            newitem.nBHostName,
                            listupe
                          );

                          if (
                            Number(items.rx_power) < 99 &&
                            Number(items.rx_power) - Number(items.rx_min) <
                              dinhmuc
                          ) {
                            let item_export = {};
                            item_export.tenthietbi = decryptData(item.tentram);
                            item_export.diachi = decryptData(item.ip);
                            item_export.tenhethong = item.tenhethong;
                            item_export.port = items.port;
                            item_export.RXpower = items.rx_power;
                            item_export.w_low = items.rx_min;
                            item_export.nbsitename = newitem.nBSiteName;
                            item_export.ip = newitem.nBSIp;
                            item_export.hostname = newitem.nBHostName;
                            item_export.nbport = newitem.nBPort;
                            listshow_export_suyhao.push(item_export);
                            setlist_export(listshow_export_suyhao.sort((x, y) => (x.RXpower - x.w_low) - (y.RXpower - y.w_low)));
                          }
                          setLists((prevList) => {
                            // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                            const exists = prevList.some(
                              (item) =>
                                item.diachi === newitem.diachi &&
                                item.port === newitem.port
                            );

                            // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                            if (!exists) {
                              return [...prevList, newitem].sort(
                                (a, b) =>
                                  min(a.w_low, a.RXpower, a.w_high) -
                                  min(b.w_low, b.RXpower, b.w_high)
                              );
                            } else {
                              return prevList; // Giữ nguyên nếu đã tồn tại
                            }
                          });

                          if (0 == Number(index)) {
                            setloading(false);

                            if (flagnumber == 0) {
                              flagnumber = 1;
                              toast.success("Quét hoàn thành!!!");
                            }
                          } else {
                            //    setloading(true)
                          }
                        });
                    } else {
                      console.log("eror");
                    }

                    setflag(true);
                  });
              });
            })
            .catch((err) => {
              setloading(false);
            });
        });
    };

    setLists([]);
    setflag(false);
    fetchData();
  }, [load]);

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
  const getdata = (e) => {
    console.log(e);
    e.map((item, index) => {
      // console.log(item);
      item.username = encryptData(item.username);
      item.password = encryptData(item.password);
      item.diachi = encryptData(item.diachi);
      item.tenthietbi = encryptData(item.tenthietbi);
      item.tenhethong = encryptData(item.tenthuongmai);
    });
    suyhaoService.addData(e).then((res) => {
      //  console.log(res.data);
    });
    setLists(e);
  };

  const getlist = (e) => {
    setListPg(e);
  };
  const Auto = () => {
    let time =
      (gio > 9 ? gio : "0" + gio) + ":" + (phut > 9 ? phut : "0" + phut);
    mainEService.autorun(time).then((res) => {
      toast.success("Thêm lịch Auto Backup thành công!");
      mainEService.writeDatainFile("timebackup.txt", time);
    });
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
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-4">
            <div className="col col-md-6 col-lg-12 col-sm-12 b-2">
              <NavLink to="/">
                <i class="fa-solid fa-home" /> Trang chủ &nbsp;
              </NavLink>
              / Giám sát suy hao / Thống kê suy hao Man-E
            </div>
          </div>

          <div className="row mt-4 d-flex justify-content-between ">
            <div className="col col-md-5">
              <div class="time-container">
                <span class="label">Chọn thời gian:</span>

                <div class="input-group">
                  <label class="input-group-text">Hour</label>
                  <input
                    type="number"
                    className="form-control"
                    id="minute"
                    min="0"
                    max="59"
                    value={gio}
                    onChange={(e) => changeHour(e)}
                  />
                </div>

                <div class="input-group">
                  <label class="input-group-text">Minute</label>
                  <input
                    type="number"
                    className="form-control"
                    id="minute"
                    min="0"
                    max="59"
                    value={phut}
                    onChange={(e) => changeMinute(e)}
                  />
                </div>

                <div class="input-group">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => Auto()}
                  >
                    Run Auto
                  </button>
                </div>
              </div>
            </div>
            <div className="col col-md-1 d-flex align-items-center justify-content-center">
              <label className="form-label tonghop-label"> Định mức</label>
            </div>
            <div className="col col-md-1 mt-2">
              {" "}
              <input
                type="number"
                className="form-control  ms-2 "
                onChange={(e) => changedinhmuc(e)}
                value={dinhmuc}
                placeholder="Định mức suy hao"
              />
            </div>
            <div className="col col-md-5 mt-2">
              <div className="row">
                <div className="col col-md-4">
                  <button
                    onClick={() => Loadpage()}
                    className={
                      flag
                        ? "btn btn-lg  btn-success"
                        : "btn btn-lg disabled btn-success"
                    }
                  >
                    Làm mới trạng thái
                  </button>
                </div>
                <div className="col col-md-7">
                  <ImportSuyhao
                    getdata={getdata}
                    header={header}
                    data={list_export.sort((a, b) =>
                      b.nbport.localeCompare(a.nbport)
                    )}
                    row={0}
                    name={
                      "DanhSach_Suyhao_MainE_" +
                      new Date().getFullYear() +
                      "_" +
                      (new Date().getMonth() + 1) +
                      "_" +
                      new Date().getDate()
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <table className="table mt-3 table-bordered   table-hover">
            <thead className="thead-dark">
              <tr>
                <th>STT</th>
                {/* <th scope="col">SITE NAME</th> */}
                <th scope="col">SITE NAME</th>
                <th scope="col">IP ADDRESS</th>

                <th scope="col">HOSTNAME</th>
                <th scope="col">PORT</th>

                <th scope="col">Thông số suy hao</th>
                <th scope="col">W_Low</th>
                <th scope="col">SITE NEIGHBORS</th>
                <th scope="col">IP NEIGHBORS</th>
                <th scope="col">HOSTNAME NEIGHBORS</th>
                <th scope="col">PORT NEIGHBORS</th>

                {/* <th scope="col">W_High</th> */}
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists.map((item, index) => {
                  return (
                    <tr
                      className={
                        // ||Number(item.RXpower) - Number(item.w_high) > -2
                        Number(item.RXpower) < 99 &&
                        Number(item.RXpower) - Number(item.w_low) < dinhmuc
                          ? "alert tr-backgroud"
                          : "alert"
                      }
                      role="alert"
                      key={index}
                    >
                      <td scope="row">{index + 1}</td>
                      <td>{decryptData(item.tenthietbi)}</td>
                      <td>{decryptData(item.diachi)}</td>

                      <td> {item.tenhethong} </td>
                      <td> {item.port} </td>

                      <td>
                        {" "}
                        {item.RXpower != 9999
                          ? item.RXpower + " dBm"
                          : " DDM not supported"}{" "}
                      </td>
                      <td>
                        {" "}
                        {item.RXpower != 9999
                          ? item.w_low + " dBm"
                          : "w_low not found"}{" "}
                      </td>
                      <td> {item.nBSiteName} </td>
                      <td> {item.nBSIp} </td>
                      <td> {item.nBHostName} </td>
                      <td> {item.nBPort} </td>
                      {/* <td>
                        {" "}
                        {item.RXpower != 9999
                          ? item.w_high + " dBm"
                          : "w_high not found"}{" "}
                      </td> */}
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {/* <Paginations
            itemsPerPage={20}
            list={lists.sort(
                    (a, b) =>
                      -min(a.w_low, a.RXpower, a.w_high) +
                      min(b.w_low, b.RXpower, b.w_high)
                  )}
            getlist={getlist}
          /> */}
        </div>
      </main>
    </>
  );
};
export default Suyhao_mainE_v2;
