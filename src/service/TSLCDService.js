import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const SCHEMA = "tslcd";
class TSLCDService {
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
}

export default new TSLCDService();