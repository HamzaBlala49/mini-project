const { Router } = require("express");
const { addDebtor,getDebtor, updateDebtor,deleteDebtor} = require("../controllers/debtorControlles ");
const router = Router();

// /notes/id=2?userId=2&role=1
// router.get("/:id", getDebtor);
router.post("/", addDebtor);
router.put("/", updateDebtor);
router.delete("/:id", deleteDebtor);

module.exports = router;
