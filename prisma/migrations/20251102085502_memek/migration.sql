-- CreateEnum
CREATE TYPE "CompetitionCategory" AS ENUM ('SUMO', 'SOCCER');

-- CreateEnum
CREATE TYPE "RoleParticipant" AS ENUM ('MEMBER', 'LEADER');

-- CreateEnum
CREATE TYPE "BracketType" AS ENUM ('GROUP', 'UPPER', 'LOWER', 'GRAND_FINAL');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'SCHEDULED', 'ONGOING', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Participant" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "role" "RoleParticipant" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Team" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "twibbon" TEXT NOT NULL,
    "invoice" TEXT NOT NULL,
    "resetToken" TEXT,
    "category" "CompetitionCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Team_resetToken_key" ON "Team"("resetToken");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
