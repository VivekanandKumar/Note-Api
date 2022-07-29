const Notes = require("../models/Note");
const newNote = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newNote = await new Notes({
      title,
      description,
      userId: req.userId,
    });
    await newNote.save();
    return res.json({ message: "New Note Created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const getNotes = async (req, res) => {
  try {
    let limits = req.params.limit;
    const notes = await Notes.find({ userId: req.userId })
      .sort({ updatedOn : -1 })
      .limit(Number(limits));
    return res.status(200).json(notes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const updateNote = async (req, res) => {
  const { title, description } = req.body;
  const noteId = req.params.id;
  const modifiedNote = {
    title,
    description,
    userId: req.UserId,
    updatedOn : Date.now()
  };
  try {
    await Notes.findByIdAndUpdate(noteId, modifiedNote, { new: true });
    return res.json({ message: "Note Modified" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const deleteNote = async (req, res) => {
  const id = req.params.Id;
  try {
    await Notes.findByIdAndRemove(id);
    return res.json({ message: "Note Deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const viewNote = (req, res) => {
  const token = req.cookies.authtoken;
  if (!token) {
    return res.redirect("/user/login");
  }
  return res.render("index", { title: "Homepage", token });
};
module.exports = { newNote, getNotes, updateNote, deleteNote, viewNote };
