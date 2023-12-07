const { connection } = require("../db");
const nodemailer =  require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  host: 'smtp.live.com',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: ''
  }
});


// const getDebtor = (req, res) => {
//   const { userId, role } = req.query;
//   const { id } = req.params;
//   if (id == undefined || role === undefined || userId === undefined) {
//     res.status(400).json({ msg: "bad request" });
//   } else {
//     if (role == 1) {
//       const query = `select * from notes where id = ${id} and user_id = ${userId}`;
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

const addDebtor = (req, res) => {
  const { name, phone, email, personId } = req.body;
  const session = req.session;
  const userId = session.userId;
  const fullName = session.fullName;
  const role = session.role;
  // console.log(req.session.role);
  if (
    name === undefined ||
    phone === undefined ||
    email === undefined ||
    personId === undefined
  ) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `INSERT INTO debtors (name,user_id,email,pc_img,phone,person_id) 
      VALUES ("${name}","${userId}","${email}"," ","${phone}","${personId}")`;

      connection.query(query, function (err, result) {
        if (err) {
          res.status(500).json({ msg: "error" });
        } else {
          const mailOptions = {
            from: 'dfterdywn2@gmail.com',
            to: email,
            subject: 'إضافة الى دفتر الديون',
            text: `تمت إضافتك الى دفتر ديون ${fullName} بنجاح`
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
        }
      });
    } else {
      res.status(405).json({ msg: "method not allowed" });
    }
  }
};

const updateDebtor = (req, res) => {
  const { id, name, phone, email, personId } = req.body;
  const session = req.session;
  const userId = session.userId;
  const role = session.role;
  if (
    name === undefined ||
    phone === undefined ||
    email === undefined ||
    personId === undefined ||
    id == undefined
  ) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `update debtors set name='${name}', phone='${phone}' , email='${email}' ,pc_img=' ' ,person_id='${personId}'  where id=${id} and user_id=${userId}`;
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

const deleteDebtor = (req, res) => {
  const { id } = req.params;
  const session = req.session;
  const userId = session.userId;
  const role = session.role;
  if (id === undefined || userId === undefined || role === undefined) {
    res.status(400).json({ msg: "bad request" });
  } else {
    if (role == 1) {
      const query = `delete from debtors where id=${id} and user_id=${userId}`;
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
  // getDebtor,
  addDebtor,
  updateDebtor,
  deleteDebtor,
};
