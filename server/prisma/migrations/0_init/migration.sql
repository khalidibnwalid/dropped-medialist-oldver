CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "lists" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR NOT NULL,
    "cover_path" VARCHAR,
    "pincode" VARCHAR,
    "templates" JSONB,
    "configurations" JSONB,
    "fav" BOOLEAN DEFAULT false,
    "trash" BOOLEAN DEFAULT false,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "list_id" UUID,
    "title" VARCHAR NOT NULL,
    "poster_path" VARCHAR,
    "cover_path" VARCHAR,
    "description" TEXT,
    "content_fields" JSONB[],
    "extra_fields" JSONB[],
    "main_fields" JSONB[],
    "related" VARCHAR[],
    "tags" VARCHAR[],
    "links" JSONB[],
    "badges" JSONB[],
    "progress_state" JSONB,
    "date_created" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "configurations" JSONB,
    "fav" BOOLEAN NOT NULL DEFAULT false,
    "trash" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "image_path" VARCHAR NOT NULL,
    "item_id" UUID,
    "title" VARCHAR,
    "description" TEXT,
    "date_created" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_tags" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "list_id" UUID,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "group_name" VARCHAR,

    CONSTRAINT "items_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lists_title_key" ON "lists"("title");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "items_images" ADD CONSTRAINT "items_images_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "items_tags" ADD CONSTRAINT "items_tags_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
