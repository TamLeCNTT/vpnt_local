import { useEffect, useState } from "react";
import io from "socket.io-client";


const RealTime_Telnet = () => {
  
  const socket = io("http://127.0.0.1:5000");
  const [logs, setLogs] = useState([]);
  const [command, setCommand] = useState("");
useEffect(() => {
  socket.on("command_response", (data) => {
    setLogs((prev) => [...prev, data.response]);
  });

  return () => socket.off("command_response");
}, []);

const sendCommand = () => {
  if (command.trim() !== "") {
    socket.emit("send_command", { command });
    setLogs((prev) => [...prev, `> ${command}`]);
    setCommand("");
  }
};

return (
  <div className="container p-3 text-light" style={{ backgroundColor: "black" }}>
    <h5>🟢 Kết nối OLT</h5>
    <div className="border p-3" style={{ height: "300px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
      {logs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
    <input 
      type="text" 
      className="form-control mt-2"
      value={command}
      onChange={(e) => setCommand(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendCommand()}
      placeholder="Nhập lệnh..."
    />
    <button className="btn btn-warning mt-2" onClick={sendCommand}>Gửi</button>
  </div>
);


 
};
export default RealTime_Telnet;
