import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const SCHEMA = "nhienlieu";
const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000/nhienlieu/";
class nhienlieuService {
  getAll() {
    const url = `${SCHEMA}.json`;
    return axiosClient.get(url);
  }
    update(data) {
     
    const url = `/${SCHEMA}/${data.id}.json`;
    return axiosClient.patch(url, data.data);
  }
  getbyId(id) {
    
  const url = `/${SCHEMA}/${id}.json`;
  return axiosClient.get(url);
}
  delete(data) {
   
  const url = `/${SCHEMA}/${data.id}.json`;
  return axiosClient.delete(url, data);
}

getdata() {
  console.log(EMPLOYEE_API_BASE_URL+"get_data")
  return axios.get(EMPLOYEE_API_BASE_URL+"get_data")
}

addData(liurlst) {
  console.log(EMPLOYEE_API_BASE_URL+"insert_data",liurlst)
  return axios.post(EMPLOYEE_API_BASE_URL+"insert_data",liurlst)
}
UpdateData(data) {
  return axios.post(EMPLOYEE_API_BASE_URL+"update_data",data)
}
deletedata(id) {
  return axios.get(EMPLOYEE_API_BASE_URL+"delete?id="+id)
}
}

export default new nhienlieuService();