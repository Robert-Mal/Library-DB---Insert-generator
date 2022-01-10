const data = require("./data");
const moment = require("moment");
const randomWords = require("random-words");
const fs = require("fs");

const randomStreet = () => {
  return data.streetNames[Math.floor(Math.random() * data.streetNames.length)];
};

const randomLocation = () => {
  return data.locations[Math.floor(Math.random() * data.locations.length)];
};

const randomFirstName = () => {
  return data.firstNames[Math.floor(Math.random() * data.firstNames.length)];
};

const randomLastName = () => {
  return data.lastNames[Math.floor(Math.random() * data.lastNames.length)];
};

const randomEmailDomain = () => {
  return data.emailDomains[
    Math.floor(Math.random() * data.emailDomains.length)
  ];
};

const randomNationality = () => {
  return data.nationalities[
    Math.floor(Math.random() * data.nationalities.length)
  ];
};

const randomPublisher = () => {
  return data.publishers[Math.floor(Math.random() * data.publishers.length)];
};

const randomBookGenre = () => {
  return data.bookGenres[Math.floor(Math.random() * data.bookGenres.length)];
};

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const generateRandomDate = (start, end) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return moment(date).format("YYYY-MM-DD");
};

const generateRandomDeathDate = (dateOfBirth) => {
  const days = generateRandomNumber(0, 365);
  const months = generateRandomNumber(0, 12);
  const years = generateRandomNumber(25, 120);
  const date = moment(dateOfBirth, "YYYY-MM-DD")
    .add(days, "d")
    .add(months, "m")
    .add(years, "y")
    .format("YYYY-MM-DD");

  return date;
};

const generateRandomISBN = () => {
  let isbn = "";
  isbn += generateRandomNumber(0, 10);
  isbn += "-";
  for (let i = 0; i < 5; i++) {
    isbn += generateRandomNumber(0, 10);
  }
  isbn += "-";
  for (let i = 0; i < 3; i++) {
    isbn += generateRandomNumber(0, 10);
  }
  isbn += "-";
  isbn += generateRandomNumber(0, 10);

  return isbn;
};

const generateRandomISSN = () => {
  let issn = "";
  for (let i = 0; i < 4; i++) {
    issn += generateRandomNumber(0, 10);
  }
  issn += "-";
  for (let i = 0; i < 3; i++) {
    issn += generateRandomNumber(0, 10);
  }
  issn += "X";

  return issn;
};

const generateDateOfReturn = (dateOfBorrow) => {
  const days = generateRandomNumber(0, 365);
  const months = generateRandomNumber(0, 12);
  const date = moment(dateOfBorrow, "YYYY-MM-DD")
    .add(days, "d")
    .add(months, "m")
    .format("YYYY-MM-DD");

  return date;
};

const generateDateOfReturnPenalty = (dateOfBorrow) => {
  const days = generateRandomNumber(32, 365);
  const months = generateRandomNumber(0, 12);
  const date = moment(dateOfBorrow, "YYYY-MM-DD")
    .add(days, "d")
    .add(months, "m")
    .format("YYYY-MM-DD");

  return date;
};

const generatePhoneNumber = () => {
  let number = "";
  for (let i = 0; i < 9; i++) {
    number += generateRandomNumber(0, 10);
  }

  return number;
};

const generateEmail = () => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  length = generateRandomNumber(10, 20);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result += "@" + randomEmailDomain();

  return result;
};

const generatePesel = (date) => {
  pesel = date.replace(/-/g, "");
  pesel = pesel.substring(2);
  for (let i = 0; i < 5; i++) {
    pesel += generateRandomNumber(0, 10);
  }

  return pesel;
};

const generateSequencesCreate = () => {
  const tableNames = [
    "address",
    "author",
    "book",
    "borrow_book",
    "borrow_magazine",
    "borrow_newspaper",
    "magazine",
    "newspaper",
    "penalty",
    "queue_book",
    "queue_magazine",
    "queue_newspaper",
    "user",
  ];

  let createSequence = "";
  tableNames.forEach((name) => {
    createSequence +=
      "DROP SEQUENCE IF EXISTS library." + name + "_id_seq CASCADE;\n";
    createSequence += "CREATE SEQUENCE library." + name + "_id_seq;\n";
    createSequence +=
      "ALTER TABLE library." +
      name +
      " ALTER COLUMN " +
      name +
      "_id SET DEFAULT nextval('library." +
      name +
      "_id_seq');\n";
  });

  return createSequence;
};

