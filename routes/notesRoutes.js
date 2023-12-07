const { Router } = require("express");
const { getAllNotes,getNote, addNote, updateNote,deleteNote} = require("../controllers/notesControlles");
const router = Router();

router.get("/", getAllNotes);
// /notes/id=2?userId=2&role=1
router.get("/id=:id", getNote);
router.post("/", addNote);
router.put("/", updateNote);
router.delete("/", deleteNote);

module.exports = router;
