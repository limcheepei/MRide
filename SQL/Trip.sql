USE [db01]
GO

/****** Object:  Table [dbo].[Trip]    Script Date: 17/3/2016 10:21:39 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Trip](
	[id] [nvarchar](255) NOT NULL,
	[__createdAt] [datetimeoffset](3) NOT NULL,
	[__updatedAt] [datetimeoffset](3) NULL,
	[__version] [timestamp] NOT NULL,
	[__deleted] [bit] NOT NULL,
	[driverId] [nvarchar](255) NULL,
	[status] [nvarchar](50) NULL,
	[date] [date] NULL,
	[time] [nvarchar](50) NULL,
	[car] [nvarchar](50) NULL,
	[carColor] [nvarchar](50) NULL,
	[carPlateNumber] [nvarchar](50) NULL,
	[carDesc] [nvarchar](255) NULL,
	[seats] [int] NULL,
	[seatsAvailable] [int] NULL,
	[locationFrom] [nvarchar](255) NULL,
	[locationTo] [nvarchar](255) NULL,
	[geoFrom] [nvarchar](50) NULL,
	[geoTo] [nvarchar](50) NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

ALTER TABLE [dbo].[Trip] ADD  CONSTRAINT [DF_Trip_id]  DEFAULT (CONVERT([nvarchar](255),newid(),(0))) FOR [id]
GO

ALTER TABLE [dbo].[Trip] ADD  CONSTRAINT [DF_Trip___createdAt]  DEFAULT (CONVERT([datetimeoffset](3),sysutcdatetime(),(0))) FOR [__createdAt]
GO

ALTER TABLE [dbo].[Trip] ADD  DEFAULT ((0)) FOR [__deleted]
GO


