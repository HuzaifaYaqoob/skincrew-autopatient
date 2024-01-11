-- CreateTable
CREATE TABLE "oAuth" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresIn" TEXT NOT NULL,

    CONSTRAINT "oAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oAuth_location_key" ON "oAuth"("location");
