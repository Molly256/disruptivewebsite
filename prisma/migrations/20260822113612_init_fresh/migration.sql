-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "loginPassword" TEXT NOT NULL,
    "transactionPassword" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "referredBy" TEXT,
    "avatar" TEXT,
    "vipLevel" INTEGER NOT NULL DEFAULT 1,
    "vipId" INTEGER NOT NULL DEFAULT 1,
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "currentSet" INTEGER NOT NULL DEFAULT 1,
    "tasksInCurrentSet" INTEGER NOT NULL DEFAULT 0,
    "taskCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalTasks" INTEGER NOT NULL DEFAULT 40,
    "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "holdAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "freezeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "specialBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "todayProfit" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "lastProfitReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creditScore" INTEGER NOT NULL DEFAULT 100,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "boundWallet" JSONB,
    "currentTaskProducts" JSONB NOT NULL DEFAULT '[]',
    "activeProducts" JSONB NOT NULL DEFAULT '[]',
    "completedProducts" JSONB NOT NULL DEFAULT '[]',
    "x10TaskNumbers" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vipLevel" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "progress" TEXT NOT NULL DEFAULT '0/40',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "products" JSONB NOT NULL DEFAULT '[]',
    "taskCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "account" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetUserId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskSetConfig" (
    "id" TEXT NOT NULL,
    "vipLevel" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "setNum" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskSetConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_inviteCode_key" ON "User"("inviteCode");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_inviteCode_idx" ON "User"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "Task_taskCode_key" ON "Task"("taskCode");

-- CreateIndex
CREATE INDEX "Task_userId_status_idx" ON "Task"("userId", "status");

-- CreateIndex
CREATE INDEX "Task_userId_day_setNumber_idx" ON "Task"("userId", "day", "setNumber");

-- CreateIndex
CREATE INDEX "Task_taskCode_idx" ON "Task"("taskCode");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "TaskSetConfig_vipLevel_day_idx" ON "TaskSetConfig"("vipLevel", "day");

-- CreateIndex
CREATE UNIQUE INDEX "TaskSetConfig_vipLevel_day_setNum_key" ON "TaskSetConfig"("vipLevel", "day", "setNum");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
