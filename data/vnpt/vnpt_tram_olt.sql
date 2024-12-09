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
-- Table structure for table `tram_olt`
--

DROP TABLE IF EXISTS `tram_olt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tram_olt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matram` varchar(25) DEFAULT NULL,
  `tentram` varchar(255) DEFAULT NULL,
  `his` int DEFAULT NULL,
  `mytv` int DEFAULT NULL,
  `ims` int DEFAULT NULL,
  `loai` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `port` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tram_olt`
--

LOCK TABLES `tram_olt` WRITE;
/*!40000 ALTER TABLE `tram_olt` DISABLE KEYS */;
INSERT INTO `tram_olt` VALUES (1,'HC031','OLT Huawei_Mini CTH003M',414,2429,2529,'hw-mini','root','Dhtthost%40345678','10.102.60.16','1'),(2,'HL141','OLT Huawei_Mini LMY014M',427,2420,2520,'hw-mini','root','Dhtthost%40345678','10.102.60.14','1'),(3,'HP041','OLT Huawei_Mini PHI004M',561,2427,2527,'hw-mini','root','Dhtthost%40345678','10.102.60.13','3'),(4,'HP521','OLT Huawei_Mini PHI052M',462,2427,2527,'hw-mini','root','Dhtthost%40345678','10.102.60.12','3'),(5,'HT011','OLT Huawei_Mini TLM001M',448,2420,2520,'hw-mini','root','Dhtthost%40345678','10.102.60.15','1'),(6,'HV081','OLT Huawei_Mini VTH008M',301,2418,2518,'hw-mini','root','Dhtthost%40345678','10.102.60.10','1'),(7,'HV021','OLT Huawei_Mini VTY002M',418,2419,2519,'hw-mini','root','Dhtthost%40345678','10.102.60.11','1'),(8,'HVTH1','OLT Huawei VI THANH - 1',424,2418,2518,'huawei','root','Dhtthost%40345678','10.102.55.10','0/8-1'),(9,'HVTY1','OLT Huawei VI THUY - 1',549,2419,2519,'huawei','root','Dhtthost%40345678','10.102.55.11','0/8-0'),(10,'HNBY1','OLT Huawei NGA BAY - 1',456,2427,2527,'huawei','root','Dhtthost%40345678','10.102.55.12','0/9-0,0/9-1,0/8-0, 0/8-1'),(11,'HTXN1','OLT Huawei THANH XUAN - 1',432,2434,2534,'huawei','root','Dhtthost%40345678','10.102.55.13','0/9-0, 0/9-1'),(12,'ZC051','OLT ZTE_Mini CTH005',371,2429,2529,'zte-mini','admin','dhtthost%40','10.102.62.18','xgei-1/1/1'),(13,'ZC2813','OLT ZTE_Mini CTA028',370,2428,2528,'zte-mini','admin','dhtthost%40','10.102.62.19','xgei-1/1/1'),(14,'ZC0413','OLT ZTE_Mini CTH004',369,2429,2529,'zte-mini','admin','dhtthost%40','10.102.62.20','xgei-1/1/1'),(15,'ZC0613','OLT ZTE_Mini CTA006',368,2434,2534,'zte-mini','admin','dhtthost%40','10.102.62.21','xgei-1/1/1'),(16,'ZC2513','OLT ZTE_Mini CTH025',373,2429,2529,'zte-mini','admin','dhtthost%40','10.102.62.16','xgei-1/1/1,xgei-1/1/2'),(17,'ZL1813','OLT ZTE_Mini LMY018_Vĩnh Viễn 2',375,2420,2520,'zte-mini','admin','dhtthost%40','10.102.62.14','xgei-1/1/1'),(18,'ZL4513','OLT ZTE_Mini LMY045',430,2420,2520,'zte-mini','admin','dhtthost%40','10.102.62.23','xgei-1/1/1'),(19,'ZV2913','OLT ZTE_Mini VTY029',379,2419,2519,'zte-mini','admin','dhtthost%40','10.102.62.10',''),(20,'ZV0713','OLT ZTE_Mini VTY007_Vĩnh Thuận Tây 2',367,2419,2519,'zte-mini','admin','dhtthost%40','10.102.62.11','xgei-1/1/2'),(21,'ZV1113','OLT ZTE_Mini VTY011_Vị Trung',377,2419,2519,'zte-mini','admin','dhtthost%40','10.102.62.12','xgei-1/1/1'),(22,'ZV0313','OLT ZTE_Mini VTH003_Tân Tiến',409,2418,2518,'zte-mini','admin','dhtthost%40','10.102.62.22','xgei-1/1/1,xgei-1/1/2'),(23,'ZP1113','OLT ZTE_Mini PHI011_Phương Phú',376,2420,2520,'zte-mini','admin','dhtthost%40','10.102.62.13','xgei-1/1/1'),(24,'ZP2913','OLT ZTE_Mini PHI029',374,2427,2527,'zte-mini','admin','dhtthost%40','10.102.62.15','xgei-1/1/1'),(25,'ZN1313','OLT ZTE_Mini NBA013',372,2427,2527,'zte-mini','admin','dhtthost%40','10.102.62.17','xgei-1/1/1'),(26,'ZP3813','OLT ZTE_Mini PHI038',395,2427,2527,'zte-mini','admin','dhtthost%40','10.102.62.24','xgei-1/1/1'),(27,'ZBHU1','OLT ZTE Bình Hiếu - 1',491,2420,2520,'gpon-zte','admin','dhtthost%40','10.102.53.22','gei_1/3/1,gei_1/4/1'),(28,'ZVTT1','OLT ZTE BTS Vĩnh Thuận Tây - 1',400,2419,2519,'gpon-zte','admin','dhtthost%40','10.102.53.23',''),(29,'ZCTG1','OLT ZTE Cầu Trắng - 1',499,2427,2527,'gpon-zte','admin','dhtthost%40','10.102.53.19','gei_1/3/1,gei_1/4/2'),(30,'ZLMY1','OLT ZTE Long Mỹ - 1',506,2420,2520,'gpon-zte','admin','dhtthost%40','10.102.53.11','xgei_1/4/2'),(31,'ZLP21','OLT ZTE Long Phu 2 - 1',477,2420,2520,'gpon-zte','admin','dhtthost%40','10.102.53.27','gei_1/3/1,gei_1/3/2'),(32,'ZLTH1','OLT ZTE Long Thạnh - 1',480,2428,2528,'gpon-zte','admin','dhtthost%40','10.102.53.28','gei_1/3/1,gei_1/3/2,gei_1/4/1,gei_1/4/2'),(33,'ZLTI1','OLT ZTE Long Trị - 1',479,2420,2520,'gpon-zte','admin','dhtthost%40','10.102.53.24','gei_1/3/1,gei_1/3/2,gei_1/4/1'),(34,'ZLNA1','OLT ZTE Lương Nghĩa - 1',555,2420,2520,'gpon-zte','admin','dhtthost%40','10.102.53.20',''),(35,'ZLT21','OLT ZTE Lương Tâm 2 - 1',554,2420,2520,'gpon-zte','admin','dhtthost%40','10.102.53.17','gei_1/3/1,gei_1/4/1'),(36,'ZNBY1','OLT ZTE Ngã Bảy - 1',509,2427,2527,'gpon-zte','admin','dhtthost%40','10.102.53.14','xgei_1/4/2'),(37,'ZTPT1','OLT ZTE Tân Phú Thạnh - 1',558,2428,2528,'gpon-zte','admin','dhtthost%40','10.102.53.13','xgei_1/4/2'),(38,'ZTTN1','OLT ZTE Tân Thuận - 1',507,2434,2534,'gpon-zte','admin','dhtthost%40','10.102.53.12','gei_1/3/1,gei_1/3/2,gei_1/4/1,gei_1/4/2'),(39,'ZTLT1','OLT ZTE Trường Long Tây - 1',500,2434,2534,'gpon-zte','admin','dhtthost%40','10.102.53.18',''),(40,'ZVTH1','OLT ZTE Vị Thanh - 1',550,2418,2518,'gpon-zte','admin','dhtthost%40','10.102.53.10','xgei_1/4/2'),(41,'ZV361','OLT ZTE VNP36 - 1',471,2418,2518,'gpon-zte','admin','dhtthost%40','10.102.53.26',''),(42,'ZV371','OLT ZTE VNP37 - 1',525,2427,2527,'gpon-zte','admin','dhtthost%40','10.102.53.25','gei_1/3/1,gei_1/3/2,gei_1/4/1,gei_1/4/2'),(43,'Z0201','OLT ZTE VTH020 - 1',378,2418,2518,'gpon-zte','admin','dhtthost%40','10.102.53.29','gei_1/3/2'),(44,'AXHA1','OLT ALU BTS Xã Hòa An - 1',431,2437,2537,'gpon-alu','isadmin','ans%23150','10.102.54.35','nt-a:xfp:1,nt-a:xfp:2,nt-a:xfp:3,nt-a:xfp:4'),(45,'ADPU1','OLT ALU Đông Phú - 1',495,2429,2529,'gpon-alu','isadmin','ans%23150','10.102.54.19','nt-a:xfp:2,nt-b:xfp:4'),(46,'ADPC1','OLT ALU Đông Phước - 1',503,2429,2529,'gpon-alu','isadmin','ans%23150','10.102.54.14','nt-a:xfp:4'),(47,'AHHG1','OLT ALU Hiệp Hưng - 1',505,2426,2526,'gpon-alu','isadmin','ans%23150','10.102.54.11','nt-a:xfp:4'),(48,'AHAN1','OLT ALU Hòa An - 1',486,2437,2537,'gpon-alu','isadmin','ans%23150','10.102.54.17','nt-b:xfp:4'),(49,'AHLU2','OLT ALU HỎA LỰU -2',396,2418,2518,'gpon-alu','isadmin','ans%23150','10.102.54.34','nt-a:xfp:2'),(50,'AHMY1','OLT ALU Hòa Mỹ  - 1',392,2426,2526,'gpon-alu','isadmin','ans%23150','10.102.54.36','nt-a:xfp:1,nt-b:xfp:4'),(51,'ALBH1','OLT ALU Long Bình - 1 ',393,2420,2520,'gpon-alu','isadmin','ans%23150','10.102.54.37','nt-a:xfp:2,nt-b:xfp:4'),(52,'ALMY2','OLT ALU Long Mỹ - 2',459,2420,2520,'gpon-alu','isadmin','ans%23150','10.102.54.25','nt-b:xfp:4'),(53,'ALPU1','OLT ALU Long Phú - 1',551,2420,2520,'gpon-alu','isadmin','ans%23150','10.102.54.30','nt-a:xfp:4'),(54,'ANBY2','OLT ALU Ngã Bảy - 2',508,2427,2527,'gpon-alu','isadmin','ans%23150','10.102.54.23','nt-a:xfp:4'),(55,'APHA1','OLT ALU Phú Hòa - 1',475,2429,2529,'gpon-alu','isadmin','ans%23150','10.102.54.20','nt-a:xfp:4'),(56,'APBH1','OLT ALU Phương Bình - 1',493,2426,2526,'gpon-alu','isadmin','ans%23150','10.102.54.21','nt-b:xfp:4'),(57,'ATAH1','OLT ALU Tân Hòa- 1',497,2434,2534,'gpon-alu','isadmin','ans%23150','10.102.54.33','nt-a:xfp:1,nt-a:xfp:2'),(58,'ATPT2','OLT ALU Tân Phú Thạnh- 2',461,2428,2528,'gpon-alu','isadmin','ans%23150','10.102.54.24','nt-b:xfp:1,nt-a:xfp:3,nt-a:xfp:2,nt-a:xfp:1'),(59,'ATPH1','OLT ALU Tân Phước Hưng - 1',488,2426,2526,'gpon-alu','isadmin','ans%23150','10.102.54.22','nt-a:xfp:1,nt-a:xfp:4'),(60,'ATTH1','OLT ALU Tân Thành - 1',419,2427,2527,'gpon-alu','isadmin','ans%23150','10.102.54.29','nt-a:xfp:1,nt-b:xfp:4'),(61,'ATTN2','OLT ALU Tân Thuận - 2',455,2434,2534,'gpon-alu','isadmin','ans%23150','10.102.54.28','nt-a:xfp:1,nt-a:xfp:2,nt-a:xfp:3,nt-b:xfp:1,nt-b:xfp:2'),(62,'ATHA1','OLT ALU Thanh Hoa- 1',422,2428,2528,'gpon-alu','isadmin','ans%23150','10.102.54.31','nt-a:xfp:1,nt-a:xfp:2'),(63,'ATXN1','OLT ALU Thạnh Xuân - 1',504,2434,2534,'gpon-alu','isadmin','ans%23150','10.102.54.10','nt-b:xfp:4'),(64,'ATLA1','OLT ALU Trường Long A - 1',404,2434,2534,'gpon-alu','isadmin','ans%23150','10.102.54.27','nt-a:xfp:4'),(65,'AVTH3','OLT ALU Vị Thanh - 3',458,2418,2518,'gpon-alu','isadmin','ans%23150','10.102.54.26','nt-a:xfp:4'),(66,'AVTH4','OLT ALU Vị Thanh - 4',423,2418,2518,'gpon-alu','isadmin','ans%23150','10.102.54.16','nt-a:xfp:4'),(67,'AVTY1','OLT ALU Vị Thủy - 1',466,2419,2519,'gpon-alu','isadmin','ans%23150','10.102.54.12','nt-a:xfp:4'),(68,'AVTG1','OLT ALU Vĩnh Tường - 1',420,2419,2519,'gpon-alu','isadmin','ans%23150','10.102.54.15','nt-b:xfp:1,nt-b:xfp:4'),(69,'AVVN1','OLT ALU Vĩnh Viễn - 1',498,2420,2520,'gpon-alu','isadmin','ans%23150','10.102.54.18','nt-a:xfp:4'),(70,'AV351','OLT ALU VNP35 - 1',391,2428,2528,'gpon-alu','isadmin','ans%23150','10.102.54.38','nt-a:xfp:1'),(71,'AXPN1','OLT ALU XÀ PHIÊN -1',397,2420,2520,'gpon-alu','isadmin','ans%23150','10.102.54.32','nt-a:xfp:4'),(72,'AXVT1','OLT ALU Xã Vị Thanh - 1',467,2418,2518,'gpon-alu','isadmin','ans%23150','10.102.54.13','nt-a:xfp:2,nt-b:xfp:2'),(73,'D0131','OLT DASAN CTA013M-01',384,2434,2534,'dasan','admin','dhtthost%40','10.102.56.102','9'),(74,'D0141','OLT DASAN CTA014M-01',383,2434,2534,'dasan','admin','dhtthost%40','10.102.56.101','9'),(75,'D0131','OLT DASAN CTH013M-01',382,2429,2529,'dasan','admin','dhtthost%40','10.102.56.100','9'),(76,'D0161','OLT DASAN LMY016M-01 (Vinh Thuan Dong)',387,2420,2520,'dasan','admin','dhtthost%40','10.102.56.105','9'),(77,'D0201','OLT DASAN LMY020M-01 (Vinh Vien A)',388,2420,2520,'dasan','admin','dhtthost%40','10.102.56.107','9'),(78,'D0211','OLT DASAN LMY021M-01 (Xa Long Phu)',389,2420,2520,'dasan','admin','dhtthost%40','10.102.56.104','9'),(79,'DP401','OLT DASAN PHI040M-01',452,2426,2526,'dasan','admin','dhtthost%40','10.102.56.103','9'),(80,'DP371','OLT DASAN PHI037M-01',429,2437,2537,'dasan','admin','dhtthost%40','10.102.56.106','9'),(81,'D0011','OLT DASAN VTY001M-01',380,2419,2519,'dasan','admin','dhtthost%40','10.102.56.109','9'),(82,'D0301','OLT DASAN VTY030M-01',381,2418,2518,'dasan','admin','dhtthost%40','10.102.56.108','9');
/*!40000 ALTER TABLE `tram_olt` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-08 20:00:03
