USE [master]
GO
/****** Object:  Database [myschool]    Script Date: 29/05/2025 14:28:11 ******/
CREATE DATABASE [myschool]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'myschool', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\myschool.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'myschool_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\myschool_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [myschool] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [myschool].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [myschool] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [myschool] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [myschool] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [myschool] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [myschool] SET ARITHABORT OFF 
GO
ALTER DATABASE [myschool] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [myschool] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [myschool] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [myschool] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [myschool] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [myschool] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [myschool] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [myschool] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [myschool] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [myschool] SET  ENABLE_BROKER 
GO
ALTER DATABASE [myschool] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [myschool] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [myschool] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [myschool] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [myschool] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [myschool] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [myschool] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [myschool] SET RECOVERY FULL 
GO
ALTER DATABASE [myschool] SET  MULTI_USER 
GO
ALTER DATABASE [myschool] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [myschool] SET DB_CHAINING OFF 
GO
ALTER DATABASE [myschool] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [myschool] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [myschool] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [myschool] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'myschool', N'ON'
GO
ALTER DATABASE [myschool] SET QUERY_STORE = ON
GO
ALTER DATABASE [myschool] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [myschool]
GO
/****** Object:  Table [dbo].[HealthCheck]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HealthCheck](
	[CheckId] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NULL,
	[CampaignId] [int] NULL,
	[Date] [date] NULL,
	[Height] [float] NULL,
	[Weight] [float] NULL,
	[Eyesight] [nvarchar](50) NULL,
	[Hearing] [nvarchar](50) NULL,
	[ParentConfirmation] [bit] NULL,
	[Notes] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[CheckId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HealthCheckCampaign]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HealthCheckCampaign](
	[CampaignId] [int] IDENTITY(1,1) NOT NULL,
	[CampaignName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[ScheduledDate] [date] NOT NULL,
	[CreatedBy] [int] NULL,
	[ApprovedBy] [int] NULL,
	[ApprovedAt] [datetime] NULL,
	[Status] [nvarchar](20) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[CampaignId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HealthDocuments]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HealthDocuments](
	[DocumentId] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[FileUrl] [nvarchar](500) NULL,
	[Category] [nvarchar](100) NULL,
	[UploadedBy] [int] NULL,
	[CreatedAt] [datetime] NULL,
	[IsPublished] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[DocumentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HealthProfile]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HealthProfile](
	[ProfileId] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NULL,
	[Allergies] [nvarchar](255) NULL,
	[ChronicDiseases] [nvarchar](255) NULL,
	[TreatmentHistory] [nvarchar](255) NULL,
	[Eyesight] [nvarchar](50) NULL,
	[Hearing] [nvarchar](50) NULL,
	[BloodType] [nvarchar](10) NULL,
	[Weight] [decimal](5, 2) NULL,
	[Height] [decimal](5, 2) NULL,
	[Notes] [nvarchar](255) NULL,
	[UpdatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProfileId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Inventory]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Inventory](
	[ItemId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Type] [nvarchar](50) NULL,
	[Unit] [nvarchar](20) NULL,
	[Quantity] [int] NULL,
	[ExpiryDate] [date] NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InventoryUsageLog]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InventoryUsageLog](
	[UsageId] [int] IDENTITY(1,1) NOT NULL,
	[ItemId] [int] NULL,
	[QuantityUsed] [int] NULL,
	[UsedAt] [datetime] NULL,
	[RelatedEventId] [int] NULL,
	[Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[UsageId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MedicalEvent]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MedicalEvent](
	[EventId] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NULL,
	[EventType] [nvarchar](50) NULL,
	[Description] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[RelatedMedicinesUsed] [nvarchar](255) NULL,
	[Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[EventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MedicineLog]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MedicineLog](
	[LogId] [int] IDENTITY(1,1) NOT NULL,
	[SubmissionId] [int] NULL,
	[GivenBy] [int] NULL,
	[GivenAt] [datetime] NULL,
	[Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[LogId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MedicineSubmission]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MedicineSubmission](
	[SubmissionId] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NULL,
	[ParentId] [int] NULL,
	[SubmitDate] [date] NULL,
	[MedicineName] [nvarchar](100) NULL,
	[Dosage] [nvarchar](100) NULL,
	[Instruction] [nvarchar](255) NULL,
	[Duration] [nvarchar](100) NULL,
	[Status] [nvarchar](20) NULL,
	[Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[SubmissionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notification]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[NotificationId] [int] IDENTITY(1,1) NOT NULL,
	[ToUserId] [int] NULL,
	[Title] [nvarchar](100) NULL,
	[Message] [nvarchar](255) NULL,
	[IsRead] [bit] NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[NotificationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Students]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Students](
	[StudentId] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[DOB] [date] NOT NULL,
	[Gender] [nvarchar](10) NULL,
	[ClassName] [nvarchar](50) NULL,
	[ParentId] [int] NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[Phone] [nvarchar](20) NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Role] [nvarchar](20) NOT NULL,
	[CreatedAT] [date] NULL,
	[IsActive] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vaccination]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vaccination](
	[VaccinationId] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NULL,
	[CampaignId] [int] NULL,
	[VaccineName] [nvarchar](100) NULL,
	[Date] [date] NULL,
	[Result] [nvarchar](100) NULL,
	[ParentConfirmation] [bit] NULL,
	[Notes] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[VaccinationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VaccinationCampaign]    Script Date: 29/05/2025 14:28:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VaccinationCampaign](
	[CampaignId] [int] IDENTITY(1,1) NOT NULL,
	[CampaignName] [nvarchar](100) NULL,
	[Description] [nvarchar](255) NULL,
	[ScheduledDate] [date] NULL,
	[CreatedBy] [int] NULL,
	[ApprovedBy] [int] NULL,
	[ApprovedAt] [datetime] NULL,
	[Status] [nvarchar](20) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[CampaignId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [UQ__HealthPr__32C52B9863C42C36]    Script Date: 29/05/2025 14:28:11 ******/
