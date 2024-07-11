import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";

const Tonghop_view = (props) => {
  const [name, setname] = useState("");
  const [soxe, setsoxe] = useState("");
  const [code, setcode] = useState("");
  const [course, setcourse] = useState("");

  const [rank, setrank] = useState("");
  const [teacher, setteacher] = useState("");
  const [show, setshow] = useState(false);

  let navitive = useNavigate();

  const save = (e) => {
    if (!code) toast.error("Vui lòng nhập mã học viên");
    else {
      if (!name) toast.error("Vui lòng tên học viên");
      else if (!course) toast.error("Vui lòng nhập khoá học");
      else if (!rank) toast.error("Vui lòng nhập hạng đào tạo");
      else if (!teacher) toast.error("Vui lòng chọn giáo viên");
      else {
        let student = {
          code: code,
          name: name,
          course: course,
          rank: rank,
          teacherId: teacher,
          distance: 0,
          hours: "",
          nightTime: "",
        };
        console.log(student);
      }
    }
  };
  const openModal = () => {
    let student = {};
    console.log();
    setcode(student.code);
    setcourse(student.course);
    setname(student.name);
    setrank(student.rank);
    setteacher(student.teacherId);

    setshow(true);
  };
  const changename = (e) => {
    setname(e.target.value);
    console.log(e.target.value);
  };
  const changesoxe = (e) => {
    setsoxe(e.target.value);
  };
  const changecode = (e) => {
    setcode(e.target.value);
    console.log(e.target.value);
  };
  const changcourse = (e) => {
    setcourse(e.target.value);
  };
  const changerank = (e) => {
    setrank(e.target.value);
    console.log(e.target.value);
  };
  const changeteacher = (e) => {
    setteacher(e.target.value);
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
        <span aria-hidden="true">
          <i className="fa fa-edit"></i>
        </span>
      </a>

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
            <h3 className="text-center">THÔNG TIN CHI TIẾT </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section id="about" className="about">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className="col col-md-6">
                  <div className="md-4">
                    <label htmlFor="code" className="form-label">
                      Mã học viên
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      onChange={(e) => changecode(e)}
                      value={code}
                      placeholder="Mã học viên"
                    />
                  </div>
                </div>
                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label" htmlFor="name">
                      Tên Học Viên
                    </label>
                    <input
                      className="form-control"
                      id="teacher"
                      name="name"
                      onChange={(e) => changename(e)}
                      value={name}
                      type="text"
                      placeholder="Tên học viên"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col col-md-6">
                  <div className="md-4">
                    <label htmlFor="course" className="form-label">
                      Khoá Học
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="course"
                      onChange={(e) => changcourse(e)}
                      value={course}
                      placeholder="Khoá học"
                    />
                  </div>
                </div>
                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label" htmlFor="rank">
                      Hạng đào tạo
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => changerank(e)}
                      value={rank}
                    >
                      <option value="" hidden>
                        Chọn hạng đào tạo
                      </option>
                      <option value="B11">B11</option>
                      <option value="B2">B2</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="Fc">Fc</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col col-md-6">
                  <div className="md-4">
                    <label htmlFor="course" className="form-label">
                      Giáo viên
                    </label>
                    <select
                      name=""
                      id=""
                      className="form-select"
                      onChange={(e) => changeteacher(e)}
                      value={teacher}
                    >
                      <option value="" hidden>
                        Chọn giáo viên
                      </option>
                    </select>
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
            Thêm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Tonghop_view;
