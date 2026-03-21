CREATE TABLE "VideoReview" (
                               "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               "title" TEXT NOT NULL,
                               "description" TEXT,
                               "youtubeId" TEXT NOT NULL UNIQUE,
                               "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                               "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);