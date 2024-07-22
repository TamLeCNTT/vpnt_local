import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import "./thongke.scss";
import Paginations from "../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import { da } from "date-fns/locale";
import nhienlieuService from "../../service/nhienlieuService";
import suyhaoService from "../../service/suyhaoService";
import CryptoJS from "crypto-js";
const Suyhao_v2 = () => {
  const [lists, setLists] = useState([]);
  let flash = 0;
  const [listPg, setListPg] = useState([]);
  const header = [
    [
      "STT",
      "tentram",
      "tgbdac",
      "tgktac",
      "tgbdmn",
      "tgktmn",
      "tongtg",
      "ghichu",
      "tram",
    ],
  ];
  const min = (a, b, c) => {
    let i1 = Number(b) - Number(a);
    let i2 = Number(c) - Number(b);
    return i1 < i2 ? i1 : i2;
  };
  useEffect(() => {
    const fetchData = () => {
      // await suyhaoService
      //   .get_rx_power_by_ECS("10.102.4.183", "admin", "Dhtthost@3", 1, 23)
      //   .then((res) => {
      //     console.log("SW2724", res.data);
      //   })
      //   .catch((er) => {
      //     console.log(er);
      //   });
      // await suyhaoService
      //   .get_rx_power_by_SW2724("10.102.4.252", "admin", "Dhtthost@3", 0, 27)
      //   .then((res) => {
      //     console.log("SW2724", res.data);
      //   })
      //   .catch((er) => {
      //     console.log(er);
      //   });
      // await suyhaoService
      //   .get_rx_power_by_A6400("10.102.5.101", "admin", "Dhtthost@3", 1, 24)
      //   .then((res) => {
      //     console.log(res.data);
      //   })
      //   .catch((er) => {
      //     console.log(er);
      //   })
      let listshow_suyhao = [];
      setLists([]);
      suyhaoService.getdata().then((res) => {
        console.log(res.data);
      });
      suyhaoService.getdata().then((res) => {
        console.log(Object.values(res.data));
        Object.values(res.data).map(async (item, index) => {
          if (item.loai == "V2224G") {
            console.log("sw2224");
            await suyhaoService
              .get_rx_power_by_SW2224(
                decryptData(item.diachi),
                decryptData(item.username),
                decryptData(item.password),
                item.port
              )
              .then((res) => {
                // console.log(decryptData(item.diachi), item.port, res.data);
                const correctedJsonString = res.data.RXpower.replace(/'/g, '"');

                JSON.parse(correctedJsonString).map((e, i) => {
                  let newitem = {};
                  newitem.diachi = item.diachi;
                  newitem.username = item.username;
                  newitem.password = item.password;
                  newitem.tenthietbi = item.tenthietbi;
                  newitem.loai = item.loai;
                  newitem.RXpower = e.rx_power;
                  newitem.port = e.port;
                  newitem.w_low = e.w_low;
                  newitem.w_high = e.w_high;
                  setLists((prevList) =>
                    [...prevList, newitem].sort(
                      (a, b) =>
                        min(a.w_low, a.RXpower, a.w_high) -
                        min(b.w_low, b.RXpower, b.w_high)
                    )
                  );
                });

                // item.RXpower = res.data.RXpower;
                // listshow_suyhao.push(item);
              })
              .catch((er) => {
                console.log(er);
              });
          }
          if (item.loai == "ECS4120-28FV2-AF") {
            console.log("ECS");
            console.log(
              decryptData(item.diachi),
              decryptData(item.username),
              decryptData(item.password),

              item.port
            );
            await suyhaoService
              .get_rx_power_by_ECS(
                decryptData(item.diachi),
                decryptData(item.username),
                decryptData(item.password),

                item.port
              )
              .then((res) => {
                const correctedJsonString = res.data.RXpower.replace(/'/g, '"');
                console.log(JSON.parse(correctedJsonString));

                JSON.parse(correctedJsonString).map((e, i) => {
                  console.log(e, item);
                  let newitem = {};
                  newitem.diachi = item.diachi;
                  newitem.username = item.username;
                  newitem.password = item.password;
                  newitem.tenthietbi = item.tenthietbi;
                  newitem.loai = item.loai;
                  newitem.RXpower = e.rx_power;
                  newitem.port = e.port;
                  newitem.w_low = e.w_low;
                  newitem.w_high = e.w_high;
                  setLists((prevList) =>
                    [...prevList, newitem].sort(
                      (a, b) =>
                        min(a.w_low, a.RXpower, a.w_high) -
                        min(b.w_low, b.RXpower, b.w_high)
                    )
                  );
                });
              })
              .catch((er) => {
                console.log(er);
              });
          }
          if (String(item.loai).includes("OS6")) {
            console.log("A6400");
            await suyhaoService
              .get_rx_power_by_A6400(
                decryptData(item.diachi),
                decryptData(item.username),
                decryptData(item.password),

                item.port
              )
              .then((res) => {
                const correctedJsonString = res.data.RXpower.replace(/'/g, '"');
                console.log(JSON.parse(correctedJsonString));
                JSON.parse(correctedJsonString).map((e, i) => {
                  let newitem = {};
                  newitem.diachi = item.diachi;
                  newitem.username = item.username;
                  newitem.password = item.password;
                  newitem.tenthietbi = item.tenthietbi;
                  newitem.loai = item.loai;
                  newitem.RXpower = e.rx_power;
                  newitem.port = e.port;
                  newitem.w_low = e.w_low;
                  newitem.w_high = e.w_high;

                  setLists((prevList) =>
                    [...prevList, newitem].sort(
                      (a, b) =>
                        min(a.w_low, a.RXpower, a.w_high) -
                        min(b.w_low, b.RXpower, b.w_high)
                    )
                  );
                });
              })
              .catch((er) => {
                console.log(er);
              });
          }
          if (item.loai == "V2724G") {
            console.log("sw2724");
            await suyhaoService
              .get_rx_power_by_SW2724(
                decryptData(item.diachi),
                decryptData(item.username),
                decryptData(item.password),

                item.port
              )
              .then((res) => {
                const correctedJsonString = res.data.RXpower.replace(/'/g, '"');

                JSON.parse(correctedJsonString).map((e, i) => {
                  let newitem = {};
                  newitem.diachi = item.diachi;
                  newitem.username = item.username;
                  newitem.password = item.password;
                  newitem.tenthietbi = item.tenthietbi;
                  newitem.loai = item.loai;
                  newitem.RXpower = e.rx_power;
                  newitem.port = e.port;
                  newitem.w_low = e.w_low;
                  newitem.w_high = e.w_high;
                  setLists((prevList) =>
                    [...prevList, newitem].sort(
                      (a, b) =>
                        min(a.w_low, a.RXpower, a.w_high) -
                        min(b.w_low, b.RXpower, b.w_high)
                    )
                  );
                });
              })
              .catch((er) => {
                console.log(er);
              });
          }
        });
      });
    };
    fetchData();
    // const interval = setInterval(fetchData, 30000); // 600000 milliseconds = 10 phút
    // // Dọn dẹp để tránh rò rỉ bộ nhớ
    // return () => clearInterval(interval);
  }, []);
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
      console.log(item);
      item.username = encryptData(item.username);
      item.password = encryptData(item.password);
      item.diachi = encryptData(item.diachi);
      item.tenthietbi = encryptData(item.tenthietbi);
    });
    suyhaoService.addData(e).then((res) => {
      console.log(res.data);
    });
    setLists(e);
  };

  const getlist = (e) => {
    setListPg(e);
  };
  return (
    <>
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-5 d-flex justify-content-between ">
            <div className="col col-md-7">
              <input
                type="text"
                className="form-control  ms-2 "
                id="teacher"
                // onChange={(e) => changetext(e)}
                // value={text}
                placeholder="Nhập nội dung tìm kiếm"
              />
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-5">
              <div className="row">
                <div className="col col-md-10">
                  <ImportNhienlieu
                    getdata={getdata}
                    header={header}
                    data={lists}
                    row={0}
                    name={
                      "DanhSach_HocVien_" +
                      new Date().getFullYear() +
                      "_" +
                      new Date().getMonth() +
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
                <th scope="col">Địa chỉ</th>
                <th scope="col">Tên thiết bị</th>
                <th scope="col">Loại</th>
                <th scope="col">Port</th>

                <th scope="col">Thông số suy hao</th>
                <th scope="col">W_Low</th>
                <th scope="col">W_High</th>

                <th scope="col">Quản lý</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists.map((item, index) => {
                  return (
                    <tr
                      className={
                        Number(item.RXpower) < 99 &&
                        (Number(item.RXpower) - Number(item.w_low) < 1 ||
                          Number(item.RXpower) - Number(item.w_high) > -1)
                          ? "alert tr-backgroud"
                          : "alert"
                      }
                      role="alert"
                      key={index}
                    >
                      <td scope="row">{index + 1}</td>
                      <td>{decryptData(item.diachi)}</td>
                      <td>{decryptData(item.tenthietbi)}</td>
                      <td> {item.loai} </td>
                      <td> {item.port} </td>
                      <td>
                        {" "}
                        {item.RXpower != 9999
                          ? item.RXpower + " dBm"
                          : "RX power not found"}{" "}
                      </td>
                      <td>
                        {" "}
                        {item.RXpower != 9999
                          ? item.w_low + " dBm"
                          : "w_low not found"}{" "}
                      </td>
                      <td>
                        {" "}
                        {item.RXpower != 9999
                          ? item.w_high + " dBm"
                          : "w_high not found"}{" "}
                      </td>
                      <td> edit</td>
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
export default Suyhao_v2;
