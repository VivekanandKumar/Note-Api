const {
  newNote,
  getNotes,
  updateNote,
  deleteNote,
  viewNote,
} = require("../controllers/noteController");
const auth = require("../middlewares/auth");
const express = require("express");
const noteRouter = express.Router();

noteRouter.post("/", auth, newNote);
noteRouter.post("/notes", auth, getNotes);
noteRouter.patch("/:id", auth, updateNote);
noteRouter.delete("/:Id", auth, deleteNote);
noteRouter.get("/", viewNote);
module.exports = noteRouter;
