import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Pagination.scss";
const Paginations = (props) => {
  const [choose, setchoose] = useState(0);
  const [BD, setDB] = useState(0);
  const [TongST, setTongST] = useState(0);
  const [SoHT, SetSoHT] = useState(0);
  const [page, setPage] = useState([]);
  const [list, setList] = useState([]);
  const [lists, setLists] = useState([]);
  let flag = 0;
  const changechoose = (e) => {
    flag = 0;

    let page = choose;
    if (e === "+") {
      if (choose < TongST - 1) {
        setchoose(choose + 1);
        page = page + 1;
      }
    } else if (e === "-") {
      if (choose > 0) {
        setchoose(choose - 1);
        page--;
      }
    } else {
      setchoose(e);
      page = e;
    }

    let lists = props.list.slice(SoHT * page, (page + 1) * SoHT);
    props.getlist(lists);
    // console.log(page)
  };
  const show = (tongst, present) => {
    let list = [];
    if (flag == 0) {
      console.log(page);
      page.map((item, index) => {
        if (TongST > 8) {
          if (index >= present - 2 && index <= present + 2) {
            console.log(index);
            list.push(
              <a
                key={index}
                href="#"
                value={item}
                onClick={() => changechoose(item)}
                className={choose == item ? "active" : ""}
              >
                {item + 1}
              </a>
            );
          }

          if (tongst > 8 && index == present + 2)
            list.push(
              <a key={index} href="#">
                .....
              </a>
            );
          if (index <= tongst && index > tongst - 5)
            list.push(
              <a
                key={index}
                href="#"
                value={item}
                onClick={() => changechoose(item)}
                className={choose == item ? "active" : ""}
              >
                {item + 1}
              </a>
            );
        }
      });
      flag = 1;
    }

    return new Set(list);
  };
  useEffect(() => {
    setList(props.list);
    SetSoHT(props.itemsPerPage);

    setPage([
      ...Array(Math.ceil(props.list.length / props.itemsPerPage)).keys(),
    ]);
    setTongST(Math.ceil(props.list.length / props.itemsPerPage));

    let lists = props.list.slice(SoHT * choose, (choose + 1) * SoHT);
    if (lists.length == 0) {
      setchoose(0);
      lists = props.list.slice(SoHT * 0, 1 * SoHT);
    }
    props.getlist(lists);
  }, [props.list]);
  return (
    <>
      {page.length > 0 && (
        <div id="pagination" className="pagination">
          <a
            href="#"
            onClick={() => changechoose("-")}
            style={{
              pointerEvents: choose == 0 ? "none" : "",
              backgroundColor: choose == 0 ? "grey" : "",
            }}
          >
            &laquo;
          </a>
          {/* {show(TongST, choose)} */}
          {page.map((item, index) => {
            return (index >= choose - 2 && index <= choose + 2) ||
              (index <= TongST && index > TongST - 5) ? (
              <a
                key={index}
                href="#"
                value={item}
                onClick={() => changechoose(item)}
                className={choose == item ? "active" : ""}
              >
                {item + 1}
              </a>
            ) : (
              index == choose + 3 && (
                <a key={index} href="#">
                  ...
                </a>
              )
            );
          })}

          <a
            href="#"
            onClick={() => changechoose("+")}
            style={{
              pointerEvents: choose == TongST - 1 ? "none" : "",
              backgroundColor: choose == TongST - 1 ? "grey" : "",
            }}
          >
            &raquo;
          </a>
        </div>
      )}
    </>
  );
};
export default Paginations;
