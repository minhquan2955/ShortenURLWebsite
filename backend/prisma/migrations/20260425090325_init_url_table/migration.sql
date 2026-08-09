-- CreateTable
CREATE TABLE "Url" (
    "id" UUID NOT NULL,
    "originalURL" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "accessCounter" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);