const truncateTables = () => {
  const tableNames = [
    "address",
    "author",
    "book",
    "borrow_book",
    "borrow_magazine",
    "borrow_newspaper",
    "magazine",
    "newspaper",
    "penalty",
    "queue_book",
    "queue_magazine",
    "queue_newspaper",
    "user",
  ];

  let createSequence = "";
  tableNames.forEach((name) => {
    createSequence += "TRUNCATE library." + name + " CASCADE;\n";
  });

  return createSequence;
};

const generateAddressInsert = () => {
  let insert =
    "INSERT INTO library.address (address_id, street, house_number, town, postal_code, voivodeship, country) VALUES(";
  insert += "DEFAULT,";
  insert += "'" + randomStreet() + "',";
  insert += "'" + generateRandomNumber(1, 1000) + "',";
  const location = randomLocation();
  insert += "'" + location.town + "',";
  insert += "'" + location.postalCode + "',";
  insert += "'" + location.voivodeship + "',";
  insert += "'Polska'";
  insert += ");";

  return insert;
};

const generateAuthorInsert = () => {
  let insert =
    "INSERT INTO library.author (author_id, first_name, last_name, date_of_birth, date_of_death, nationality) VALUES(";
  insert += "DEFAULT,";
  insert += "'" + randomFirstName() + "',";
  insert += "'" + randomLastName() + "',";
  const dateOfBirth = generateRandomDate(new Date(1200, 0, 1), new Date());
  insert += "'" + dateOfBirth + "',";
  const dateOfDeath = generateRandomDeathDate(dateOfBirth);
  if (moment(dateOfDeath).isAfter(moment(new Date(), "YYYY-MM-DD"))) {
    insert += "null,";
  } else {
    insert += "'" + dateOfDeath + "',";
  }
  insert += "'" + randomNationality() + "');";

  return insert;
};

const generateBookInsert = () => {
  let insert =
    "INSERT INTO library.book (book_id, isbn, title, date_of_publish, publisher, number_of_pages, subject_area, number_of_available_books) VALUES(";
  insert += "DEFAULT,";
  insert += "'" + generateRandomISBN() + "',";
  const title = randomWords({ min: 1, max: 5, join: " " });
  insert += "'" + title.charAt(0).toUpperCase() + title.slice(1) + "',";
  insert += "'" + generateRandomDate(new Date(1900, 0, 1), new Date()) + "',";
  insert += "'" + randomPublisher() + "',";
  insert += "'" + generateRandomNumber(15, 1000) + "',";
  insert += "'" + randomBookGenre() + "',";
  insert += "'" + generateRandomNumber(5, 25) + "');";

  return insert;
};

const generateBookAuthorInsert = (id, numberOfAuthors) => {
  let insert = "INSERT INTO library.book_author (author_id, book_id) VALUES (";
  insert += "'" + generateRandomNumber(1, numberOfAuthors) + "',";
  insert += "'" + id + "');";

  return insert;
};

const generateBorrowBookInsert = (numberOfUsers, numberOfBooks) => {
  let insert =
    "INSERT INTO library.borrow_book (borrow_book_id, date_of_borrow, date_of_return, user_id, book_id) VALUES(";
  insert += "DEFAULT,";
  const date = generateRandomDate(new Date(2015, 0, 1), new Date());
  insert += "'" + date + "',";
  if (Math.random() < 0.1) {
    insert += "null,";
  } else {
    insert += "'" + generateDateOfReturn(date) + "',";
  }
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "',";
  insert += "'" + generateRandomNumber(1, numberOfBooks) + "');";

  return insert;
};

const generateBorrowMagazineInsert = (numberOfUsers, numberOfMagazines) => {
  let insert =
    "INSERT INTO library.borrow_magazine (borrow_magazine_id, date_of_borrow, date_of_return, magazine_id, user_id) VALUES(";
  insert += "DEFAULT,";
  const date = generateRandomDate(new Date(2015, 0, 1), new Date());
  insert += "'" + date + "',";
  if (Math.random() < 0.1) {
    insert += "null,";
  } else {
    insert += "'" + generateDateOfReturn(date) + "',";
  }
  insert += "'" + generateRandomNumber(1, numberOfMagazines) + "',";
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "');";

  return insert;
};

