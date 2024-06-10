const { getConnection } = require("../config/db");
const User = require("../models/User");

/**
 * Get User Details Using user_name and password
 * Database Table Names -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getUser = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    const connection = await getConnection();
    const query = `SELECT * FROM it_user_temp WHERE user_name = ? and password = ?`;
    const result = await connection.query(query, [email, password]);
    if (result.length == 0) {
      return 0;
    }
    return result[0];
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Get User Profile Image User ID Using
 * Database Table Names -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getUserProfileImage = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = `SELECT image FROM it_user_temp WHERE id = ?`;
    const result = await connection.query(query, [req.body.id]);
    if (result.length == 0) {
      return 0;
    }
    return result[0];
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Get User Details Using User Name
 * Database Table Names -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getUserDetails = async (req, res) => {
  try {
    let email = req.body.email;
    const connection = await getConnection();
    const query = `SELECT * FROM it_user_temp WHERE user_name = ?`;
    const result = await connection.query(query, [email]);
    if (result.length == 0) {
      return 0;
    }
    return result[0];
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Update Terms And Condition Using User ID
 * Database Table Names -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const approveTermsAndConditions = async (req, res) => {
  try {
    let checkedValue = req.body.terms_condition;
    const connection = await getConnection();
    const query = `update it_user_temp set terms_condition =? where id =?`;
    const result = await connection.query(query, [checkedValue, req.body.id]);
    return result;
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * User Register
 * User Database Tables -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const registerUser = async (req, res) => {
  try {
    const connection = await getConnection();

    const queryEmail = `SELECT * FROM it_user_temp WHERE email = ? OR phone = ?`;
    const resultEmail = await connection.query(queryEmail, [
      req.body.email,
      req.body.tell,
    ]);

    if (resultEmail.length > 0) {
      return 2;
    }

    const query = `insert into it_user_temp(
                        name,user_name,password,phone,phone_verified,
                        email,email_verified,business_type,business_phone,
                        business_email,business_address,status,
                        c_at,c_by,m_at,m_by
                        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await connection.query(query, [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.tell,
      2,
      req.body.email,
      2,
      4,
      "",
      "",
      "",
      1,
      req.body.c_at,
      0,
      req.body.m_at,
      0,
    ]);
    console.log("User data inserted successfully in user register...");

    const query1 = `SELECT * FROM it_user_temp WHERE user_name = ?`;
    const result1 = await connection.query(query1, [req.body.email]);
    if (result1.length == 0) {
      return 0;
    }
    return result1[0];
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Check User Details Using user_name
 * User Database Tables -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const checkEmail = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = `SELECT * FROM it_user_temp WHERE user_name =?`;
    const result = await connection.query(query, [req.body.email]);
    if (result.length == 0) {
      return 0;
    }
    return result[0];
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Update Forget Password
 * User Database Tables -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const forgotPassword = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = `UPDATE it_user_temp SET password = ? WHERE id = ?;`;
    const result = await connection.query(query, [
      req.body.password,
      req.body.id,
    ]);
    if (result.affectedRows === 0) {
      return 0;
    }
    res.status(200);
  } catch {
    throw new Error("Database query failed");
  }
};

/**
 * Add User
 * User Database Tables -> it_user_temp, it_user_master
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const addUser = async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.beginTransaction();

    const queryEmail = `SELECT * FROM it_user_temp WHERE email = ?`;
    const resultEmail = await connection.query(queryEmail, [req.body.email]);
    if (resultEmail.length > 0) {
      await connection.rollback();
      return 1;
    }

    const queryPhone = `SELECT * FROM it_user_temp WHERE phone = ?`;
    const resultPhone = await connection.query(queryPhone, [req.body.phone]);
    if (resultPhone.length > 0) {
      await connection.rollback();
      return 2;
    }

    const addUserQuery = `INSERT INTO it_user_temp(
            it_business_master_id,name,user_name,
            password,phone,phone_verified,
            email,email_verified,business_name,
            business_type,business_phone,business_email,
            business_address,status,
            c_at,c_by,m_at,m_by
            ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `;

    const addUserQueryData = await connection.query(addUserQuery, [
      req.body.it_business_master_id,
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.phone,
      2,
      req.body.email,
      2,
      req.body.business_name,
      4,
      req.body.business_phone,
      req.body.business_email,
      req.body.business_address,
      2,
      req.body.c_at,
      0,
      req.body.m_at,
      0,
    ]);
    if (addUserQueryData.affectedRows === 0) {
      await connection.rollback();
      return 0;
    }
    const itUserTempInsertedId = addUserQueryData.insertId;

    const addUserQueryToItUserMaster = `INSERT INTO it_user_master (
              user_group_id,it_business_master_id,name,phone,phone_verified,email,
              email_verified,user_name,ref_temp_user_id,status,password,c_at,m_at) 
              VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const addUserQueryToItUserMasterData = await connection.query(
      addUserQueryToItUserMaster,
      [
        req.body.user_group_id,
        req.body.it_business_master_id,
        req.body.name,
        req.body.phone,
        2,
        req.body.email,
        2,
        req.body.email,
        itUserTempInsertedId,
        2,
        req.body.password,
        req.body.c_at,
        req.body.m_at,
      ]
    );

    if (addUserQueryToItUserMasterData.affectedRows === 0) {
      await connection.rollback();
      return 0;
    }
    await connection.commit();
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Load All User Group
 * User Database Table it_user_group
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getUserGroups = async (req, res) => {
  try {
    const connection = await getConnection();
    const getUserGroupQuery = `SELECT id , group_name FROM it_user_group`;
    const getUserGroupQueryResult = await connection.query(getUserGroupQuery);

    if (getUserGroupQueryResult.length == 0) {
      return 0;
    }
    return getUserGroupQueryResult;
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Load All User Details Business Master ID Using
 * User Database Table -> it_user_master
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getAddUserDetails = async (req, res) => {
  try {
    const connection = await getConnection();
    const getUserRoleQuery = `SELECT id,user_group_id,name,phone,email FROM it_user_master WHERE it_business_master_id = ?`;
    const getUserRoleQueryResult = await connection.query(getUserRoleQuery, [
      req.body.id,
    ]);
    if (getUserRoleQueryResult.length == 0) {
      return 0;
    }
    return getUserRoleQueryResult;
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Mobile Number Verification Update
 * User Database Table -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const mobileVerify = async (req, res) => {
  try {
    let connection = await getConnection();
    let sql_find = "select * from it_user_temp where id=?";
    const result = await connection.query(sql_find, [req.body.id]);

    if (result.length == 0) {
      return 0;
    }

    let sql_update = `UPDATE it_user_temp
                        SET phone_verified = 1 WHERE id=?`;
    const result_update = await connection.query(sql_update, [req.body.id]);

    if (result_update.affectedRows == 0) {
      return 0;
    }
    return 1;
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * email Verification Update
 * User Database Table -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const emailVerify = async (req, res) => {
  try {
    let connection = await getConnection();
    let sql_find = "select * from it_user_temp where id=?";
    const result = await connection.query(sql_find, [req.body.id]);

    if (result.length == 0) {
      return 0;
    }

    let sql_update = `UPDATE it_user_temp
                        SET email_verified = 1 WHERE id=?`;
    const result_update = await connection.query(sql_update, [req.body.id]);

    if (result_update.affectedRows == 0) {
      return 0;
    }
    return 1;
  } catch (err) {
    throw new Error("Database query failed");
  }
};

/**
 * Update User Details
 * User Database Table -> it_user_temp
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const updateUser = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = `UPDATE it_user_temp
                        SET name = ?, image = ?
                        WHERE id = ?`;
    const result = await connection.query(query, [
      req.body.name,
      req.body.url,
      req.body.id,
    ]);
    // No need to send response here
  } catch (err) {
    throw new Error("Database query failed");
  }
};

// Importing the email transporter and utility function using require
const transporter = require("../config/emailService");
const { sendEmailWithSubject } = require("../config/emailUtils");
/**
 * send email
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const sendEmail = async (req, res) => {
  try {
    // Get data from the request body
    const { recipientEmail, subject, message } = req.body;

    // Call the utility function to send the email
    sendEmailWithSubject(recipientEmail, subject, message, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent successfully" });
      }
    });
  } catch (err) {
    throw new Error("Email send failed");
  }
};

module.exports = {
  getUser,
  getUserProfileImage,
  registerUser,
  mobileVerify,
  emailVerify,
  updateUser,
  approveTermsAndConditions,
  checkEmail,
  forgotPassword,
  addUser,
  getUserGroups,
  getAddUserDetails,
  sendEmail,
};
