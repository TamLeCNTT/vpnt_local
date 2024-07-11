


    import { set, ref, onValue, remove } from "firebase/database";
    import axios from "axios";
    import axiosClient from "./Main";
    const SCHEMA = "user";
    class userService {
      getAll() {
        const url = `${SCHEMA}.json`;
        return axiosClient.get(url);
        }
        getbyday(date) {
            const url = `${SCHEMA}/${date}.json`;
            return axiosClient.get(url);
          }
    update(data) {
          console.log(data)
        const url = `/${SCHEMA}/${data.id}.json`;
        return axiosClient.patch(url, data.data);
      }
      delete(data) {
      
      const url = `/${SCHEMA}/${data.id}.json`;
      return axiosClient.delete(url, data);
    
    }
    // add(user) {
    //     return axios.post(EMPLOYEE_API_BASE_URL + '/add', user);
    // }
    // login(user) {
    //     return axios.post(EMPLOYEE_API_BASE_URL + '/login', user);
    // }
    // edit(user) {
    //     return axios.put(EMPLOYEE_API_BASE_URL + '/edit', user);
    // }

    // delete(id) {
    //     return axios.delete(EMPLOYEE_API_BASE_URL + 'delete/' + id);
    // }

}

export default new userService();