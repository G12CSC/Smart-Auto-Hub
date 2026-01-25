CREATE TYPE "StaffRole" AS ENUM ('admin', 'advisor','superadmin');

ALTER TABLE "Admin"
DROP COLUMN "role";


ALTER TABLE "Admin"
    ADD COLUMN "role" "StaffRole" NOT NULL DEFAULT 'admin';

