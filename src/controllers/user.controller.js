const db = require("../db");

class UserController {
  async createUser(req, res) {
    const { nickname, email, registered, status } = req.body;
    let registeredDateArray = registered.split(".");
    const registeredTimeStamp = new Date(
      registeredDateArray[2],
      registeredDateArray[1] - 1,
      registeredDateArray[0]
    ).getTime();
    const newPerson = await db.query(
      "INSERT INTO gamers (nickname, email, registered, status) values ($1, $2, $3, $4) RETURNING *",
      [nickname, email, registeredTimeStamp / 1000, status]
    );
    res.json(newPerson);
  }
  async getUsers(req, res) {
    const users = await db.query("SELECT * from gamers");
    res.json(users.rows);
  }
  async getUsersOnline(req, res) {
    const users = await db.query("SELECT * from gamers where status='on'");
    res.json(users.rows);
  }
  async getOneUser(req, res) {
    const id = req.params.id;
    console.log(id);
    const user = await db.query("SELECT * from gamers where id=$1", [id]);
    res.json(user.rows[0]);
  }
  async updateUser(req, res) {
    const { nickname, email, registered, status, id } = req.body;
    let registeredDateArray = registered.split(".");
    const registeredTimeStamp = new Date(
      registeredDateArray[2],
      registeredDateArray[1] - 1,
      registeredDateArray[0]
    ).getTime();
    const user = await db.query(
      "UPDATE gamers set nickname=$1, email=$2, registered=$3, status=$4 where id=$5 RETURNING *",
      [nickname, email, registeredTimeStamp / 1000, status, id]
    );
    res.json(user.rows[0]);
  }
  async deleteUser(req, res) {
    const id = req.params.id;
    const user = await db.query("DELETE from gamers where id=$1", [id]);
    res.json(user.rows[0]);
  }
}

module.exports = new UserController();
