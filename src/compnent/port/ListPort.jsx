import Header from "../../Layout/Header";
import { useState, useEffect } from "react";

import Paginations from "../../support/Paginations";
// import Cabin_edit from "./Cabin_edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import { da } from "date-fns/locale";

import portService from "../../service/portService";
import { Modal } from "react-bootstrap";
import suyhaoService from "../../service/suyhaoService";
const ListPort = () => {
  const [lists, setLists] = useState([]);
  const [show, setshow] = useState(false);
  const [flag, setflag] = useState(false);
  const [tenthietbi, settenthietbi] = useState("");
  const [loaithietbi, setloaithietbi] = useState("");
  const [listthietbi, setlistthietbi] = useState([]);
  const openModal = () => {
    setshow(true);
  };
  const ChangeTypeDevice = (e) => {
    console.log(e);
    setloaithietbi(e.target.value);
  };
  const ChangeNameDevice = (e) => {
    settenthietbi(e.target.value);
  };
  const fetchData = async () => {
    try {
      console.log("Bắt đầu đo dữ liệu...");
      const res = await portService.getdata();
      let listStatus = [];

      // Hàm xử lý lấy dữ liệu từ API song song
      const handleDevice = async (item) => {
        try {
          let statusRes, powerRes;

          if (item.loai === "V2724G") {
            statusRes = portService.get_status_port_by_SW2724(
              item.ip,
              item.username,
              item.password,
              item.port
            );
            powerRes = suyhaoService.get_rx_power_by_SW2724(
              item.ip,
              item.username,
              item.password,
              item.port
            );
          } else if (item.loai === "OS6450" || item.loai === "OS6400") {
            statusRes = portService.get_status_port_by_A6400(
              item.ip,
              item.username,
              item.password,
              item.port
            );
            powerRes = suyhaoService.get_rx_power_by_A6400(
              item.ip,
              item.username,
              item.password,
              item.port
            );
          } else if (item.loai === "V2224G") {
            statusRes = portService.get_status_port_by_SW2224(
              item.ip,
              item.username,
              item.password,
              item.port
            );
            powerRes = suyhaoService.get_rx_power_by_SW2224(
              item.ip,
              item.username,
              item.password,
              item.port
            );
          } else {
            return [];
          }

          // Chạy API song song
          const [statusData, powerData] = await Promise.all([
            statusRes,
            powerRes,
          ]);

          // Xử lý dữ liệu trả về
          const statusList = Object.values(statusData.data);
          //console.log(powerData.data.RXpower);
          const powerList = JSON.parse(
            powerData.data.RXpower.replace(/'/g, '"')
          );

          return statusList
            .map((data) => {
              const suyhao = powerList.find((e) => e.port === data.port) || {};
              if (
                data.status == "down" ||
                data.status == "Down" ||
                Number(suyhao.rx_power) < Number(suyhao.w_low)
              )
                return {
                  matram: item.matram,
                  switch: item.switch,
                  port: data.port,
                  status: data.status,
                  rx: suyhao.rx_power || "N/A",
                  low: suyhao.w_low || "N/A",
                };
              else {
                return null;
              }
            })
            .filter((item) => item !== null);
        } catch (error) {
          console.error(`Lỗi xử lý thiết bị ${item.ip}:`, error);
          return [];
        }
      };

      // Xử lý tất cả các thiết bị cùng lúc
      const allDevices = await Promise.all(res.data.map(handleDevice));
      listStatus = allDevices.flat();

      // Cập nhật danh sách sau khi lấy xong tất cả dữ liệu
      setLists(listStatus);
      console.log("Cập nhật danh sách thành công:", listStatus);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    // Chạy mỗi 1 tiếng 1 lần
    setInterval(fetchData, 3600 * 1000);
    // Chạy ngay khi trang load
    fetchData();
    // Gọi lại sau 1 phút
    // portService.getdata().then((res) => {
    //   console.log(res.data);
    //   let listStatus = [];
    //   res.data.map(async (item, index) => {
    //     if (item.loai == "V2724G") {
    //       await portService
    //         .get_status_port_by_SW2724(
    //           item.ip,
    //           item.username,
    //           item.password,
    //           item.port
    //         )
    //         .then((ress) => {
    //           console.log(Object.values(ress.data));
    //           suyhaoService
    //             .get_rx_power_by_SW2724(
    //               item.ip,
    //               item.username,
    //               item.password,
    //               item.port
    //             )
    //             .then((suyhao) => {
    //               console.log(
    //                 JSON.parse(suyhao.data.RXpower.replace(/'/g, '"')).filter(
    //                   (e) => e.port == 20
    //                 )
    //               );
    //               Object.values(ress.data).map((data, i) => {
    //                 let suyhaos = JSON.parse(
    //                   suyhao.data.RXpower.replace(/'/g, '"')
    //                 ).filter((e) => e.port == data.port)[0];

    //                 let items = {
    //                   matram: item.matram,
    //                   switch: item.switch,
    //                   port: data.port,
    //                   status: data.status,
    //                   rx: suyhaos.rx_power,
    //                   low: suyhaos.w_low,
    //                 };

    //                 listStatus.push(items);
    //                 setLists([...listStatus]);
    //               });
    //             });
    //         });
    //     } else {
    //       if (item.loai == "OS6450" || item.loai == "OS6400") {
    //         await portService
    //           .get_status_port_by_A6400(
    //             item.ip,
    //             item.username,
    //             item.password,
    //             item.port
    //           )
    //           .then((ress) => {
    //             suyhaoService
    //               .get_rx_power_by_A6400(
    //                 item.ip,
    //                 item.username,
    //                 item.password,
    //                 item.port
    //               )
    //               .then((suyhao) => {
    //                 console.log(
    //                   JSON.parse(suyhao.data.RXpower.replace(/'/g, '"')).filter(
    //                     (e) => e.port == 20
    //                   )
    //                 );
    //                 Object.values(ress.data).map((data, i) => {
    //                   let suyhaos = JSON.parse(
    //                     suyhao.data.RXpower.replace(/'/g, '"')
    //                   ).filter((e) => e.port == data.port)[0];

    //                   let items = {
    //                     matram: item.matram,
    //                     switch: item.switch,
    //                     port: data.port,
    //                     status: data.status,
    //                     rx: suyhaos.rx_power,
    //                     low: suyhaos.w_low,
    //                   };

    //                   listStatus.push(items);
    //                   setLists([...listStatus]);
    //                 });
    //               });
    //           });
    //       } else {
    //         if (item.loai == "V2224G") {
    //           await portService
    //             .get_status_port_by_SW2224(
    //               item.ip,
    //               item.username,
    //               item.password,
    //               item.port
    //             )
    //             .then((ress) => {
    //               console.log(Object.values(ress.data));
    //               suyhaoService
    //                 .get_rx_power_by_SW2224(
    //                   item.ip,
    //                   item.username,
    //                   item.password,
    //                   item.port
    //                 )
    //                 .then((suyhao) => {
    //                   console.log(
    //                     JSON.parse(
    //                       suyhao.data.RXpower.replace(/'/g, '"')
    //                     ).filter((e) => e.port == 20)
    //                   );
    //                   Object.values(ress.data).map((data, i) => {
    //                     let suyhaos = JSON.parse(
    //                       suyhao.data.RXpower.replace(/'/g, '"')
    //                     ).filter((e) => e.port == data.port)[0];

    //                     let items = {
    //                       matram: item.matram,
    //                       switch: item.switch,
    //                       port: data.port,
    //                       status: data.status,
    //                       rx: suyhaos.rx_power,
    //                       low: suyhaos.w_low,
    //                     };

    //                     listStatus.push(items);
    //                     setLists([...listStatus]);
    //                   });
    //                 });
    //             });
    //         }
    //       }
    //     }
    //   });

    //   console.log(listStatus);
    // });
  }, [flag]);
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
  const save = () => {
    console.log(tenthietbi, loaithietbi);
    let thietbi = {
      id: RandomString(6),

      loaithietbi: loaithietbi,
      tenthietbi: tenthietbi,
    };
    console.log(
      listthietbi,
      listthietbi.indexOf((e) => e.tenthietbi == tenthietbi)
    );
    if (
      !listthietbi ||
      listthietbi.findIndex((e) => e.tenthietbi == tenthietbi) == -1
    ) {
    } else {
      toast.error("Tên thiết bị đã tồn tại");
    }
  };
  const getdata = (e) => {
    console.log(e);
    portService.addData(e).then((res) => {
      console.log(res.data);
    });
  };
  const refesh = () => {
    setflag(!flag);
  };
  return (
    <>
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-5 ">
            <div className="col col-md-2">
              <button
                class="btn btn-lg btn-success mx-1 float-right"
                onClick={() => refesh()}
              >
                <i class="fas fa-sync-alt me-2"></i>
                LÀM MỚI CẢNH BÁO
              </button>
            </div>

            <div className="col col-md-1">
              <button
                className="btn btn-lg btn-success mx-1 float-right"
                onClick={() => openModal()}
              >
                {/* <i className="fa fa-plus" aria-hidden="true"></i> */}
                Thêm <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-5">
              <div className="row">
                <div className="col col-md-10">
                  <ImportNhienlieu
                    getdata={getdata}
                    header={[]}
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

          <table className="table mt-3 table-bordered   table-hover ">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Tên Trạm</th>
                <th scope="col">Tên Switch</th>
                <th scope="col">Port</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Suy hao</th>
                <th scope="col">W_low</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists
                  .sort((a, b) => {
                    console.log(lists);
                    // Sắp xếp theo attribute1 (chuỗi) trước
                    const result = a.status.localeCompare(b.status);
                    if (result !== 0) return result;
                    // Nếu attribute1 bằng nhau, sắp xếp theo attribute2 (số)
                    return (
                      -Number(Number(a.low) - Number(a.rx)) +
                      Number(Number(b.low) - Number(b.rx))
                    );
                  })
                  .map((item, index) => {
                    return (
                      item != null && (
                        <tr
                          className={
                            item.status == "down" ||
                            item.status == "Down" ||
                            Number(item.rx) < Number(item.low)
                              ? "alert tr-backgroud "
                              : "alert"
                          }
                          role="alert"
                          key={index}
                        >
                          <td className="text-center">{item.matram}</td>
                          <td className="text-center">{item.switch}</td>
                          <td className="text-center">{item.port}</td>
                          <td className="text-center">{item.status}</td>
                          <td className="text-center">{item.rx}</td>
                          <td className="text-center">{item.low}</td>
                        </tr>
                      )
                    );
                  })}
            </tbody>
          </table>
          <Modal
            show={show}
            onHide={() => setshow(false)}
            dialogClassName="modal-90w modal_show"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                <h3 className="text-center fw-bold">THÊM THIẾT BỊ </h3>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <section id="about" className="about">
                <div className="container" data-aos="fade-up">
                  <div className="row">
                    <div className="col col-md-12 mb-3">
                      <div className="md-4">
                        <label htmlFor="code" className="form-label fw-bold">
                          Tên thiết bị
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="code"
                          placeholder="Tên thiết bị"
                          value={tenthietbi}
                          onChange={(e) => ChangeNameDevice(e)}
                        />
                      </div>
                    </div>
                    <div className="col col-md-12">
                      <label className="form-label fw-bold" htmlFor="rank">
                        Loại thiết bị
                      </label>
                      <select
                        className="form-select "
                        value={loaithietbi}
                        onChange={(e) => ChangeTypeDevice(e)}
                      >
                        <option value="" hidden>
                          Chọn loại thiết bị
                        </option>
                        <option value="accu">ACCU</option>
                        <option value="rec">REC</option>
                        <option value="tunguon">Tủ nguồn</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-lg d-block fs-3 btn-primary p-3"
                onClick={() => save()}
              >
                Thêm
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </main>
    </>
  );
};
export default ListPort;
