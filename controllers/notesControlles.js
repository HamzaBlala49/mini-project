const { connection } = require("../db");
const getAllNotes = (req, res) => {
  const { userId, role } = req.query;
  if (userId === undefined || role === undefined) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `select * from notes where user_id = ${userId}`;
      connection.query(query, function (err, result) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          res.status(200).json({ notes: result });
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

const getNote = (req, res) => {
  const { userId, role } = req.query;
  const {id} = req.params
  if (id == undefined || role === undefined  || userId === undefined) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `select * from notes where id = ${id} and user_id = ${userId}`;
      connection.query(query, function (err, result) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          res.status(200).json({ notes: result });
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

const addNote = (req, res) => {
  const { title, content, userId, role } = req.body;
  console.log(req.body);
  if (
    title === undefined ||
    content === undefined ||
    userId === undefined ||
    role === undefined
  ) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `insert into notes (title,content,user_id) values ("${title}","${content}",${userId})`;
      connection.query(query, function (err, result) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          res.status(201).json({ msg: "success" });
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

const updateNote = (req, res) => {
  const { id, title, content, userId, role } = req.body;
  if (!id || !title || !content || !userId || !role) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `update notes set title='${title}', content='${content}' where id=${id} and user_id=${userId}`;
      connection.query(query, function (err, result) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          res.status(200).json({ msg: "updated" });
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

const deleteNote = (req, res) => {
  const { id, userId, role } = req.body;
  if (id === undefined || userId === undefined || role === undefined) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `delete from notes where id=${id} and user_id=${userId}`;
      connection.query(query, function (err, result) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          res.status(204).json({ msg: "No content" });
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

module.exports = {
  getAllNotes,
  getNote,
  addNote,
  updateNote,
  deleteNote,
};
