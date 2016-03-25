USE [db01]
GO

/****** Object:  Table [dbo].[Car]    Script Date: 17/3/2016 10:20:52 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Car](
	[id] [nvarchar](255) NOT NULL,
	[__createdAt] [datetimeoffset](3) NOT NULL,
	[__updatedAt] [datetimeoffset](3) NULL,
	[__version] [timestamp] NOT NULL,
	[__deleted] [bit] NOT NULL,
	[userName] [nvarchar](100) NULL,
	[car] [nvarchar](50) NULL,
	[carPlateNumber] [nvarchar](50) NULL,
	[carColor] [nvarchar](50) NULL,
	[carDesc] [nvarchar](255) NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

ALTER TABLE [dbo].[Car] ADD  CONSTRAINT [DF_Car_id]  DEFAULT (CONVERT([nvarchar](255),newid(),(0))) FOR [id]
GO

ALTER TABLE [dbo].[Car] ADD  CONSTRAINT [DF_Car___createdAt]  DEFAULT (CONVERT([datetimeoffset](3),sysutcdatetime(),(0))) FOR [__createdAt]
GO

ALTER TABLE [dbo].[Car] ADD  DEFAULT ((0)) FOR [__deleted]
GO