const generateBorrowNewspaperInsert = (numberOfUsers, numberOfNewspapers) => {
  let insert =
    "INSERT INTO library.borrow_newspaper (borrow_newspaper_id, date_of_borrow, date_of_return, newspaper_id, user_id) VALUES(";
  insert += "DEFAULT,";
  const date = generateRandomDate(new Date(2015, 0, 1), new Date());
  insert += "'" + date + "',";
  if (Math.random() < 0.1) {
    insert += "null,";
  } else {
    insert += "'" + generateDateOfReturn(date) + "',";
  }
  insert += "'" + generateRandomNumber(1, numberOfNewspapers) + "',";
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "');";

  return insert;
};

const generateMagazineInsert = () => {
  let insert =
    "INSERT INTO library.magazine (magazine_id, issn, title, date_of_publish, number_of_available_magazines) VALUES (";
  insert += "DEFAULT,";
  insert += "'" + generateRandomISSN() + "',";
  const title = randomWords({ min: 1, max: 3, join: " " });
  insert += "'" + title.charAt(0).toUpperCase() + title.slice(1) + "',";
  insert += "'" + generateRandomDate(new Date(1990, 0, 1), new Date()) + "',";
  insert += "'" + generateRandomNumber(1, 10) + "');";

  return insert;
};

const generateNewspaperInsert = () => {
  let insert =
    "INSERT INTO library.newspaper (newspaper_id, issn, title, date_of_publish, number_of_available_newspapers) VALUES (";
  insert += "DEFAULT,";
  insert += "'" + generateRandomISSN() + "',";
  const title = randomWords({ min: 1, max: 3, join: " " });
  insert += "'" + title.charAt(0).toUpperCase() + title.slice(1) + "',";
  insert += "'" + generateRandomDate(new Date(1990, 0, 1), new Date()) + "',";
  insert += "'" + generateRandomNumber(1, 10) + "');";

  return insert;
};

const generatePenaltyInsert = (numberOfUsers) => {
  let insert =
    "INSERT INTO library.penalty (penalty_id, cost, date_when_added, is_paid, date_when_paid, user_id) VALUES(";
  insert += "DEFAULT,";
  const date = generateRandomDate(
    new Date(2015, 0, 1),
    new Date(moment(new Date()).subtract(32, "d").format())
  );
  const dateWhenPaid = generateDateOfReturnPenalty(date);
  const numberOfDaysBetweenDates = moment(dateWhenPaid, "YYYY-MM-DD").diff(
    date,
    "days"
  );
  insert += "'" + numberOfDaysBetweenDates * 0.5 + "',";
  insert += "'" + date + "',";
  insert += "'true',";
  insert += "'" + dateWhenPaid + "',";
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "');";

  return insert;
};

const generatePenaltyInsertUpdated = (numberOfUsers, number) => {
  let insert =
    "INSERT INTO library.penalty (penalty_id, cost, date_when_added, is_paid, date_when_paid, user_id, borrow_book_id) VALUES(";
  insert += "DEFAULT,";
  const date = generateRandomDate(
    new Date(2015, 0, 1),
    new Date(moment(new Date()).subtract(32, "d").format())
  );
  const dateWhenPaid = generateDateOfReturnPenalty(date);
  const numberOfDaysBetweenDates = moment(dateWhenPaid, "YYYY-MM-DD").diff(
    date,
    "days"
  );
  insert += "'" + numberOfDaysBetweenDates * 0.5 + "',";
  insert += "'" + date + "',";
  insert += "'true',";
  insert += "'" + dateWhenPaid + "',";
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "');";

  return insert;
};

const generateQueueBookInsert = (numberOfUsers, numberOfBooks) => {
  let insert =
    "INSERT INTO library.queue_book (queue_book_id, user_id, book_id) VALUES (";
  insert += "DEFAULT,";
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "',";
  insert += "'" + generateRandomNumber(1, numberOfBooks) + "');";

  return insert;
};

const generateQueueMagazineInsert = (numberOfUsers, numberOfMagazines) => {
  let insert =
    "INSERT INTO library.queue_magazine (queue_magazine_id, user_id, magazine_id) VALUES (";
  insert += "DEFAULT,";
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "',";
  insert += "'" + generateRandomNumber(1, numberOfMagazines) + "');";

  return insert;
};

