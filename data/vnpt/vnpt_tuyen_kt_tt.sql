-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: vnpt
-- ------------------------------------------------------
-- Server version	9.0.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tuyen_kt_tt`
--

DROP TABLE IF EXISTS `tuyen_kt_tt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tuyen_kt_tt` (
  `tuyenkt` varchar(255) NOT NULL,
  `ttvt` varchar(255) DEFAULT NULL,
  `sl` varchar(255) DEFAULT NULL,
  `matt` varchar(255) DEFAULT NULL,
  `tennv` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tuyenkt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tuyen_kt_tt`
--

LOCK TABLES `tuyen_kt_tt` WRITE;
/*!40000 ALTER TABLE `tuyen_kt_tt` DISABLE KEYS */;
INSERT INTO `tuyen_kt_tt` VALUES ('KT10','Trung tâm Viễn thông 4','1388','ttvt4','Mai Thanh Bình'),('KT10A','Trung tâm Viễn thông 4','2383','ttvt4','Phan Đức Sơn'),('KT11','Trung tâm Viễn thông 4','5217','ttvt4','Huỳnh Tấn Phước'),('KT12','Trung tâm Viễn thông 4','1740','ttvt4','Nguyễn Hữu Lực'),('KT13','Trung tâm Viễn thông 4','2198','ttvt4','Võ Đông Giang'),('KT15','Trung tâm Viễn thông 3','2642','ttvt3','Bùi Vĩnh Phúc'),('KT16','Trung tâm Viễn thông 3','2384','ttvt3','Nguyễn Văn Bằng'),('KT17','Trung tâm Viễn thông 3','2888','ttvt3','Ngô Đức Toàn'),('KT18','Trung tâm Viễn thông 3','2132','ttvt3','Nguyễn Quốc Anh'),('KT19','Trung tâm Viễn thông 3','2899','ttvt3','Mai Trúc Phương'),('KT1A','Trung tâm Viễn thông 1','1242','ttvt1','Huỳnh Thanh Tú'),('KT1B','Trung tâm Viễn thông 1','1831','ttvt1','Huỳnh Thanh Dân'),('KT2','Trung tâm Viễn thông 1','2382','ttvt1','Nguyễn Minh Triều'),('KT3','Trung tâm Viễn thông 1','2971','ttvt1','Hoàng Thanh Phương'),('KT4','Trung tâm Viễn thông 1','2655','ttvt1','Nguyễn Ngọc Tho'),('KT5','Trung tâm Viễn thông 2','2061','ttvt2','Nguyễn Thanh Tuấn'),('KT6','Trung tâm Viễn thông 2','1811','ttvt2','Nguyễn Quốc Việt'),('KT7','Trung tâm Viễn thông 2','1556','ttvt2','Nguyễn Trường Hận'),('KT8','Trung tâm Viễn thông 2','1647','ttvt2','Trần Minh Đương'),('KT9','Trung tâm Viễn thông 2','2075','ttvt2','Trần Vũ Kha');
/*!40000 ALTER TABLE `tuyen_kt_tt` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-08 20:00:02
