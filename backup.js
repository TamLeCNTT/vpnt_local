const { Telnet } = require('telnet-client');  // Sử dụng destructuring
const fs = require('fs');
const path = require('path');

let connection = new Telnet();

let params = {
  host: '10.102.4.252',
  port: 23,
  loginPrompt: 'login:',
  passwordPrompt: 'Password:',
  username: 'admin',
  password: 'Dhtthost@3',
  shellPrompt: />|#\s*$/,
  timeout: 20000, // Tăng thời gian chờ kết nối
  execTimeout: 200000, // Tăng thời gian chờ thực thi lệnh
  sendTimeout: 200000, // Tăng thời gian chờ gửi lệnh
  maxBufferLength: 10000000
};

async function backupConfig() {
    try {
       let conect= await connection.connect(params);
    
       
        // let enableResult = await connection.exec('enable');
        // if (enableResult === undefined) {
        // throw new Error('Enable command returned undefined');
        // }
        // console.log('Enable command result:', enableResult);
        // let helpResult;
        // let versionResult;
        // let ipInterfaceResult;
        //  // Thử lệnh `help`
        //  helpResult = await connection.exec('help');
        //  if (!helpResult) {
        //      throw new Error('Help command returned no response');
        //  }
        //  console.log('Help command result:', helpResult);
         
        //  // Thử lệnh `show version`
        //  versionResult = await connection.exec('show version');
        //  if (!versionResult) {
        //      throw new Error('Show version command returned no response');
        //  }
        //  console.log('Show version command result:', versionResult);
 
        //  // Thử lệnh `show ip interface brief`
        //  ipInterfaceResult = await connection.exec('show ip interface brief');
        //  if (!ipInterfaceResult) {
        //      throw new Error('Show IP interface brief command returned no response');
        //  }
        //  console.log('Show IP interface brief command result:', ipInterfaceResult);
        // await connection.exec('?');
     
        await connection.exec('show interface  module-info ethernet 0/19 ?');
        let showResult = await connection.exec('show interface  module-info ethernet 0/19? ');
       
      
    if (showResult === undefined) {
      throw new Error('Show command returned undefined');
    }
    console.log('Show command result:', showResult);
      const backupFilePath = path.join(__dirname, 'backups', 'olt_backupvft.txt');
     fs.writeFileSync(backupFilePath, showResult);
  
        console.log('Backup completed successfully');
        
    } catch (error) {
        console.error('Error during backup:', error.message);
    console.error('Detailed Error:', error);
    console.error('Connection details:', params);
    console.error('Enable command result:', enableResult);
    console.error('Show command result:', showResult);
        console.error('Error during backup:', error.message);
        console.error('Detailed Error:', error);
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Check if the OLT is reachable.');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('Connection timed out. Check your network settings.');
        }
    } finally {
        connection.end();
    }
  }

backupConfig();
