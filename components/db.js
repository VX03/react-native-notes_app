import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userDb = SQLite.openDatabase("db.user");
const noteDb = SQLite.openDatabase("db.note");

export const createUserdb = () =>
	userDb.transaction((tx) => {
		tx.executeSql(
			`CREATE TABLE IF NOT EXISTS user 
            (id INTEGER PRIMARY KEY, 
                username TEXT NOT NULL UNIQUE, 
                password TEXT NOT NULL,
                email TEXT, 
                phone TEXT, 
                address TEXT)`
		);
	});

export const deleteUserdb = () => {
	userDb.transaction((tx) => {
		tx.executeSql(`DROP TABLE user`);
	});
};

export const createNotedb = () => {
	noteDb.transaction((tx) => {
		tx.executeSql(
			`CREATE TABLE IF NOT EXISTS note 
            (
                userid INTEGER,
                title TEXT NOT NULL,
                content TEXT,
                date_edited TEXT,
                password TEXT,
                PRIMARY KEY(userid, title)
            )`
		);
	});
};

export const deleteNotedb = () => {
	noteDb.transaction((tx) => {
		tx.executeSql(`DROP TABLE note`);
	});
};

export const insertNote = (id, title, content, date, password) =>
	new Promise((resolve, reject) => {
		noteDb.transaction((tx) => {
			console.log("ere");
			tx.executeSql(
				`INSERT INTO note(userid, title, content, date_edited, password) VALUES (?,?,?,?,?)`,
				[id, title, content, date, password],
				(tx, results) => {
					console.log(results);
					if (results.rowsAffected > 0) {
						resolve("Insert is successful");
					} else reject("Unable to insert");
				},
				(tx, error) => {
					console.log(error);
					reject("Unable to add note due to similar titles");
				}
			);
		});
	});

export const editNote = (id, title, previousTitle, content, date) =>
	new Promise((resolve, reject) => {
		noteDb.transaction((tx) => {
			tx.executeSql(
				`UPDATE note SET title = ?,
         content = ?, 
         date_edited = ? 
         WHERE userid = ? and title = ?`,
				[title, content, date, id, previousTitle],
				(tx, results) => {
					if (results.rowsAffected == 1) {
						resolve("Note updated successfully!");
					} else reject("Note did not update successfully");
				},
				(tx, error) => {
					console.log(error);
					reject("Title is similar to another note");
				}
			);
		});
	});

export const retrieveNotes = (id, value) =>
	new Promise((resolve, reject) => {
		noteDb.transaction((tx) => {
			tx.executeSql(
				`SELECT * FROM note WHERE userid = ? and title LIKE ? ORDER BY title ASC`,
				[id, `%${value}%`],
				(tx, results) => {
					// console.log(JSON.stringify(results))
					resolve(results.rows._array);
				},
				(tx, error) => {
                    console.log(error)
					reject("Unable to retrieve notes");
				}
			);
		});
	});

export const deleteNote = (id, title) =>
	new Promise((resolve, reject) => {
		noteDb.transaction((tx) => {
			tx.executeSql(
				`DELETE FROM note WHERE userid = ? and title = ?`,
				[id, title],
				(tx, results) => {
					console.log(results);
                    if(results.rowsAffected > 0)
                        resolve('Note deleted')
                    else
                        reject("Unable to delete note")
				},
				(tx, error) => {
                    console.log(error)
                    reject("Unable to delete note")
                }
			)
		});
	});

export const insertUser = (username, password, phone, address, email) =>
	new Promise((resolve, reject) =>
		userDb.transaction((tx) => {
			tx.executeSql(
				`INSERT INTO user(username, password, phone, address, email) VALUES (?,?,?,?,?)`,
				[username, password, phone, address, email],
				(tx, results) => {
					console.log("Results", results.rowsAffected);
					// console.log(results);
					if (results.rowsAffected > 0) {
						resolve("Insert is successful");
					} else reject("Unable to insert");
				},
				(tx, error) => {
					console.log(error);
					reject(
						"There is a similar username /email"
					);
				}
			);
		})
	);

export const retrieveAllUsers = () => {
	userDb.transaction((tx) => {
		tx.executeSql(`SELECT * from user`, [], (tx, results) => {
			//console.log(`get result ${JSON.stringify(results)}`);
		});
	});
};

export const validateUser = (username, password) =>
	new Promise((resolve, reject) => {
		userDb.transaction((tx) => {
			tx.executeSql(
				`SELECT id,username,password from user where username=? and password=?`,
				[username, password],
				(tx, results) => {
					console.log(`get result ${JSON.stringify(results)}`);
					// console.log(results.rows.length)
					if (results.rows.length == 1) {
						return resolve(results.rows._array[0].id);
					} else return reject("Wrong login credentials");
				}
			);
		});
	});

export const retrieveUser = (id) =>
	new Promise((resolve, reject) => {
		// console.log(id)
		userDb.transaction((tx) => {
			tx.executeSql(
				`SELECT * from user WHERE id=?`,
				[id],
				(tx, results) => {
					//console.log(JSON.stringify(results));
					if (results.rows.length == 1)
						resolve(results.rows._array[0]);
					else reject("No user found");
				},
				(tx, error) => {
					console.log(error);
				}
			);
		});
	});

export const editUser = (id, username, phone, address, email) =>
	new Promise((resolve, reject) => {
		userDb.transaction((tx) => {
			tx.executeSql(
				`UPDATE user SET username = ?,
                phone = ?,
                address = ?, 
                email = ? WHERE id = ?`,
				[username, phone, address, email, id],
				(tx, results) => {
					// console.log(results)
					if (results.rowsAffected == 1)
						resolve("Details is updated");
					else reject("No details is edited");
				},
				(tx, error) => {
					// console.log(error)
					reject("There is similar username / email");
				}
			);
		});
	});