const generateQueueNewspaperInsert = (numberOfUsers, numberOfNewspapers) => {
  let insert =
    "INSERT INTO library.queue_newspaper (queue_newspaper_id, user_id, newspaper_id) VALUES (";
  insert += "DEFAULT,";
  insert += "'" + generateRandomNumber(1, numberOfUsers) + "',";
  insert += "'" + generateRandomNumber(1, numberOfNewspapers) + "');";

  return insert;
};

const generateUserInsert = (numberOfAdresses, index) => {
  let insert =
    "INSERT INTO library.user (user_id, first_name, last_name, date_of_birth, qr_code_url, phone_number, email, pesel, address_id) VALUES(";
  insert += "DEFAULT,";
  insert += "'" + randomFirstName() + "',";
  insert += "'" + randomLastName() + "',";
  const dateOfBirth = generateRandomDate(
    new Date(1900, 0, 1),
    new Date(2011, 0, 1)
  );
  insert += "'" + dateOfBirth + "',";
  insert += "'https://biblioteka-projekt.pl/qr_code/" + index + "',";
  insert += "'" + generatePhoneNumber() + "',";
  insert += "'" + generateEmail() + "',";
  insert += "'" + generatePesel(dateOfBirth) + "',";
  insert += "'" + generateRandomNumber(1, numberOfAdresses) + "');";

  return insert;
};

const streamAppend = () => {
  const stream = fs.createWriteStream("data.sql", { flags: "a" });

  const numberOfAddresses = 4000;
  const numberOfUsers = 5000;
  const numberOfAuthors = 6000;
  const numberOfBooks = 12000;
  const numberOfMagazines = 3000;
  const numberOfNewspapers = 3000;
  const numberOfBookAuthors = 12000;
  const numberOfBorrowedBooks = 5000;
  const numberOfBorrowedMagazines = 5000;
  const numberOfBorrowedNewspapers = 5000;
  const numberOfBooksInQueue = 2500;
  const numberOfMagazinesInQueue = 2500;
  const numberOfNewspapersInQueue = 2500;

  fs.truncate("data.sql", 0, () => {});

  for (let i = 0; i < numberOfAddresses; i++) {
    stream.write(generateAddressInsert() + "\n");
  }
  for (let i = 0; i < numberOfUsers; i++) {
    stream.write(generateUserInsert(numberOfAddresses, i + 1) + "\n");
  }
  for (let i = 0; i < numberOfAuthors; i++) {
    stream.write(generateAuthorInsert() + "\n");
  }
  for (let i = 0; i < numberOfBooks; i++) {
    stream.write(generateBookInsert() + "\n");
  }
  for (let i = 0; i < numberOfMagazines; i++) {
    stream.write(generateMagazineInsert() + "\n");
  }
  for (let i = 0; i < numberOfNewspapers; i++) {
    stream.write(generateNewspaperInsert() + "\n");
  }
  for (let i = 0; i < numberOfPenalties; i++) {
    stream.write(generatePenaltyInsert(numberOfUsers) + "\n");
  }
  for (let i = 0; i < numberOfBookAuthors; i++) {
    for (let j = 1; j < generateRandomNumber(2, 6); j++) {
      stream.write(generateBookAuthorInsert(i + 1, numberOfAuthors) + "\n");
    }
  }
  for (let i = 0; i < numberOfBorrowedBooks; i++) {
    stream.write(generateBorrowBookInsert(numberOfUsers, numberOfBooks) + "\n");
  }
  for (let i = 0; i < numberOfBorrowedMagazines; i++) {
    stream.write(
      generateBorrowMagazineInsert(numberOfUsers, numberOfMagazines) + "\n"
    );
  }
  for (let i = 0; i < numberOfBorrowedNewspapers; i++) {
    stream.write(
      generateBorrowNewspaperInsert(numberOfUsers, numberOfNewspapers) + "\n"
    );
  }
  for (let i = 0; i < numberOfBooksInQueue; i++) {
    stream.write(generateQueueBookInsert(numberOfUsers, numberOfBooks) + "\n");
  }
  for (let i = 0; i < numberOfMagazinesInQueue; i++) {
    stream.write(
      generateQueueMagazineInsert(numberOfUsers, numberOfMagazines) + "\n"
    );
  }
  for (let i = 0; i < numberOfNewspapersInQueue; i++) {
    stream.write(
      generateQueueNewspaperInsert(numberOfUsers, numberOfNewspapers) + "\n"
    );
  }
};

streamAppend();
