import React from 'react';
import axios from 'axios';

function DownloadLog(props) {
  const handleDownload = () => {
    axios({
      url: 'http://localhost:5000/download',
      method: 'GET',
      responseType: 'blob', // Quan trọng để nhận dữ liệu dạng blob
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', props.name+'.txt'); // Tên file tải về
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error('Lỗi khi tải file', error);
      });
  };
  
  return <button onClick={handleDownload} className="btn btn-lg btn-success p-3 text-uppercase btn-block fs-1 ms-5 ">Tải log</button>
}

export default DownloadLog;