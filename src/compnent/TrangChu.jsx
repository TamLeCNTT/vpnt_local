import React, { useEffect } from "react";
import Header from "../Layout/Header";
import vnptImage from "../Assets/img/TOA NHA VNPT HGI_SKYCAM.jpg"; // Đảm bảo bạn đã có hình ảnh trong thư mục assets
import mainEService from "../service/mainEService";

function Trangchu() {
  useEffect(()=>{
    mainEService.getDatainFile("timebackup.txt").then(res=>{
      console.log(res.data.data)
      if (res.data.data){
     
        mainEService.autorun(res.data.data).then(
          res=>{
     
      
          }
        )
      }
     
    }).catch(err=>{
      
    })
  },[])
  return (
    <div className="home">
      <Header />
      {/* Header */}

      {/* Banner */}
      <section className="banner">
        <img
          src={vnptImage}
          alt="Viễn Thông Hậu Giang"
          className="banner-img"
        />
        {/* <div className="banner-text">
          <h2>Chào mừng bạn đến </h2>
          <h2> Viễn Thông Hậu Giang</h2>
          <p>Uy tín, chất lượng và đổi mới</p>
        </div> */}
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <h2 className="section-title">Về chúng tôi</h2>
        <p className="section-content">
          Viễn Thông Hậu Giang là đơn vị hàng đầu trong lĩnh vực viễn thông, cam
          kết mang lại những dịch vụ chất lượng cao với sứ mệnh kết nối và đổi
          mới cho cộng đồng.
        </p>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <p>
            Bản quyền &copy; 2024 Trung tâm ĐHTT - Viễn Thông Hậu Giang. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Trangchu;
