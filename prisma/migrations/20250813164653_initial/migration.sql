-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('crosspromo', 'liveops', 'app', 'ads');

-- CreateEnum
CREATE TYPE "public"."MatchType" AS ENUM ('id', 'class');

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "updateIntervalSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "tags" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventLog" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "sessionId" UUID NOT NULL,
    "eventId" TEXT NOT NULL,
    "matchType" "public"."MatchType" NOT NULL,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_apiKey_key" ON "public"."Project"("apiKey");

-- CreateIndex
CREATE INDEX "Project_apiKey_idx" ON "public"."Project"("apiKey");

-- CreateIndex
CREATE INDEX "Event_projectId_idx" ON "public"."Event"("projectId");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "public"."Event"("type");

-- CreateIndex
CREATE INDEX "EventLog_eventId_idx" ON "public"."EventLog"("eventId");

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventLog" ADD CONSTRAINT "EventLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
