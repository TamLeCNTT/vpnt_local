
import axios from "axios";

const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000/dokiem/";

class DoKiemService {

   

    
    getStatus(ip) {
        console.log(EMPLOYEE_API_BASE_URL + "status?ip=" + ip)
        return axios.get(EMPLOYEE_API_BASE_URL + "status?ip=" + ip)
    }
   

}

export default new DoKiemService();