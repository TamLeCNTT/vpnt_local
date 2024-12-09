@app.route('/tram_olt/kich_onu_dasan_manys', methods=['GET'])
def get_active_dasan_manys():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slid = request.args.get('slid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    vlan_ims = request.args.get('vlanims')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        tn.read_until(b"login:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")

        with open("output_many.txt", "wb") as f:

            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"conf t",
                    f"gpon",
                    f"gpon-olt {port}",
                    f"no onu {onu}",
                    f"end",
                    f"conf t",
                    f"gpon",
                    f"gpon-olt  {port}",
                    f"onu add {onu} registration-id {slid}{onu}",
                    f"onu-profile {onu} HSI_MYTV_VOIP_GNMS_ONU",
                    f"end",
                    f"write memory"
                ]

                # # Send each command and write the output to the file

                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")
                    tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")
                # #Add new lines for better readability in the output file

                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_huawei_mini_manys', methods=['GET'])
def get_active_huawei_mini_manys():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slid = request.args.get('slid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    vlan_ims = request.args.get('vlanims')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    checknet = request.args.get('checknet')    
    checkmytv = request.args.get('checkmytv')
    checkvoip= request.args.get('checkvoip')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b"config\n")
        output = tn.read_until(b"#")

        with open("output_many.txt", "wb") as f:

            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"interface gpon 0/{slot}",
                    f"ont delete {port} {onu}",
                    f"ont add {port} {onu} password-auth {slid}{onu} always-on omci ont-lineprofile-name HSI_IPTV_VOIP_VPN ont-srvprofile-name ONT\n\n",
                    f"quit",

                 
                    f"service-port vlan 4001 gpon 0/{slot}/{port} ont {onu} gemport 5 multi-service user-vlan 4001 inbound traffic-table name GNMS outbound traffic-table name GNMS",
                   
                    f"btv",
                    f"igmp user add smart-vlan {vlan_mytv}\n\n",

                    f"multicast-vlan 99\n\n",
                    f"igmp multicast-vlan member smart-vlan {vlan_mytv}\n\n",
                    f"quit",
                  
                    f"service-port vlan 0 gpon 0/1/01 ont 01 gemport 4 multi-service user-vlan 15 inbound traffic-table name VPN outbound traffic-table name VPN",


                ]

                # tn.write(
                #     f"undo service-port port 0/{slot}/{port} ont {onu}\n".encode('ascii'))
                # output = tn.read_until(b":")
                # f.write(output)
                # tn.write(b"\n")
                # output = tn.read_until(b"y/n)[n]:")
                # f.write(output)
                # tn.write(b"y\n")
                # output = tn.read_until(b"#")
                # f.write(output)

                # f.write(b"config\n")
                # f.write(
                #     f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
                # f.write(b"y\n")

                # # Send each command and write the output to the file
                if (checknet==True):
                 
                   commands.insert(4,      f"service-port vlan {vlan_net} gpon 0/{slot}/{port} ont {onu} gemport 1 multi-service user-vlan 11 inbound traffic-table name HSI outbound traffic-table name HSI")
                if (checkmytv==True and checknet==True):
                    commands.insert(6,   f"service-port vlan {vlan_mytv} gpon 0/{slot}/{port} ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down")
                if (checkmytv==True and checknet!=True):
                    commands.insert(5,   f"service-port vlan {vlan_mytv} gpon 0/{slot}/{port} ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down")
                if (checkvoip==True and checkmytv==True and checknet==True):
                    commands.insert(12,    f"service-port vlan {vlan_ims} gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                else:
                    if (checkvoip==True and (checkmytv==True or checknet==True)):
                        commands.insert(11,     f"service-port vlan {vlan_ims} gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                if (checkvoip==True and (checkmytv!=True and checknet!=True)):
                    commands.insert(10,    f"service-port vlan {vlan_ims} gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                for command in commands:
                    # tn.write(command.encode('ascii') + b"\n")

                    # output = b""
                    # while not output.endswith(b"#"):
                    #     output += tn.read_some()

                    # f.write(output)
                  
                    f.write(command.encode('ascii') + b"\n")
                    f.write(b"\n")

                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

@app.route('/tram_olt/kich_onu_huawei_manys', methods=['GET'])
def get_active_huawei_manys():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slid = request.args.get('slid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    vlan_ims = request.args.get('vlanims')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    checknet = request.args.get('checknet')    
    checkmytv = request.args.get('checkmytv')
    checkvoip= request.args.get('checkvoip')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")

        with open("output_many.txt", "wb") as f:

            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"interface gpon 0/{slot}",
                    f"ont delete {port} {onu}",
                    f"ont add {port} {onu} password-auth {slid}{onu} always-on omci ont-lineprofile-name HSI_IPTV_VOIP_VPN ont-srvprofile-name ONT_020\n\n",
                    f"quit"
                ]
                if (checknet==True):
                    commands.append( f"service-port vlan {vlan_net} gpon 0/{slot}/{port} ont {onu} gemport 1 multi-service user-vlan 11 inbound traffic-table name HSI outbound traffic-table name HSI"
                  )
                if (checkmytv==True):
                    commands.append(f"service-port vlan {vlan_mytv} gpon 0/{slot}/{port}  ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down")
                if (checkvoip==True):
                    commands.append(f"service-port vlan {vlan_ims}  gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                
                commands.append( f"service-port vlan 4001 gpon 0/{slot}/{port} ont {onu} gemport 5 multi-service user-vlan 4001 inbound traffic-table name GNMS outbound traffic-table name GNMS"
                   )
                commands.append( f"quit")
                tn.write(b"config\n")
                tn.read_until(b"#")
                tn.write(
                    f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
                tn.read_until(b"]:")
                tn.write(b"y\n")
                tn.read_until(b"#")
                f.write(b"config\n")
                f.write(
                    f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
                f.write(b"y\n")

                # # Send each command and write the output to the file

                for command in commands:
                    # tn.write(command.encode('ascii') + b"\n")

                    # tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")

                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

@app.route('/tram_olt/kich_onu_zte_mini_manys', methods=['GET'])
def get_active_zte_mini_manys():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slid = request.args.get('slid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    vlan_ims = request.args.get('vlanims')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    checknet = request.args.get('checknet')    
    checkmytv = request.args.get('checkmytv')
    checkvoip= request.args.get('checkvoip')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        with open("output_many.txt", "wb") as f:

            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure terminal",
                    f"interface gpon_olt-1/3/{port}",
                    f"no onu {onu}",
                    f"end",
                    f"configure terminal",
                    f"interface gpon_olt-1/3/{port}",
                    f"onu {onu} type GW040-H pw {slid}{onu}",
                    f"exit",
                    f"interface gpon_onu-1/3/{port}:{onu}",
                    f"vport-mode manual",
                    f"tcont 1 name HSI profile T4_600M",
                    f"tcont 2 name IPTV profile T2_512K",
                    f"tcont 3 name VOIP profile T3_10M",
                    f"gemport 3 name VOIP tcont 3",
                    f"gemport 1 name HSI tcont 1",
                    f"gemport 2 name IPTV tcont 2",
                    f"tcont 6 name onu profile T3_10M",
                    f"gemport 6 name onu tcont 6",
                    f"vport 1 map-type vlan",
                    f"vport-map 1 6 vlan 4001",
                    f"vport 1 map-type vlan",
                    f"vport-map 1 1 vlan 11",
                    f"vport-map 1 2 vlan 12",
                    f"vport-map 1 3 vlan 13",
                    f"exit",
                    f"interface vport-1/3/{port}.{onu}:1",
                   
                   
                   
                    f"service-port 6 user-vlan 4000 vlan 4001",
                    f"exit",
                    f"pon-onu-mng gpon_onu-1/3/{port}:{onu}",
                    f"dhcp-ip ethuni eth_0/4 from-internet",
                    f"service 6 gemport 6 vlan 4000",
                    f"mvlan 12",
                    f"mvlan tag eth_0/4 strip ",
                    f"service 1 gemport 1 vlan 11",
                    f"service 2 gemport 2 vlan 12",
                    f"service 3 gemport 3 vlan 13",
                    f"voip protocol sip",
                    f"voip-ip ipv4 mode dhcp vlan-profile VOIP host 2",
                    f"wan-ip 1 ipv4 mode pppoe username ftthttbang_hh password vnn123456 vlan-profile HSI host 1",
                    f"wan 1 service internet host 1",
                    f"vlan port eth_0/4 mode tag vlan 12",
                    f"exit",
                    f"igmp mvlan 99",
                    f"receive-port vport-1/3/{port}.{onu}:1",
                    f"end"

                ]
                if (checknet==True):
                 
                   commands.insert(26,    f"service-port 1 user-vlan 11 vlan {vlan_net}")
                if (checkmytv==True and checknet==True):
                    commands.insert(27,   f"service-port 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkmytv==True and checknet!=True):
                    commands.insert(26,   f"service-port 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkvoip==True and checkmytv==True and checknet==True):
                    commands.insert(28,   f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                else:
                    if (checkvoip==True and (checkmytv==True or checknet==True)):
                        commands.insert(27,    f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                if (checkvoip==True and (checkmytv!=True and checknet!=True)):
                    commands.insert(26,    f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                # # Send each command and write the output to the file
                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")
                    tn.read_until(b"#")

                    f.write(command.encode('ascii') + b"\n")
                # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_zte_manyS', methods=['GET'])
def get_active_zte_manyS():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slid = request.args.get('slid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    checknet = request.args.get('checknet')    
    checkmytv = request.args.get('checkmytv')
    checkvoip= request.args.get('checkvoip')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        with open("output_many.txt", "wb") as f:
            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure terminal",
                    f"interface gpon-olt_1/{slot}/{port}",
                    f"no onu {onu}",
                    f"end",
                    f"configure t",
                    f"interface gpon-olt_1/{slot}/{port}",
                    f"onu {onu} type iGate-GW020 pw {slid}{onu}",
                    f"end",
                    f"configure t",
                    f"interface gpon-onu_1/{slot}/{port}:{onu}",
                    f"sn-bind disable",
                    f"tcont 1 name HSI profile T5_600M",
                    f"tcont 2 name IPTV profile T2_512K",
                    f"gemport 1 name HSI tcont 1",
                    f"gemport 1 traffic-limit upstream G_600M downstream G_600M",
                    f"switchport mode hybrid vport 1",
                    f"gemport 2 name IPTV tcont 2",
                    f"gemport 2 traffic-limit upstream G_IPTV downstream G_18M",
                    f"switchport mode hybrid vport 2",
                  
                   
                    f"port-identification format VNPT vport 1",
                    f"pppoe-intermediate-agent enable vport 1",
                    f"pppoe-intermediate-agent trust true replace vport 1",
                    f"tcont 6 name ONT profile T4_100M",
                    f"gemport 6 name ONT tcont 6",
                    f"gemport 6 traffic-limit upstream G_24M downstream G_24M",
                    f"switchport mode hybrid vport 6",
                    f"service-port 6 vport 6 user-vlan 4000 vlan 4001",
                    f"end",
                    f"configure t",
                    f"pon-onu-mng gpon-onu_1/{slot}/{port}:{onu}",
                    f"service 1 gemport 1 vlan 11",
                    f"service 2 gemport 2 vlan 12",
                    f"service 6 gemport 6 vlan 4000",
                    f"mvlan 12",
                    f"wan-ip 1 mode pppoe vlan-profile HSI_PPPOE host 1",
                    f"wan 1 service internet host 1",
                    f"end",
                    f"configure t",
                    f"igmp mvlan 99 receive-port gpon-onu_1/{slot}/{port}:{onu} vport 2",
                    f"end"

                ]
                if (checknet==True):
                 
                   commands.insert(19,    f"service-port 1 vport 1 user-vlan 11 vlan {vlan_net}")
                if (checkmytv==True and checknet==True):
                    commands.insert(20,  f"service-port 2 vport 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkmytv==True and checknet!=True):
                    commands.insert(19,  f"service-port 2 vport 2 user-vlan 12 vlan {vlan_mytv}")
                              # # Send each command and write the output to the file
                # # Send each command and write the output to the file
                for command in commands:
                    # tn.write(command.encode('ascii') + b"\n")
                    # tn.read_until(b"#")

                    f.write(command.encode('ascii') + b"\n")
                # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")




@app.route('/tram_olt/kich_onu_alu_manys', methods=['GET'])
def get_active_alu_manys():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slid = request.args.get('slid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    checknet = request.args.get('checknet')    
    checkmytv = request.args.get('checkmytv')
    checkvoip= request.args.get('checkvoip')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        with open("output_many.txt", "wb") as f:
            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure equipment ont interface 1/1/{slot}/{port}/{onu} admin-state down",
                    f"configure equipment ont no interface 1/1/{slot}/{port}/{onu}",
                    f"exit all",
                    f"configure equipment ont interface 1/1/{slot}/{port}/{onu} sw-ver-pland disabled sernum ALCL:00000000 subslocid {slid}{onu} sw-dnload-version disabled plnd-var SIP enable-aes enable voip-allowed enable",
                    f"configure equipment ont interface 1/1/{slot}/{port}/{onu} admin-state up",
                    f"configure equipment ont slot 1/1/{slot}/{port}/{onu}/14 planned-card-type veip plndnumdataports 1 plndnumvoiceports 0 port-type uni admin-state up",
                    f"configure interface port uni:1/1/{slot}/{port}/{onu}/14/1 admin-up",
                    f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 max-unicast-mac 10",
                    f"exit all",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 queue 0 shaper-profile name:600M_HSI_Down",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 upstream-queue 0 bandwidth-profile name:600M_HSI_Up bandwidth-sharing uni-sharing",
                  
                    f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 4000 tag single-tagged network-vlan 4001 vlan-scope local",
                    f"exit all",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 queue 4 shaper-profile name:12M_IPTV_Down",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 upstream-queue 4 bandwidth-profile name:18M_IPTV_Up bandwidth-sharing uni-sharing",

                    f"configure igmp channel vlan:1/1/{slot}/{port}/{onu}/14/1:12 max-num-group 254",
                    f"exit all",

                ]
            
                if (checknet==True):
                 
                   commands.insert(11,  f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 11 tag single-tagged network-vlan {vlan_net} vlan-scope local")
                if (checkmytv==True and checknet==True):
                    commands.insert(16, f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 12 tag single-tagged network-vlan {vlan_mytv} vlan-scope local")
                if (checkmytv==True and checknet!=True):
                    commands.insert(15, f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 12 tag single-tagged network-vlan {vlan_mytv} vlan-scope local")
                              # # Send each command and write the output to the file
                for command in commands:
                    # tn.write(command.encode('ascii') + b"\n")
                    # tn.read_until(b"#")

                    f.write(command.encode('ascii') + b"\n")
                # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

 # try:
    #     # Kết nối Telnet
    #     tn = telnetlib.Telnet(address_ip)

    #     # Đăng nhập
    #     tn.read_until(b"login: ")
    #     tn.write(user.encode('ascii') + b"\n")
    #     if password:
    #         tn.read_until(b"assword: ")
    #         tn.write(password.encode('ascii') + b"\n")

    #     # Gửi lệnh đến switch để lấy thông tin transceiver
    #     tn.read_until(b"#")
    #     with open("outputDelete.txt", "wb") as f:

    #         for onu in range(int(onustart), int(onuend) + 1):
    #             if (onu < 10):
    #                 onu = "0"+str(onu)
    #             commands = [
    #                 f"configure equipment ont interface 1/1/" +
    #                 str(slot) + "/" + str(port) + "/" +
    #                 str(onu) + " admin-state down",
    #                 f"configure equipment ont no interface  1/1/" +
    #                 str(slot) + "/" + str(port) + "/" + str(onu),
    #                 f"exit all"

    #             ]

    #             # # Send each command and write the output to the file
    #             for command in commands:
    #                     # tn.write(command.encode('ascii') + b"\n")
    #                     # output = tn.read_until(b"#")
    #                 # # Add new lines for better readability in the output file

    #                     f.write(command.encode('ascii') + b"\n")
    #         # # Add new lines for better readability in the output file
    #             f.write(b"\n\n")

    #     tn.close()

    #     log_message = f"kết nối ok"
    #     return jsonify({'status': "ok"})
    # except Exception as e:
    #     log_message = f"kết nối thất bại: {e}"
    #     return jsonify({'error': str(e)})
    # finally:
    #     # Ghi log vào file log
    #     log_file_path = os.path.join(full_path, "log.txt")
    #     with open(log_file_path, 'a', encoding='utf-8') as log_file:
    #         log_file.write(f"{datetime.now()}: {log_message}\n")