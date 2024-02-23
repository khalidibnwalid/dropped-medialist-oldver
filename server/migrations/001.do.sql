-- Extinsions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--Functions
CREATE OR REPLACE FUNCTION array_diff(array1 ANYARRAY, array2 ANYARRAY)
RETURNS ANYARRAY LANGUAGE SQL IMMUTABLE AS $$
    SELECT COALESCE(ARRAY_AGG(elem), '{}')
    FROM UNNEST(array1) elem
    WHERE elem <> ALL(array2)
$$;

--called like this
--" UPDATE items
--SET tags = array_diff(tags, ARRAY['134c5966-6068-451d-8ad4-4303bb461618', 'fd298772-9e1b-4ddf-9db9-53de536e1014']::varchar[]); "


-- Tables
CREATE TABLE IF NOT EXISTS collections (
    --using uuid
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR NOT NULL UNIQUE,
    cover_path VARCHAR,
    pincode VARCHAR,
    templates JSONB,
    configurations JSONB,
    fav BOOLEAN DEFAULT false,
    trash BOOLEAN DEFAULT false
);

-- Create Items table
CREATE TABLE IF NOT EXISTS items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    poster_path VARCHAR,
    cover_path VARCHAR,
    description TEXT,
    content_fields JSONB [],
    extra_fields JSONB [],
    main_fields JSONB [],
    related VARCHAR [],
    tags VARCHAR [],
    links JSONB [],
    badges JSONB [],
    progress_state JSONB,
    --date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- set the patch and put to also set the date_updated to CURRENT_TIMESTAMP
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    configurations JSONB,
    fav BOOLEAN DEFAULT false NOT NULL,
    trash BOOLEAN DEFAULT false NOT NULL
);

-- Create Items_Images table
CREATE TABLE IF NOT EXISTS items_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_path VARCHAR NOT NULL,
    item_id UUID,
    title VARCHAR,
    description TEXT,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Items table
CREATE TABLE IF NOT EXISTS items_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT,
    group_name VARCHAR
);

