-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "following" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "profilePicture" TEXT NOT NULL DEFAULT 'https://example.com/default-profile-picture.png';
