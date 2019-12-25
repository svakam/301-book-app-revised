DROP TABLE IF EXISTS booksrevised;

CREATE TABLE booksrevised
(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(20),
  image_url TEXT,
  description TEXT,
  bookshelf VARCHAR(255)
);