-- CreateTable
CREATE TABLE "Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "addressIn" TEXT NOT NULL,
    "addressOut" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Statuses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
