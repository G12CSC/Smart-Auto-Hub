CREATE TABLE "PasswordResetOTP" (
                                    "id" TEXT PRIMARY KEY,
                                    "email" TEXT NOT NULL,
                                    "otp" TEXT NOT NULL,
                                    "expiresAt" TIMESTAMP NOT NULL,
                                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);