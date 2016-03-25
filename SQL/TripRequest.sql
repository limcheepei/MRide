USE [db01]
GO

/****** Object:  Table [dbo].[TripRequest]    Script Date: 17/3/2016 10:22:01 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TripRequest](
	[id] [nvarchar](255) NOT NULL,
	[__createdAt] [datetimeoffset](3) NOT NULL,
	[__updatedAt] [datetimeoffset](3) NULL,
	[__version] [timestamp] NOT NULL,
	[__deleted] [bit] NOT NULL,
	[tripId] [nvarchar](255) NULL,
	[requesterId] [nvarchar](50) NULL,
	[status] [nvarchar](50) NULL,
	[requestRemark] [nvarchar](255) NULL,
	[driverRemark] [nvarchar](255) NULL,
	[requestDate] [datetime] NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

ALTER TABLE [dbo].[TripRequest] ADD  CONSTRAINT [DF_TripRequest_id]  DEFAULT (CONVERT([nvarchar](255),newid(),(0))) FOR [id]
GO

ALTER TABLE [dbo].[TripRequest] ADD  CONSTRAINT [DF_TripRequest___createdAt]  DEFAULT (CONVERT([datetimeoffset](3),sysutcdatetime(),(0))) FOR [__createdAt]
GO

ALTER TABLE [dbo].[TripRequest] ADD  DEFAULT ((0)) FOR [__deleted]
GO


