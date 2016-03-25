USE [db01]
GO

/****** Object:  Table [dbo].[User]    Script Date: 17/3/2016 10:23:10 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[User](
	[id] [nvarchar](255) NOT NULL,
	[__createdAt] [datetimeoffset](3) NOT NULL,
	[__updatedAt] [datetimeoffset](3) NULL,
	[__version] [timestamp] NOT NULL,
	[__deleted] [bit] NOT NULL,
	[azureid] [nvarchar](100) NULL,
	[userName] [nvarchar](100) NULL,
	[name] [nvarchar](255) NULL,
	[email] [nvarchar](255) NOT NULL,
	[mobile] [nvarchar](255) NULL,
	[address] [nvarchar](255) NULL,
	[description] [nvarchar](255) NULL,
	[activated] [bit] NULL,
	[activationToken] [nvarchar](50) NULL,
	[photo] [varchar](MAX) NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

ALTER TABLE [dbo].[User] ADD  CONSTRAINT [DF_User_id]  DEFAULT (CONVERT([nvarchar](255),newid(),(0))) FOR [id]
GO

ALTER TABLE [dbo].[User] ADD  CONSTRAINT [DF_User___createdAt]  DEFAULT (CONVERT([datetimeoffset](3),sysutcdatetime(),(0))) FOR [__createdAt]
GO

ALTER TABLE [dbo].[User] ADD  DEFAULT ((0)) FOR [__deleted]
GO


