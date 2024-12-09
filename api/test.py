import mysql.connector
from mysql.connector import Error


def create_database_and_table():
    try:
        # Kết nối tới MySQL server
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Dhtthost@3",
            auth_plugin='mysql_native_password'
        )
        if conn.is_connected():
            print("Kết nối thành công tới MySQL server")

            # Tạo một đối tượng cursor
            cursor = conn.cursor()

            # Tạo cơ sở dữ liệu nếu chưa có
            cursor.execute("CREATE DATABASE IF NOT EXISTS vnpt")
            print("Cơ sở dữ liệu 'mydatabase' đã được tạo hoặc đã tồn tại.")

            # Kết nối tới cơ sở dữ liệu mới tạo
            conn.database = 'vnpt'

            # Tạo bảng với các cột: id, diachi, username, password, tenthietbi, loai, port
            # cursor.execute("""
            # CREATE TABLE IF NOT EXISTS suyhao (
            #     id VARCHAR(25) PRIMARY KEY,
            #     diachi VARCHAR(255),
            #     username VARCHAR(255),
            #     password VARCHAR(255),
            #     tenthietbi VARCHAR(255),
            #       tenthuongmai VARCHAR(255),
            #     loai VARCHAR(255),
            #     port  VARCHAR(255),
            #     ring  VARCHAR(255)
            # )
            # """)

            # cursor.execute("""
            # CREATE TABLE IF NOT EXISTS ring (
            #      id INT AUTO_INCREMENT PRIMARY KEY,
            #     ten VARCHAR(255),
            #     donvi VARCHAR(255)
            # )
            # """)
            cursor.execute("""
                    CREATE TABLE IF NOT EXISTS port (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                        matram VARCHAR(255),
                        switch	 VARCHAR(255),
                        port	 VARCHAR(255),
                        username VARCHAR(255),
                        password VARCHAR(255),
                        ip VARCHAR(255),
                        loai VARCHAR(255)
                    )
                    """)
            # cursor.execute("""
            # CREATE TABLE IF NOT EXISTS binhquan_suyhao (
            #     id INT AUTO_INCREMENT PRIMARY KEY,
            #     KT1A INT,
            #     KT1B INT,
            #     KT2 INT,
            #     KT3 INT,
            #     KT4 INT,
            #     TongTT1 INT,
            #     KT5 INT,
            #     KT6 INT,
            #     KT7 INT,
            #     KT8 INT,
            #     KT9 INT,
            #     TongTT2 INT,
            #     KT15 INT,
            #     KT16 INT,
            #     KT17 INT,
            #     KT18 INT,
            #     KT19 INT,
            #     TongTT3 INT,
            #     KT10 INT,
            #     KT10A INT,
            #     KT11 INT,
            #     KT12 INT,
            #     KT13 INT,
            #     TongTT4 INT,
            #     HGI INT,
            #     ngay VARCHAR(255)
            # )
            # """)
            # cursor.execute("""
            # CREATE TABLE IF NOT EXISTS binhquan_suyhao_vb8362 (
            #     id INT AUTO_INCREMENT PRIMARY KEY,
            #     KT1A INT,
            #     KT1B INT,
            #     KT2 INT,
            #     KT3 INT,
            #     KT4 INT,
            #     TongTT1 INT,
            #     KT5 INT,
            #     KT6 INT,
            #     KT7 INT,
            #     KT8 INT,
            #     KT9 INT,
            #     TongTT2 INT,
            #     KT15 INT,
            #     KT16 INT,
            #     KT17 INT,
            #     KT18 INT,
            #     KT19 INT,
            #     TongTT3 INT,
            #     KT10 INT,
            #     KT10A INT,
            #     KT11 INT,
            #     KT12 INT,
            #     KT13 INT,
            #     TongTT4 INT,
            #     HGI INT,
            #     ngay VARCHAR(255)
            # )
            # """)

            # cursor.execute("""
            #         CREATE TABLE IF NOT EXISTS thongkesolansuyhao (
            #            id INT AUTO_INCREMENT PRIMARY KEY,
            #             nguoidung VARCHAR(255),
            #             ngay	 VARCHAR(255),
            #             nhanvien	 VARCHAR(255),
            #             tkt VARCHAR(255),
            #             ttvt VARCHAR(255)
            #         )
            #         """)
            # cursor.execute("""
            # CREATE TABLE IF NOT EXISTS tuyen_kt (
            #     id VARCHAR(255) PRIMARY KEY,
            #     tenhethong VARCHAR(255),
            #     ip	 VARCHAR(255),
            #     pon	 VARCHAR(255),
            #      tuyenkt VARCHAR(255),
            #       trungtamvienthong VARCHAR(255)
            # )
            # """)
        #     cursor.execute("""
        #     CREATE TABLE IF NOT EXISTS nhienlieu (
        #    tentram VARCHAR(255) PRIMARY KEY,
        #         tencsht VARCHAR(255) ,
               
        #         nhienlieu	 VARCHAR(255),
        #     dinhmuc	 VARCHAR(255)

        #     )
        #     """)
              # cursor.execute("""
            # CREATE TABLE IF NOT EXISTS tuyen_kt_tt (
            #     tuyenkt VARCHAR(255) PRIMARY KEY,
            #     ttvt VARCHAR(255),
            #     sl	 VARCHAR(255),
            # matt	 VARCHAR(255),
            #                tennv VARCHAR(255)

            # )
            # """)
            print("Bảng 'mytable' đã được tạo hoặc đã tồn tại.")

    except Error as e:
        print("Lỗi khi kết nối hoặc tạo bảng:", e)

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


# Gọi hàm để tạo cơ sở dữ liệu và bảng
create_database_and_table()
