"use strict";

import Realm from "realm";

class Chapter extends Realm.Object {}
Chapter.schema = {
  name: "Chapter",
  properties: {
    mp3: "string?",
    name: "string?",
    isDownloaded: "bool?"
  }
};

class Book extends Realm.Object {}
Book.schema = {
  name: "Book",
  properties: {
    id: "int?",
    name: "string?",
    author: "string?",
    summary: "string?",
    rate: "string?",
    cover: "string?",
    cover_small: "string?",
    book_id: "string?",
    url: "string?",
    media_data: { type: "list", objectType: "Chapter" }
  }
};

export default {
  schema: [ Chapter, Book ],
  schemaVersion: 0
};
