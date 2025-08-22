-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: nozomi.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` varchar(10) NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('A001','admin','internconnect.ic@gmail.com','admin','0923797188','https://res.cloudinary.com/dpwevo7co/image/upload/v1755634870/internconnect/profile/1755634870132.jpg');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(11) DEFAULT NULL,
  `job_posting_id` int DEFAULT NULL,
  `apply_date` date NOT NULL,
  `resume_file` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `confirmed` tinyint DEFAULT '0',
  PRIMARY KEY (`application_id`),
  KEY `student_id` (`student_id`),
  KEY `application_ibfk_2` (`job_posting_id`),
  CONSTRAINT `application_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `application_ibfk_2` FOREIGN KEY (`job_posting_id`) REFERENCES `job_posting` (`job_posting_id`),
  CONSTRAINT `application_chk_1` CHECK ((`status` in (0,1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (13,'65011211002',8,'2025-08-05','1754375144787-496812602.pdf',1,0),(14,'65011211002',9,'2025-08-05','1754375160349-352380894.pdf',1,1),(15,'65011211004',9,'2025-08-05','1754375205877-67624832.pdf',1,1),(16,'65011211002',11,'2025-08-05','1754375318487-349653134.pdf',2,0),(17,'65011211002',10,'2025-08-05','1754382246101-799900089.pdf',0,0),(18,'65011211002',14,'2025-08-13','1755067737491-567560811.pdf',0,0),(19,'65011211035',14,'2025-08-18','1755509064639-271302512.pdf',1,1),(20,'65011211001',8,'2025-08-19','1755592318989-995814969.pdf',1,1),(21,'65011211036',8,'2025-08-19','1755595170082-733947488.pdf',1,1),(22,'65011211003',11,'2025-08-20','1755696270090-153292021.pdf',1,1),(23,'65011211003',9,'2025-08-20','1755696292134-481838515.pdf',1,0),(24,'65011211008',11,'2025-08-20','1755719547520-983348496.pdf',1,1),(25,'65011211008',13,'2025-08-20','1755719562944-127458655.pdf',1,0);
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `company_id` varchar(13) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `business_type` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `google_maps_link` text,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_name` varchar(100) NOT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `website` varchar(150) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `company_logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`company_id`),
  UNIQUE KEY `contact_email` (`contact_email`),
  CONSTRAINT `fk_company_user` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES ('0105565001234','บริษัท สมาร์ทบิท อินโนเวชั่น จำกัด','IT','123/45 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.137841486384!2d100.6771479!3d13.770559899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d61635b0ea0fd%3A0x3128f047687135e5!2z4LiW4LiZ4LiZIOC4o-C4suC4oeC4hOC4s-C5geC4q-C4hyDguYHguILguKfguIfguKrguLDguJ7guLLguJnguKrguLnguIcg4Liq4Liw4Lie4Liy4LiZ4Liq4Li54LiHIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDI0MA!5e0!3m2!1sth!2sth!4v1754367898440!5m2!1sth!2sth','contact@smartbit.co.th','อนันต์ พิพัฒน์ไพบูลย์','021234567','https://it.msu.ac.th/','2025-08-01 18:10:00','2025-08-19 18:37:39','https://res.cloudinary.com/dpwevo7co/image/upload/v1755648935/internconnect/profile/1755648934622.png'),('010556700001','บริษัท เอ็มเอสยู เทคโนโลยี จำกัด','เทคโนโลยีสารสนเทศ','123 ถนนมหาวิทยาลัย ขอนแก่น',NULL,'info1@msu-tech.co.th','สมชาย ใจดี','0811111111',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('010556700002','บริษัท อินโนเวท ไอที จำกัด','ซอฟต์แวร์','99 ถนนรัชดาภิเษก กรุงเทพฯ',NULL,'contact2@innovateit.co.th','สมหญิง พัฒน์ดี','0822222222',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('010556700003','บริษัท ไทยซอฟต์โซลูชั่น จำกัด','พัฒนาระบบ','45 ถนนสุขุมวิท กรุงเทพฯ',NULL,'sales3@thaisoft.co.th','อนุชา ไทยแท้','0833333333',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('010556700004','บริษัท สมาร์ทดิจิทัล จำกัด','ดิจิทัลโซลูชั่น','88 ถนนนิมิตรใหม่ นนทบุรี',NULL,'support4@smartdigital.co.th','อรทัย ดิจิทัล','0844444444',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('010556700005','บริษัท คลาวด์ซิสเต็มส์ จำกัด','คลาวด์คอมพิวติ้ง','55 ถนนศรีนครินทร์ สมุทรปราการ',NULL,'info5@cloudsystems.co.th','มนตรี คลาวด์','0855555555',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('010556700007','บริษัท ดิจิทัลคอร์ จำกัด','Core System','77 ถนนพระราม 9 กรุงเทพฯ',NULL,'service7@digitalcore.co.th','ศิริพร คอร์','0877777777',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('010556700009','บริษัท ไบโอเทค จำกัด','Biotech','33 ถนนพหลโยธิน กรุงเทพฯ',NULL,'contact9@biotech.co.th','จันทร์เพ็ญ ไบโอ','0899999999',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('010556700010','บริษัท กรีนพาวเวอร์ จำกัด','พลังงาน','66 ถนนบางนา-ตราด สมุทรปราการ',NULL,'info10@greenpower.co.th','วีระ กรีน','0800000000',NULL,'2025-08-19 06:17:29','2025-08-18 23:17:29',NULL),('0105567002345','บริษัท อินโฟเทค โซลูชั่นส์ จำกัด','IT','88/8 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร 10210','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.0184057428773!2d100.54422657471102!3d13.897847586509416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e282d8b1e95c37%3A0x523857033dc18d52!2sThanon%20Chaeng%20Watthana!5e0!3m2!1sen!2sth!4v1755571485929!5m2!1sen!2sth','info@infotechsolutions.co.th','วิภาวี ธรรมสถิตย์','022345678','https://it.msu.ac.th/','2025-08-01 11:15:00','2025-08-19 16:15:09','https://res.cloudinary.com/dpwevo7co/image/upload/v1755648971/internconnect/profile/1755648971618.png'),('0105568003456','บริษัท คลาวด์เวิร์คส์ เทคโนโลยี จำกัด','IT','99/12 ถนนห้วยแก้ว ตำบลสุเทพ อำเภอเมือง จังหวัดเชียงใหม่ 50200','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120866.805451573!2d98.95647724999999!3d18.7942459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a7e90bb6f5d%3A0x98d46270a59b4367!2z4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4LmA4LiK4Li14Lii4LiH4LmD4Lir4Lih4LmIIOC4reC4s-C5gOC4oOC4reC5gOC4oeC4t-C4reC4h-C5gOC4iuC4teC4ouC4h-C5g-C4q-C4oeC5iCDguYDguIrguLXguKLguIfguYPguKvguKHguYg!5e0!3m2!1sth!2sth!4v1754367154911!5m2!1sth!2sth','support@cloudworks.tech','กิตติพงษ์ อินทรากูล','0534567890','https://it.msu.ac.th/','2025-08-01 18:29:08','2025-08-19 16:18:12','https://res.cloudinary.com/dpwevo7co/image/upload/v1755649080/internconnect/profile/1755649080591.png'),('0105569004567','บริษัท เน็กซ์เจ็น ไอที โซลูชั่น จำกัด','IT','อ.เมืองสกลนคร จ.สกลนคร','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d487868.71760278236!2d103.7901266324537!3d17.19576255557504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313c8d3bfa19f8e9%3A0x302b54113606ba0!2z4Lit4Liz4LmA4Lig4Lit4LmA4Lih4Li34Lit4LiH4Liq4LiB4Lil4LiZ4LiE4LijIOC4quC4geC4peC4meC4hOC4ow!5e0!3m2!1sth!2sth!4v1755620545771!5m2!1sth!2sth','hello@nextgenits.co.th','วิทยา ลาบู','0871238654',NULL,'2025-08-01 00:00:00','2025-08-19 16:23:14','https://res.cloudinary.com/dpwevo7co/image/upload/v1755649147/internconnect/profile/1755649147118.png'),('0105570005678','บริษัท ดิจิทัลคอร์ ซิสเต็มส์ จำกัด','','',NULL,'service@digitalcore.co.th','','',NULL,'2025-08-01 00:00:00','2025-08-01 03:50:39',NULL),('1568974658956','ปรีชาพานิชณ์','IT','อำเภอเมือง จังหวัดมหาสารคาม','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d981709.7698722705!2d102.51410495723326!3d16.02372639823365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3122a6ecd410be59%3A0xbbad95e486cb239e!2z4Lih4Lir4Liy4Liq4Liy4Lij4LiE4Liy4Lih!5e0!3m2!1sth!2sth!4v1755765857863!5m2!1sth!2sth','preecha.n@msu.ac.th','ปรีชา ','0923715277','https://intern-connect160.netlify.app/company/profile','2025-08-21 00:00:00','2025-08-21 07:25:48',NULL),('2345986701234','บริษัท แล็คโต้ จำกัด','IT','อำเภอเมือง นครราชสีมา','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d246687.8732149105!2d101.91668486591745!3d14.965034713856424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31194cc83f9f823b%3A0x30469cfc8de59e0!2z4Lit4Liz4LmA4Lig4Lit4LmA4Lih4Li34Lit4LiH4LiZ4LiE4Lij4Lij4Liy4LiK4Liq4Li14Lih4LiyIOC4meC4hOC4o-C4o-C4suC4iuC4quC4teC4oeC4sg!5e0!3m2!1sth!2sth!4v1755597386360!5m2!1sth!2sth','lac@lacto.co.th','อนิวัต ยามี','0971254679',NULL,'2025-08-19 00:00:00','2025-08-19 19:41:54','https://res.cloudinary.com/dpwevo7co/image/upload/v1755634962/internconnect/profile/1755634962650.jpg');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation`
--

DROP TABLE IF EXISTS `evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluation` (
  `evaluation_id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(11) DEFAULT NULL,
  `supervisor_score` decimal(5,2) DEFAULT NULL,
  `company_score` decimal(5,2) DEFAULT NULL,
  `supervisor_comment` varchar(255) DEFAULT NULL,
  `company_comment` varchar(255) DEFAULT NULL,
  `company_id` varchar(13) DEFAULT NULL,
  `supervisor_id` varchar(10) DEFAULT NULL,
  `instructor_id` varchar(10) DEFAULT NULL,
  `evaluation_result` int NOT NULL,
  `supervisor_evaluation_date` date DEFAULT NULL,
  `company_evaluation_date` date DEFAULT NULL,
  PRIMARY KEY (`evaluation_id`),
  KEY `student_id` (`student_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `instructor_id` (`instructor_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `evaluation_ibfk_3` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisor` (`supervisor_id`),
  CONSTRAINT `evaluation_ibfk_4` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`Instructor_id`),
  CONSTRAINT `evaluation_ibfk_5` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
  CONSTRAINT `evaluation_chk_1` CHECK ((`evaluation_result` in (0,1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation`
--

LOCK TABLES `evaluation` WRITE;
/*!40000 ALTER TABLE `evaluation` DISABLE KEYS */;
INSERT INTO `evaluation` VALUES (16,'65011211004',100.00,96.00,'มีความรับผิดชอบ ตรงต่อเวลาดีมาก','good job','0105567002345','S002',NULL,1,'2025-08-05','2025-08-22'),(22,'65011211002',100.00,93.00,NULL,'very nice','0105567002345','S001',NULL,1,'2025-08-22','2025-08-22'),(23,'65011211001',100.00,104.00,NULL,NULL,'0105565001234','S002',NULL,1,'2025-08-19','2025-08-19'),(24,'65011211036',90.00,110.00,NULL,NULL,'0105565001234','S001',NULL,1,'2025-08-22','2025-08-19'),(25,'65011211035',97.00,100.00,NULL,NULL,'0105567002345','S001',NULL,1,'2025-08-22','2025-08-22');
/*!40000 ALTER TABLE `evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation_company_details`
--

DROP TABLE IF EXISTS `evaluation_company_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluation_company_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluation_id` int NOT NULL,
  `student_id` varchar(11) NOT NULL,
  `company_id` varchar(13) NOT NULL,
  `p1` tinyint DEFAULT NULL,
  `p2` tinyint DEFAULT NULL,
  `p3` tinyint DEFAULT NULL,
  `p4` tinyint DEFAULT NULL,
  `p5` tinyint DEFAULT NULL,
  `p6` tinyint DEFAULT NULL,
  `p7` tinyint DEFAULT NULL,
  `p8` tinyint DEFAULT NULL,
  `p9` tinyint DEFAULT NULL,
  `p10` tinyint DEFAULT NULL,
  `w1` tinyint DEFAULT NULL,
  `w2` tinyint DEFAULT NULL,
  `w3` tinyint DEFAULT NULL,
  `w4` tinyint DEFAULT NULL,
  `w5` tinyint DEFAULT NULL,
  `w6` tinyint DEFAULT NULL,
  `w7` tinyint DEFAULT NULL,
  `w8` tinyint DEFAULT NULL,
  `w9` tinyint DEFAULT NULL,
  `w10` tinyint DEFAULT NULL,
  `absent_sick` int DEFAULT '0',
  `absent_personal` int DEFAULT '0',
  `late_days` int DEFAULT '0',
  `absent_uninformed` int DEFAULT '0',
  `company_comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_eval` (`evaluation_id`,`student_id`,`company_id`),
  UNIQUE KEY `uq_eval_student` (`evaluation_id`,`student_id`),
  CONSTRAINT `evaluation_company_details_ibfk_1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluation` (`evaluation_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation_company_details`
--

LOCK TABLES `evaluation_company_details` WRITE;
/*!40000 ALTER TABLE `evaluation_company_details` DISABLE KEYS */;
INSERT INTO `evaluation_company_details` VALUES (6,22,'65011211002','0105567002345',4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,0,0,0,'very nice','2025-08-21 17:58:24','2025-08-22 11:39:50'),(25,16,'65011211004','0105567002345',5,5,5,4,4,5,5,4,5,4,5,5,5,5,5,5,5,5,5,5,0,0,0,0,'good job','2025-08-22 04:43:46','2025-08-22 05:49:48'),(26,25,'65011211035','0105567002345',5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,'','2025-08-22 04:44:17','2025-08-22 10:42:18');
/*!40000 ALTER TABLE `evaluation_company_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation_supervisor_details`
--

DROP TABLE IF EXISTS `evaluation_supervisor_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluation_supervisor_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluation_id` int NOT NULL,
  `student_id` varchar(11) NOT NULL,
  `supervisor_id` varchar(10) NOT NULL,
  `score_quality` tinyint DEFAULT NULL,
  `score_behavior` tinyint DEFAULT NULL,
  `score_skill` tinyint DEFAULT NULL,
  `score_personality` tinyint DEFAULT NULL,
  `score_content` tinyint DEFAULT NULL,
  `score_qna` tinyint DEFAULT NULL,
  `supervisor_comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_eval_student_supervisor` (`evaluation_id`,`student_id`,`supervisor_id`),
  CONSTRAINT `evaluation_supervisor_details_ibfk_1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluation` (`evaluation_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation_supervisor_details`
--

LOCK TABLES `evaluation_supervisor_details` WRITE;
/*!40000 ALTER TABLE `evaluation_supervisor_details` DISABLE KEYS */;
INSERT INTO `evaluation_supervisor_details` VALUES (1,22,'65011211002','S001',20,20,10,20,20,10,'','2025-08-22 10:16:53','2025-08-22 10:33:50'),(5,25,'65011211035','S001',20,19,10,20,18,10,'','2025-08-22 10:34:20','2025-08-22 10:37:59'),(6,24,'65011211036','S001',20,18,8,20,17,7,'','2025-08-22 10:34:53','2025-08-22 10:34:53');
/*!40000 ALTER TABLE `evaluation_supervisor_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `Instructor_id` varchar(10) NOT NULL,
  `Instructor_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Instructor_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_instructor_user` FOREIGN KEY (`Instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES ('I001','วิชาญ อินทร์ไพบูลย์','wichan.i@msu.ac.th','0812345678','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','อาจารย์ผู้สอน','https://res.cloudinary.com/dpwevo7co/image/upload/v1755652734/internconnect/profile/1755652733908.jpg'),('I002','กิตติ วงค์ทอง','kitti.w@msu.ac.th',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internship`
--

DROP TABLE IF EXISTS `internship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internship` (
  `internship_id` varchar(20) NOT NULL,
  `student_id` varchar(11) DEFAULT NULL,
  `company_id` varchar(13) DEFAULT NULL,
  `internship_position` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `compensation` decimal(10,2) NOT NULL,
  `job_description` varchar(255) NOT NULL,
  PRIMARY KEY (`internship_id`),
  KEY `student_id` (`student_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `internship_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internship`
--

LOCK TABLES `internship` WRITE;
/*!40000 ALTER TABLE `internship` DISABLE KEYS */;
INSERT INTO `internship` VALUES ('I175437556869','65011211002','0105567002345','Data Analyst','2025-11-29','2026-03-31',5000.00,'วิเคราะห์ข้อมูลจาก Big Data เพื่อหาความสัมพันธ์ของข้อมูลที่ซ่อนอยู่ หรือเพื่อจำแนกแบ่งประเภทข้อมูล หารูปแบบและเชื่อมโยงความสัมพันธ์'),('I175437569587','65011211004','0105567002345','Data Analyst','2025-12-01','2026-03-31',5000.00,'วิเคราะห์ข้อมูลจาก Big Data เพื่อหาความสัมพันธ์ของข้อมูลที่ซ่อนอยู่ หรือเพื่อจำแนกแบ่งประเภทข้อมูล หารูปแบบและเชื่อมโยงความสัมพันธ์'),('I175550909381','65011211035','0105567002345','BA','2025-12-01','2026-12-05',15000.00,'ทำหน้าที่พัฒนาและดูแลระบบทั้งหมดของเว็บไซต์หรือแอปพลิเคชัน ตั้งแต่การออกแบบส่วนติดต่อผู้ใช้ให้สวยงามและใช้งานง่าย ไปจนถึงการจัดการฐานข้อมูลและระบบความปลอดภัย '),('I1755592443953','65011211001','0105565001234','SA','2025-12-01','2026-03-31',8000.00,'จัดเก็บ Business Requirement วิเคราะห์ Business Requirement เพื่อทำเป็น Technical Requirement และประเมินผลระบบ วิเคราะห์ผลกระทบที่เกิดจาก Technical Requirement วิเคราะห์ปัญหาที่เกิดขึ้นจากระบบธุรกิจที่เป็นอยู่ จัดทำเอกสาร Technical Requirement ให้กับคนในท'),('I1755599945978','65011211036','0105565001234','SA','2025-12-01','2026-03-31',8000.00,'จัดเก็บ Business Requirement วิเคราะห์ Business Requirement เพื่อทำเป็น Technical Requirement และประเมินผลระบบ วิเคราะห์ผลกระทบที่เกิดจาก Technical Requirement วิเคราะห์ปัญหาที่เกิดขึ้นจากระบบธุรกิจที่เป็นอยู่ จัดทำเอกสาร Technical Requirement ให้กับคนในท'),('I1755696374980','65011211003','0105568003456','UX/UI','2025-12-01','2026-03-31',7000.00,'หน้าที่ พัฒนา และออกแบบสินค้าหรือบริการ ให้ตอบโจทย์ทั้งผู้ใช้งาน และธุรกิจผ่านการใช้ทักษะ และเครื่องมือต่าง ๆ'),('I1755719923861','65011211008','0105568003456','UX/UI','2025-12-01','2026-03-31',7000.00,'หน้าที่ พัฒนา และออกแบบสินค้าหรือบริการ ให้ตอบโจทย์ทั้งผู้ใช้งาน และธุรกิจผ่านการใช้ทักษะ และเครื่องมือต่าง ๆ');
/*!40000 ALTER TABLE `internship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_posting`
--

DROP TABLE IF EXISTS `job_posting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_posting` (
  `job_posting_id` int NOT NULL AUTO_INCREMENT,
  `company_id` varchar(13) DEFAULT NULL,
  `position` varchar(100) NOT NULL,
  `business_type` varchar(100) NOT NULL,
  `job_description` varchar(255) NOT NULL,
  `requirements` varchar(255) NOT NULL,
  `compensation` decimal(10,2) DEFAULT NULL,
  `max_positions` int NOT NULL,
  `address` varchar(255) NOT NULL,
  `google_maps_link` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  PRIMARY KEY (`job_posting_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `job_posting_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_posting`
--

LOCK TABLES `job_posting` WRITE;
/*!40000 ALTER TABLE `job_posting` DISABLE KEYS */;
INSERT INTO `job_posting` VALUES (8,'0105565001234','SA','IT','จัดเก็บ Business Requirement วิเคราะห์ Business Requirement เพื่อทำเป็น Technical Requirement และประเมินผลระบบ วิเคราะห์ผลกระทบที่เกิดจาก Technical Requirement วิเคราะห์ปัญหาที่เกิดขึ้นจากระบบธุรกิจที่เป็นอยู่ จัดทำเอกสาร Technical Requirement ให้กับคนในท','เป็นนิสิตชั้นปีที่4 สาขาที่เกี่ยวกับคอมพิวเตอร์',8000.00,2,'กรุงเทพมหานคร','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.137841486384!2d100.6771479!3d13.770559899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d61635b0ea0fd%3A0x3128f047687135e5!2z4LiW4LiZ4LiZIOC4o-C4suC4oeC4hOC4s-C5geC4q-C4hyDguYHguILguKfguIfguKrguLDguJ7guLLguJnguKrguLnguIcg4Liq4Liw4Lie4Liy4LiZ4Liq4Li54LiHIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDI0MA!5e0!3m2!1sth!2sth!4v1754367898440!5m2!1sth!2sth','2025-08-03','2025-09-03','contact@smartbit.co.th','02-123-456'),(9,'0105567002345','Data Analyst','IT','วิเคราะห์ข้อมูลจาก Big Data เพื่อหาความสัมพันธ์ของข้อมูลที่ซ่อนอยู่ หรือเพื่อจำแนกแบ่งประเภทข้อมูล หารูปแบบและเชื่อมโยงความสัมพันธ์','เป็นนิสิตสาขาเทคโนโลยีสารสนเทศ ',5000.00,2,'กรุงเทพมหานคร','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d496115.4596049967!2d100.30344585423907!3d13.724380961545599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6032280d61f3%3A0x10100b25de24820!2sBangkok!5e0!3m2!1sen!2sth!4v1754899615855!5m2!1sen!2sth','2025-07-31','2025-08-31','info@infotechsolutions.co.th','02-234-567'),(10,'0105568003456','full stack','IT','ทำหน้าที่พัฒนาและดูแลระบบทั้งหมดของเว็บไซต์หรือแอปพลิเคชัน ตั้งแต่การออกแบบส่วนติดต่อผู้ใช้ให้สวยงามและใช้งานง่าย ไปจนถึงการจัดการฐานข้อมูลและระบบความปลอดภัย ','มีความรู้ด้าน HTML, CSS และ JavaScript มีความถนัดและเชี่ยวชาญด้าน Front End Framework เช่น ReactJS หรือ Angular มีความเข้าใจในภาษาด้าน Programming เช่น Ruby, PHP หรือ Python',7000.00,3,'เชียงใหม่','https://maps.app.goo.gl/fUzrLabzdMAj1Eqi7','2025-08-05','2025-11-01','support@cloudworks.tech','053-456-78'),(11,'0105568003456','UX/UI','IT','หน้าที่ พัฒนา และออกแบบสินค้าหรือบริการ ให้ตอบโจทย์ทั้งผู้ใช้งาน และธุรกิจผ่านการใช้ทักษะ และเครื่องมือต่าง ๆ','ต้องมีทักษะที่ครอบคลุม ในด้านการเก็บข้อมูล วิเคราะห์ คิดไอเดีย ออกแบบ และทดสอบ',7000.00,2,'เชียงใหม่','https://maps.app.goo.gl/fUzrLabzdMAj1Eqi7','2025-08-04','2025-10-31','support@cloudworks.tech','053-456-78'),(13,'0105565001234','Data Analyst','IT','วิเคราะห์ข้อมูลจาก Big Data เพื่อหาความสัมพันธ์ของข้อมูลที่ซ่อนอยู่ หรือเพื่อจำแนกแบ่งประเภทข้อมูล หารูปแบบและเชื่อมโยงความสัมพันธ์','เกรดมากกว่า 3.50 ',15000.00,5,'ขอนแก่น','https://maps.app.goo.gl/KHwTKseGAGe1uLFw5','2025-08-06','2025-09-13','contact@smartbit.co.th','021234567'),(14,'0105567002345','BA','IT','ทำหน้าที่พัฒนาและดูแลระบบทั้งหมดของเว็บไซต์หรือแอปพลิเคชัน ตั้งแต่การออกแบบส่วนติดต่อผู้ใช้ให้สวยงามและใช้งานง่าย ไปจนถึงการจัดการฐานข้อมูลและระบบความปลอดภัย ','รวบรวมข้อกำหนดความต้องการใช้งาน (Requirement) ศึกษาระบบเดิมเพื่อหาแนวทางการแก้ไขปัญหา และให้คำแนะนำเกี่ยวกับระบบ วิเคราะห์และออกแบบระบบ ให้สอดคล้องกับความต้องการใช้งาน วางแผนการดำเนินงานการพัฒนาระบบ ติดต่อประสานงานระหว่าง เจ้าของระบบ ผู้ใช้งานระบบ โปรแกรม',15000.00,2,'กรุงเทพมหานคร','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d496115.4596049967!2d100.30344585423907!3d13.724380961545599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6032280d61f3%3A0x10100b25de24820!2sBangkok!5e0!3m2!1sen!2sth!4v1754899615855!5m2!1sen!2sth','2025-08-11','2025-08-31','info@infotechsolutions.co.th','0640092777'),(16,'1568974658956','Back End Developer','IT','พัฒนาเว็บไซต์ หรือแอปพลิเคชันที่รับผิดชอบในการพัฒนาส่วนของระบบหลังบ้าน โดยสร้าง และควบคุมดูแลระบบที่ทำงานภายในเว็บไซต์','ทำงานร่วมกับ Front End Developer และทีมอื่น ๆ เพื่อสร้าง Product ',12000.00,2,'อำเภอเมือง จังหวัดมหาสารคาม','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d981709.7698722705!2d102.51410495723326!3d16.02372639823365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3122a6ecd410be59%3A0xbbad95e486cb239e!2z4Lih4Lir4Liy4Liq4Liy4Lij4LiE4Liy4Lih!5e0!3m2!1sth!2sth!4v1755765857863!5m2!1sth!2sth','2025-08-21','2025-08-28','preecha.n@msu.ac.th','0923715277');
/*!40000 ALTER TABLE `job_posting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reset_email` (`email`),
  CONSTRAINT `fk_reset_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` varchar(11) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `major` varchar(100) NOT NULL,
  `faculty` varchar(100) NOT NULL,
  `university` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `year_level` int NOT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `age` int NOT NULL,
  `special_skills` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `intern_start_date` date DEFAULT NULL,
  `intern_end_date` date DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_student_user` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('65011211001','สมชาย ใจดี','65011211001@msu.ac.th','0891234567','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.12,'2003-05-12',22,'Java, SQL','https://res.cloudinary.com/dpwevo7co/image/upload/v1755653049/internconnect/profile/1755653048764.jpg','2025-12-01','2026-03-31'),('65011211002','กัลยรัตน์ นิลเกษ','65011211002@msu.ac.th','0921111115','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.76,'2004-09-17',20,'ความสามารถในการพูด การติดต่อประสานงาน','https://res.cloudinary.com/dpwevo7co/image/upload/v1755634921/internconnect/profile/1755634920921.jpg','2025-12-01','2026-03-31'),('65011211003','กิตติพงษ์ ศรีสุข','65011211003@msu.ac.th','0912345678','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.85,'2004-03-20',21,'Python, React','https://res.cloudinary.com/dpwevo7co/image/upload/v1755744085/internconnect/profile/1755744083697.jpg','2025-12-01','2026-03-31'),('65011211004','ชญานี พวงเล็ก','65011211004@msu.ac.th','0640092973','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,4.00,'2003-12-11',21,'ความสามารถในการใช้เครื่องมือสารสนเทศ','https://res.cloudinary.com/dpwevo7co/image/upload/v1755652968/internconnect/profile/1755652967469.jpg','2025-12-01','2026-03-31'),('65011211005','ณัฐพล พงษ์ไทย','65011211005@msu.ac.th','0823456789','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.44,'2003-11-15',22,'C#, .NET',NULL,'2025-12-01','2026-03-31'),('65011211006','อรทัย วัฒนสุข','65011211006@msu.ac.th','0834567890','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.20,'2004-02-18',21,'UI/UX Design',NULL,'2025-12-01','2026-03-31'),('65011211007','นรินทร์ มหาสุข','65011211007@msu.ac.th','0845678901','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.97,'2003-09-10',22,'Networking',NULL,'2025-12-01','2026-03-31'),('65011211008','ปรียาภรณ์ จันทร์งาม','65011211008@msu.ac.th','0856789012','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.65,'2004-06-22',21,'Data Analysis, Excel','https://res.cloudinary.com/dpwevo7co/image/upload/v1755744124/internconnect/profile/1755744123595.jpg','2025-12-01','2026-03-31'),('65011211010','ธีรศักดิ์ พูลเจริญ','65011211010@msu.ac.th','0867890123','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.01,'2003-08-30',22,'Python, Machine Learning',NULL,'2025-12-01','2026-03-31'),('65011211011','สุมาลี รัตนกุล','65011211011@msu.ac.th','0878901234','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,2.92,'2004-04-25',21,'Photoshop, Illustrator',NULL,'2025-12-01','2026-03-31'),('65011211012','จักรกฤษณ์ ศรีสวัสดิ์','65011211012@msu.ac.th','0889012345','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.18,'2003-12-03',22,'JavaScript, Node.js',NULL,'2025-12-01','2026-03-31'),('65011211013','ธนพร นาคะ','65011211013@msu.ac.th','0890123456','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.72,'2004-07-09',21,'UI/UX, Figma',NULL,'2025-12-01','2026-03-31'),('65011211014','อารยา แก้วใส','65011211014@msu.ac.th','0801234567','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,2.88,'2003-10-01',22,'HTML, CSS',NULL,'2025-12-01','2026-03-31'),('65011211015','ภานุพงศ์ อินทรโชติ','65011211015@msu.ac.th','0812345670','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.31,'2004-01-17',21,'SQL, Power BI',NULL,'2025-12-01','2026-03-31'),('65011211016','สุภาพร สมบัติ','65011211016@msu.ac.th','0823456701','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.08,'2003-03-14',22,'Content Writing',NULL,'2025-12-01','2026-03-31'),('65011211017','ชลธิชา ศรีสุวรรณ','65011211017@msu.ac.th','0834567012','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.49,'2004-09-11',21,'C++, Embedded Systems',NULL,'2025-12-01','2026-03-31'),('65011211018','ปริญญา สายทอง','65011211018@msu.ac.th','0845670123','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.81,'2003-02-28',22,'Cybersecurity',NULL,'2025-12-01','2026-03-31'),('65011211020','ณัฐสุดา วงศ์ดี','65011211020@msu.ac.th','0856701234','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.22,'2004-12-05',21,'Mobile App Dev',NULL,'2025-12-01','2026-03-31'),('65011211021','กนกพร วัฒนะกุล','65011211021@msu.ac.th','0867012345','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.67,'2003-06-19',22,'Python, Data Science',NULL,'2025-12-01','2026-03-31'),('65011211022','วิศรุต สุขใจ','65011211022@msu.ac.th','0870123456','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.76,'2004-05-23',21,'Networking, Linux',NULL,'2025-12-01','2026-03-31'),('65011211023','พัชรี มหามงคล','65011211023@msu.ac.th','0881234567','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.15,'2003-04-08',22,'UI/UX Design',NULL,'2025-12-01','2026-03-31'),('65011211024','ชุติมา นิลรัตน์','65011211024@msu.ac.th','0892345678','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.40,'2004-08-16',21,'Java, Spring Boot',NULL,'2025-12-01','2026-03-31'),('65011211025','วรากร ศรีทอง','65011211025@msu.ac.th','0802345678','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.05,'2003-09-22',22,'PHP, Laravel',NULL,'2025-12-01','2026-03-31'),('65011211026','อัญชลี สุนทร','65011211026@msu.ac.th','0813456789','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.58,'2004-02-09',21,'Digital Marketing',NULL,'2025-11-30','2026-03-30'),('65011211027','ภาสกร บัวทอง','65011211027@msu.ac.th','0824567890','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.90,'2003-07-29',22,'Python, SQL',NULL,'2025-12-01','2026-03-31'),('65011211028','สุทธิพงษ์ ศรีสุข','65011211028@msu.ac.th','0835678901','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.28,'2004-10-12',21,'JavaScript, React',NULL,'2025-12-01','2026-03-31'),('65011211029','ณิชกานต์ พงษ์สวัสดิ์','65011211029@msu.ac.th','0846789012','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.62,'2003-01-27',22,'Project Management',NULL,'2025-12-01','2026-03-31'),('65011211030','วริษฐา นามวงศ์','65011211030@msu.ac.th','0857890123','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.11,'2004-06-03',21,'Python, AI',NULL,'2025-12-01','2026-03-31'),('65011211031','ณัฐกิตติ์ อินทรวิเชียร','65011211031@msu.ac.th','0868901234','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.83,'2003-11-09',22,'Cloud Computing',NULL,'2025-12-01','2026-03-31'),('65011211032','สิปปนนท์ แก้วงาม','65011211032@msu.ac.th','0923797488','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.89,'2003-08-01',22,'excel','','2025-11-01','2026-03-31'),('65011211033','เกศรินทร์ ชนะชัย','65011211033@msu.ac.th','0879012345','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.46,'2004-09-14',21,'Python, Tableau',NULL,'2025-12-01','2026-03-31'),('65011211034','ศุภกาญจน์ คำดี','65011211034@msu.ac.th','0880123456','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.24,'2003-07-19',22,'UI/UX, Photoshop',NULL,'2025-12-01','2026-03-31'),('65011211035','นลธชัย บุตรราช','65011211035@msu.ac.th','0981245325','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,4.00,'2004-02-04',21,'Python, Machine Learning','https://res.cloudinary.com/dpwevo7co/image/upload/v1755634941/internconnect/profile/1755634941111.jpg','2025-12-01','2026-12-05'),('65011211036','วรัทยา นิลเกษ','65011211036@msu.ac.th','0923715267','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','หญิง',4,3.88,'2003-10-22',21,'เรียนรู้งานได้เร็ว สามารถใช้โปรแกรมได้อย่างคล่องแคล่ว','https://res.cloudinary.com/dpwevo7co/image/upload/v1755652882/internconnect/profile/1755652881293.jpg','2025-12-01','2026-03-31'),('65011211049','ธีรพง จงวัฒน์','65011211049@msu.ac.th','','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.88,'2003-08-22',22,'sql','','2025-12-01','2027-03-31'),('65011211086','วายุ กินรี','65011211086@msu.ac.th','0923797488','เทคโนโลยีสารสนเทศ\r\n','วิทยาการสารสนเทศ\r\n\r\n','มหาวิทยาลัยมหาสารคาม','ชาย',4,2.56,'2004-08-25',21,'Python, Machine Learning','','2025-12-01','2026-03-31'),('65011211099','ธนภูมิ จันทรสาขา','65011211099@msu.ac.th','0982654789','เทคโนโลยีสารสนเทศ\r\n\r\n','วิทยาการสารสนเทศ\r\n','มหาวิทยาลัยมหาสารคาม','ชาย',4,3.56,'2004-08-21',21,'Python, Machine Learning','','2025-12-01','2026-03-31');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervisor`
--

DROP TABLE IF EXISTS `supervisor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor` (
  `supervisor_id` varchar(10) NOT NULL,
  `supervisor_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`supervisor_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_supervisor_user` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor`
--

LOCK TABLES `supervisor` WRITE;
/*!40000 ALTER TABLE `supervisor` DISABLE KEYS */;
INSERT INTO `supervisor` VALUES ('S001','รศ.ดร. สุเมธ วัฒนชัย','sumet.w@msu.ac.th','0891234567','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','รองศาสตราจารย์','https://res.cloudinary.com/dpwevo7co/image/upload/v1755635497/internconnect/profile/1755635496763.jpg'),('S002','ผศ. ดร. วรรณา ศรีบุญ','wanna.sriboon@msu.ac.th','0869876543','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','รองคณบดีฝ่ายวิชาการ','1754364951659-164700772.png'),('S003','อ. ธีรวุฒิ พงษ์เกษม','teerawut.p@msu.ac.th','0901123344','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','อาจารย์ที่ปรึกษา',NULL),('S004','รศ. ดร. มนตรี วัฒนสกุล','montree.w@msu.ac.th','0815567788','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','หัวหน้าภาควิชา',NULL),('S005','อ. ศศิธร นาคี','sasithorn.n@msu.ac.th','0938892211','เทคโนโลยีสารสนเทศ','วิทยาการสารสนเทศ','อาจารย์ผู้สอน',NULL),('S006','ภาคภูมิ พุทธหาร','pakpoom.p@msu.ac.th','','','','',''),('S007','นีรสร อินทรมา','neerasorn.i@gmail.com','','','','',''),('S008','ลำดวน กลิ่นหอม','lamduan.k@msu.ac.th',NULL,NULL,NULL,NULL,NULL),('S009','นัทธ์ เมธากิจขจร','nat.metha001@msu.ac.th',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `supervisor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervisor_selection`
--

DROP TABLE IF EXISTS `supervisor_selection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_selection` (
  `selection_id` varchar(20) NOT NULL,
  `student_id` varchar(11) DEFAULT NULL,
  `supervisor_id` varchar(10) DEFAULT NULL,
  `selection_date` date NOT NULL,
  PRIMARY KEY (`selection_id`),
  KEY `student_id` (`student_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `supervisor_selection_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `supervisor_selection_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisor` (`supervisor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor_selection`
--

LOCK TABLES `supervisor_selection` WRITE;
/*!40000 ALTER TABLE `supervisor_selection` DISABLE KEYS */;
INSERT INTO `supervisor_selection` VALUES ('S175437571','65011211002','S001','2025-08-11'),('S175437572','65011211004','S002','2025-08-05'),('S1755590985336','65011211035','S001','2025-08-19'),('S1755592530545','65011211001','S002','2025-08-19'),('S1755600086688','65011211036','S001','2025-08-19'),('S1755744161126','65011211003','S002','2025-08-21'),('S1755744165618','65011211008','S001','2025-08-21');
/*!40000 ALTER TABLE `supervisor_selection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(13) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('student','company','supervisor','instructor','admin') DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0105565001234','บริษัท สมาร์ทบิท อินโนเวชั่น จำกัด','contact@smartbit.co.th','$2b$10$hU33ZF.rrluvdPnUI9ziSeJhMuiuYi6zjTVjplen4Iqe9Rk/TlYYO','company','approved'),('010556700001','บริษัท เอ็มเอสยู เทคโนโลยี จำกัด','info1@msu-tech.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('010556700002','บริษัท อินโนเวท ไอที จำกัด','contact2@innovateit.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('010556700003','บริษัท ไทยซอฟต์โซลูชั่น จำกัด','sales3@thaisoft.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('010556700004','บริษัท สมาร์ทดิจิทัล จำกัด','support4@smartdigital.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('010556700005','บริษัท คลาวด์ซิสเต็มส์ จำกัด','info5@cloudsystems.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('010556700007','บริษัท ดิจิทัลคอร์ จำกัด','service7@digitalcore.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('010556700009','บริษัท ไบโอเทค จำกัด','contact9@biotech.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('010556700010','บริษัท กรีนพาวเวอร์ จำกัด','info10@greenpower.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('0105567002345','บริษัท อินโฟเทค โซลูชั่นส์ จำกัด','info@infotechsolutions.co.th','$2b$10$syeKmCqMWD4xsl6g.DxUI.DFjUcY940dCZz2luCVx44Pq9C7cL5lG','company','approved'),('0105568003456','บริษัท คลาวด์เวิร์คส์ เทคโนโลยี จำกัด','support@cloudworks.tech','$2b$10$QU7x4fHxsgo5dYGYbvbrpe6bOANmSGxKYvhNnCo5p8tnUnhA3H5KG','company','approved'),('0105569004567','บริษัท เน็กซ์เจ็น ไอที โซลูชั่น จำกัด','hello@nextgenits.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','approved'),('0105570005678','บริษัท ดิจิทัลคอร์ ซิสเต็มส์ จำกัด','service@digitalcore.co.th','$2b$10$eXCCPmccaoyanxbyudwaCe54TRSR0ICMiXsbije7mQ3Pxt5hYcmA6','company','pending'),('1568974658900','บริษัท เครป จำกัด','0628523504crep00@gmail.com','$2b$10$O0Dgy.qGDZD1kV3i1M2tfue9IcUF2iTMFpM5saLt.CKFSbXbeATa2','company','pending'),('1568974658956','ปรีชาพานิชณ์','preecha.n@msu.ac.th','$2b$10$GLlys3AWjKYopZov0zvvYOHoTZZEX/4Jf/7hpmUdWn9PNgogz1yci','company','approved'),('2345986701234','บริษัท แล็คโต้ จำกัด','lac@lacto.co.th','$2b$10$JKKL2Xwg2euRDrTgMQa.sO.z96NZaX61gfHNeTCA.YOdc2MfH2dcW','company','approved'),('65011211001','สมชาย ใจดี','65011211001@msu.ac.th','$2b$10$JYWrlf22z.c1RzbSf2Hgg.v0Ut9yqhNgK0KHY8wpqgLLJlH/hFida','student','pending'),('65011211002','กัลยรัตน์ นิลเกษ','65011211002@msu.ac.th','$2b$10$bkMHIrRd63os4LXQAKCkieFCfp4FJZ6DZMHxwq77kVURTvBuWra0u','student','pending'),('65011211003','กิตติพงษ์ ศรีสุข','65011211003@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211004','ชญานี พวงเล็ก','65011211004@msu.ac.th','$2b$10$g5bbIclm5lKzxuI2fROloOJUwFC0cPcufch4rW6x6stchJnM5/Nqy','student','pending'),('65011211005','ณัฐพล พงษ์ไทย','65011211005@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211006','อรทัย วัฒนสุข','65011211006@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211007','นรินทร์ มหาสุข','65011211007@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211008','ปรียาภรณ์ จันทร์งาม','65011211008@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211010','ธีรศักดิ์ พูลเจริญ','65011211010@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211011','สุมาลี รัตนกุล','65011211011@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211012','จักรกฤษณ์ ศรีสวัสดิ์','65011211012@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211013','ธนพร นาคะ','65011211013@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211014','อารยา แก้วใส','65011211014@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211015','ภานุพงศ์ อินทรโชติ','65011211015@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211016','สุภาพร สมบัติ','65011211016@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211017','ชลธิชา ศรีสุวรรณ','65011211017@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211018','ปริญญา สายทอง','65011211018@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211019','สุทธิภัทร ชื่นบาน','65011211019@msu.ac.th','$2b$10$.aN59hjSq8CB.Eh91ges5.eetAWhAgijS627SQmYlDHjb3bDQf0ne','student','pending'),('65011211020','ณัฐสุดา วงศ์ดี','65011211020@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211021','กนกพร วัฒนะกุล','65011211021@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211022','วิศรุต สุขใจ','65011211022@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211023','พัชรี มหามงคล','65011211023@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211024','ชุติมา นิลรัตน์','65011211024@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211025','วรากร ศรีทอง','65011211025@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211026','อัญชลี สุนทร','65011211026@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211027','ภาสกร บัวทอง','65011211027@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211028','สุทธิพงษ์ ศรีสุข','65011211028@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211029','ณิชกานต์ พงษ์สวัสดิ์','65011211029@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211030','วริษฐา นามวงศ์','65011211030@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211031','ณัฐกิตติ์ อินทรวิเชียร','65011211031@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211032','สิปปนนท์ แก้วงาม','65011211032@msu.ac.th','$2b$10$u8yR0MEml8vahYDckpHTsu.PBHpg5Ryvpmnf4oGplGgz.eEdJjzJa','student','pending'),('65011211033','เกศรินทร์ ชนะชัย','65011211033@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211034','ศุภกาญจน์ คำดี','65011211034@msu.ac.th','$2b$10$5GvoWBAWmUzBbYb.5krrWOLlRYdU7bXEiIFtRCgJkTlIDKpvDZKZu','student','pending'),('65011211035','นลธชัย บุตรราช','65011211035@msu.ac.th','$2b$10$w7PITC5xI5O0o7eOcMw.OuhXdE65FJO59/aKXAWfqmLvNDfkQnPOq','student','pending'),('65011211036','วรัทยา นิลเกษ','65011211036@msu.ac.th','$2b$10$6Ef.fPdgMuuZySpcTMEQbeHGMcOEiPA/Bx5jYnAP28l/tY1gJrHOq','student','pending'),('65011211044','ขวัญตา พวงน้อย','65011211044@msu.ac.th','$2b$10$61PZX2RS5UVYTb/3nPjVnOTtTRkS4zQ0qEpSmauGW02qUDZOzeJ0m','student','pending'),('65011211049','ธีรพง จงวัฒน์','65011211049@msu.ac.th','$2b$10$4VB8MaQDJCp8m2UiFzN7BuetkC2BdDxFhahRnvtSlPYY8fLERSGWS','student','pending'),('65011211086','วายุ กินรี','65011211086@msu.ac.th','$2b$10$TDbjpVjrM/0zh7NAMJyhROQHSSDZ9SX5uyKaXBnMLcOf0y15pDMt6','student','pending'),('65011211099','ธนภูมิ จันทรสาขา','65011211099@msu.ac.th','$2b$10$79.gw7JbIwRdQ8/coE/9GujCgi22xMP9/JaPEZiZsKFR/E/wFLNZS','student','pending'),('A001','admin','internconnect.ic@gmail.com','$2b$10$1GU3NRkSLXUlgeKq3VaDnOROULTn1Jh90wJ8hwLDvVRQ.Nr.DXx3m','admin','pending'),('I001','ดร. วิชาญ อินทร์ไพบูลย์','wichan.i@msu.ac.th','$2b$10$fYKh.iIEoAzlvVptcb.B8.4fkNolfS1fJGSTofIg4hk9HlUIMhxBK','instructor','pending'),('I002','กิตติ วงค์ทอง','kitti.w@msu.ac.th','$2b$10$GtlqA.kOj2Dbyf.633zZxeb6rjYo4PYyBrTKrpXI.eq78Lib7FsK6','instructor','pending'),('S001','ดร. สุเมธ วัฒนชัย','sumet.w@msu.ac.th','$2b$10$hf.TViCPb3rmAZeUvVVYmuqfp.Dq.HKxCOa4TcDo1cpylibygFjdG','supervisor','pending'),('S002','ผศ. ดร. วรรณา ศรีบุญ','wanna.sriboon@msu.ac.th','$2b$10$oyhwcw7z3LocMRnMB5IG4eFQ8utvAxs/tJ0qGiVjSbJ7VlGhIWqAy','supervisor','pending'),('S003','อ. ธีรวุฒิ พงษ์เกษม','teerawut.p@msu.ac.th','$2b$10$m9Sp4BU.m6FTGrcGy/U4/OOkD7GJHOvaqSCx43wZJMU8jpAggWXx2','supervisor','pending'),('S004','รศ. ดร. มนตรี วัฒนสกุล','montree.w@msu.ac.th','$2b$10$2NbgdcF4E3VUb1mlZlTPO.9t9sX6ZgGireJ9EqDS59ah9w6q7Hq2.','supervisor','pending'),('S005','อ. ศศิธร นาคี','sasithorn.n@msu.ac.th','$2b$10$ERmIya.qKJQm5zD9Yh2vzO1InAFQujPhOtZc8sD7ZS6AlAc1PXkZe\r\n','supervisor','pending'),('S006','ภาคภูมิ พุทธหาร','pakpoom.p@msu.ac.th','$2b$10$sSVbTsbm2KNWAdR8EjYIzO42vuqzwLTkogQ4Hb/OaVOxQrcDFPgZm','supervisor','approved'),('S007','นีรสร อินทรมา','neerasorn.i@gmail.com','$2b$10$DyU5seiCIVZwEI25.6Doz.oOd7JnN6GGF1hc/QHxCq88RMqy.i.fS','supervisor','approved'),('S008','ลำดวน กลิ่นหอม','lamduan.k@msu.ac.th','$2b$10$L9aUFThnVHQrSEXeppczC.msE8cifjhJpKhyTTdEo6UxZHDG23YQC','supervisor','pending'),('S009','นัทธ์ เมธากิจขจร','nat.metha001@msu.ac.th','$2b$10$5GDQ3npEiU4OWg82EX6hK.tLARs0zsENi47svnpKbqUO520J1Dfe6','supervisor','pending');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-22 19:43:04