ALTER TABLE [dbo].[HealthProfile] ADD UNIQUE NONCLUSTERED 
(
	[StudentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__A9D105348A22F9A2]    Script Date: 29/05/2025 14:28:11 ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[HealthCheck] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[HealthCheckCampaign] ADD  DEFAULT ('DRAFT') FOR [Status]
GO
ALTER TABLE [dbo].[HealthCheckCampaign] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[HealthDocuments] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[HealthDocuments] ADD  DEFAULT ((1)) FOR [IsPublished]
GO
ALTER TABLE [dbo].[HealthProfile] ADD  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Inventory] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[InventoryUsageLog] ADD  DEFAULT (getdate()) FOR [UsedAt]
GO
ALTER TABLE [dbo].[MedicalEvent] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[MedicineLog] ADD  DEFAULT (getdate()) FOR [GivenAt]
GO
ALTER TABLE [dbo].[MedicineSubmission] ADD  DEFAULT (getdate()) FOR [SubmitDate]
GO
ALTER TABLE [dbo].[MedicineSubmission] ADD  DEFAULT ('PENDING') FOR [Status]
GO
ALTER TABLE [dbo].[Notification] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Notification] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Vaccination] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[VaccinationCampaign] ADD  DEFAULT ('DRAFT') FOR [Status]
GO
ALTER TABLE [dbo].[VaccinationCampaign] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[HealthCheck]  WITH CHECK ADD FOREIGN KEY([CampaignId])
REFERENCES [dbo].[HealthCheckCampaign] ([CampaignId])
GO
ALTER TABLE [dbo].[HealthCheck]  WITH CHECK ADD FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([StudentId])
GO
ALTER TABLE [dbo].[HealthCheckCampaign]  WITH CHECK ADD FOREIGN KEY([ApprovedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[HealthCheckCampaign]  WITH CHECK ADD FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[HealthDocuments]  WITH CHECK ADD FOREIGN KEY([UploadedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[HealthProfile]  WITH CHECK ADD FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([StudentId])
GO
ALTER TABLE [dbo].[InventoryUsageLog]  WITH CHECK ADD FOREIGN KEY([ItemId])
REFERENCES [dbo].[Inventory] ([ItemId])
GO
ALTER TABLE [dbo].[InventoryUsageLog]  WITH CHECK ADD FOREIGN KEY([RelatedEventId])
REFERENCES [dbo].[MedicalEvent] ([EventId])
GO
ALTER TABLE [dbo].[MedicalEvent]  WITH CHECK ADD FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[MedicalEvent]  WITH CHECK ADD FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([StudentId])
GO
ALTER TABLE [dbo].[MedicineLog]  WITH CHECK ADD FOREIGN KEY([GivenBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[MedicineLog]  WITH CHECK ADD FOREIGN KEY([SubmissionId])
REFERENCES [dbo].[MedicineSubmission] ([SubmissionId])
GO
ALTER TABLE [dbo].[MedicineSubmission]  WITH CHECK ADD FOREIGN KEY([ParentId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[MedicineSubmission]  WITH CHECK ADD FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([StudentId])
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD FOREIGN KEY([ToUserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD FOREIGN KEY([ParentId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Vaccination]  WITH CHECK ADD FOREIGN KEY([CampaignId])
REFERENCES [dbo].[VaccinationCampaign] ([CampaignId])
GO
ALTER TABLE [dbo].[Vaccination]  WITH CHECK ADD FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([StudentId])
GO
ALTER TABLE [dbo].[VaccinationCampaign]  WITH CHECK ADD FOREIGN KEY([ApprovedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[VaccinationCampaign]  WITH CHECK ADD FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[HealthCheckCampaign]  WITH CHECK ADD CHECK  (([Status]='CANCELLED' OR [Status]='APPROVED' OR [Status]='PENDING' OR [Status]='DRAFT'))
GO
ALTER TABLE [dbo].[Inventory]  WITH CHECK ADD CHECK  (([Type]='Supply' OR [Type]='Medicine'))
GO
ALTER TABLE [dbo].[MedicineSubmission]  WITH CHECK ADD CHECK  (([Status]='APPROVED' OR [Status]='PENDING'))
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD CHECK  (([Role]='ADMIN' OR [Role]='NURSE' OR [Role]='PARENT'))
GO
ALTER TABLE [dbo].[VaccinationCampaign]  WITH CHECK ADD CHECK  (([Status]='CANCELLED' OR [Status]='APPROVED' OR [Status]='PENDING' OR [Status]='DRAFT'))
GO
USE [master]
GO
ALTER DATABASE [myschool] SET  READ_WRITE 
GO
