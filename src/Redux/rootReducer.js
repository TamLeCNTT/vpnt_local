const initState = {
  user: localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : {},
  sanpham: [],
  cabin: [],
  diachidoi: null,
  sanphamchon: null,
  danhsachdiachi: null,
  show: true,
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: {}, sanpham: [] };

    case "ADDCART":
      return { ...state, sanpham: action.payload };
    case "ADDCABIN":
      return { ...state, cabin: action.payload };
    case "MUA":
      console.log(action.payload);
      return { ...state, sanphamchon: action.payload };
    case "DOIDIACHI":
      return { ...state, diachidoi: action.payload };
    case "DANHSACHDIACHI":
      console.log(action.payload);
      return { ...state, danhsachdiachi: action.payload };
    case "SHOW":
      console.log(action.payload);
      return { ...state, show: action.payload };
    default:
      return state;
  }
};
export default rootReducer;
