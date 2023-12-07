const { connection } = require("../db");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "hotmail",
  host: "smtp.live.com",
  port: 587,
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
});

// const getAllDebts = (req, res) => {
//   const { userId, role } = req.query;
//   if (userId === undefined || role === undefined) {
//     res.status(400).json({ msg: "bad request" });
//   } else {
//     if (role == 1) {
//       const query = `select * from notes where user_id = ${userId}`;
//       connection.query(query, function (err, result) {
//         if (err) {
//           res.status(500).json({ msg: "error" });
//         } else {
//           res.status(200).json({ notes: result });
//         }
//       });
//     } else {
//       res.status(405).json({ msg: "method not allowed" });
//     }
//   }
// };

const getDebt = (req, res) => {
  // const { role } = req.body;
  const session = req.session;
  const role = req.session.role;
  const { id } = req.params;
  if (id == undefined || role === undefined) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `select * from debts where debtor_id = ${id}`;
      connection.query(query, function (err, result_1) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          let query =
            "SELECT ( ( SELECT COALESCE(SUM(amount),0) from debts WHERE `type` = 0 && debtor_id = " +
            id +
            ") - ( SELECT COALESCE(SUM(amount),0) from debts WHERE `type` = 1 && debtor_id = " +
            id +
            ')) as "debt" ';
          connection.query(query, function (err, result_2) {
            if (!err) {
              res
                .status(200)
                .json({ debts: result_1, actualDebt: result_2[0].debt });
            } else {
              res.status(500).json({ msg: "error" });
            }
          });
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

const addDebt = (req, res) => {
  const { debtorId, debt, amount, type, debtorEmail } = req.body;
  const session = req.session;
  const role = session.role;
  if (
    debtorId === undefined ||
    debt === undefined ||
    amount === undefined ||
    type === undefined ||
    role === undefined ||
    debtorEmail == undefined
  ) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `insert into debts (debtor_id,debt,amount,type) 
              values (${debtorId},"${debt}",${amount},${type})`;
      connection.query(query, function (err, result) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          let query =
            "SELECT ( ( SELECT COALESCE(SUM(amount),0) from debts WHERE `type` = 0 && debtor_id = " +
            debtorId +
            ") - ( SELECT COALESCE(SUM(amount),0) from debts WHERE `type` = 1 && debtor_id = " +
            debtorId +
            ')) as "debt" ';
          connection.query(query, function (err, result_2) {
            if (!err) {
              const mailOptions = {
                from: 'dfterdywn2@gmail.com',
                to: debtorEmail,
                subject: 'إضافة عملية ',
                text: `تمت أضافة عملية ${ type == 0 ? "دين" : "سداد"} بقيمة ${amount}ر.ي حسابك الحالي ${Math.abs(result_2[0].debt)}ر.ي ${ result_2[0].debt > 0 ? "دين" : `دين على المدين ${session.fullName}`}  المحتوئ: ${debt}`
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(500).json({ msg: "error" });
                  // console.log(error);
                } else {
                  res.status(201).json({ msg: "success" });
                  // console.log('Email sent: ' + info.response);
                }
              });
            } else {
              res.status(500).json({ msg: "error" });
            }
          });
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

const updateDebt = (req, res) => {
  const { id, debt, amount, type } = req.body;
  const session = req.session;
  const role = session.role;
  if (
    debt === undefined ||
    amount === undefined ||
    type === undefined ||
    role === undefined
  ) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `update debts set debt='${debt}',amount=${amount},type=${type} where id=${id}`;
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

const deleteDebt = (req, res) => {
  const { id } = req.params;
  const session = req.session;
  const role = session.role;
  if (id === undefined || role === undefined) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `delete from debts where id=${id}`;
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
  // getAllNotes,
  getDebt,
  addDebt,
  updateDebt,
  deleteDebt,
};
