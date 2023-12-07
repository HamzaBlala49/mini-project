const { Router } = require("express");
const {addDebt,deleteDebt,updateDebt,getDebt} = require("../controllers/debtControlles");
const router = Router();

// router.get("/", getAllNotes);
// /notes/id=2?userId=2&role=1
router.get("/:id", getDebt);
router.post("/", addDebt);
router.put("/", updateDebt);
router.delete("/:id", deleteDebt);

module.exports = router;
