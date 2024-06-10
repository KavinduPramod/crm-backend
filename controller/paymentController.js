const { getConnection } = require("../config/db");

//function for get total balance for it_business_master_id in payment
const viewBalance = async (req, res) => {
  try {
    const connection = await getConnection();
    const getBalanceQuery = `SELECT SUM(balance) AS total_balance , status FROM credit_master WHERE it_business_master_id = ?`;
    const getBalanceQueryResult = await connection.query(getBalanceQuery, [
      req.body.it_business_master_id,
    ]);
    if (getBalanceQueryResult.length == 0) {
      return 0;
    }
    return getBalanceQueryResult;
  } catch (err) {
      throw new Error("Database query failed");
  }
};
//function for get payment history from the credit_transaction table
const paymentHistory = async (req, res) => {
  try {
    const connection = await getConnection();

    //1st query for get id for relevent to the it_business_master_id field
    const getBusinessMasterId = `SELECT id FROM credit_master WHERE it_business_master_id = ?`;
    const getBusinessMasterIdResult = await connection.query(
      getBusinessMasterId,
      [req.body.it_business_master_id]
    );
    if (getBusinessMasterIdResult.length == 0) {
      return 0;
    }

    // Extracting the ids from the result
    const businessMasterIds = getBusinessMasterIdResult.map((row) => row.id);
    console.log("businessMasterIds ==))", businessMasterIds);

    //2nd query for get data from constructing the IN clause dynamically
    const getPaymentHistoryQuery = `
            SELECT id, balance, transaction_date, status 
            FROM credit_transactions 
            WHERE credit_master_id IN (${businessMasterIds
              .map(() => "?")
              .join(", ")})
        `;

    const getPaymentHistoryQueryResult = await connection.query(
      getPaymentHistoryQuery,
      businessMasterIds
    );
    if (getPaymentHistoryQueryResult.length == 0) {
      return 0;
    }
    return getPaymentHistoryQueryResult;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

//function load pie chart using status from credit_transaction table
const loadPieChart = async (req, res) => {
  try {
    const connection = await getConnection();

    //1st query for get id for relevent to the it_business_master_id field
    const getBusinessMasterId = `SELECT id FROM credit_master WHERE it_business_master_id = ?`;
    const getBusinessMasterIdResult = await connection.query(
      getBusinessMasterId,
      [req.body.it_business_master_id]
    );

    //check 1st query run properly
    if (getBusinessMasterIdResult.length == 0) {
      return 0;
    }

    // Extracting the ids from the result
    const businessMasterIds = getBusinessMasterIdResult.map((row) => row.id);
    console.log("businessMasterIds ==))", businessMasterIds);

    //2nd query for getting each status count in credit_transactions table
    const getStatusCountQuery = `SELECT status, COUNT(*) as count FROM credit_transactions WHERE credit_master_id IN (${businessMasterIds
      .map(() => "?")
      .join(", ")}) GROUP BY status`;
    const getStatusCountQueryResult = await connection.query(
      getStatusCountQuery,
      businessMasterIds
    );
    console.log("getStatusCountQueryResult ", getStatusCountQueryResult);

    //check 2nd query run properly
    if (getStatusCountQueryResult.length == 0) {
      return 0;
    }

    // Convert BigInt to number
    const statusCounts = {
      0: 0,
      1: 0,
      2: 0,
    };

    getStatusCountQueryResult.forEach((row) => {
      statusCounts[row.status] = Number(row.count); // Convert BigInt to number
    });

    // console.log("statusCounts: ", statusCounts);
    return statusCounts;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

//function for get credittransaction balance into credit_master balance
const rechargeBalance = async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.beginTransaction();

    //1st query for insert recharge balance into credit_transaction table
    const rechargeBalanceFromTrasactionQuery = `INSERT INTO credit_transactions(balance) VALUES(?) `;
    console.log("req body balance", req.body.balance);
    const rechargeBalanceFromTrasactionQueryData = await connection.query(
      rechargeBalanceFromTrasactionQuery,
      [req.body.balance]
    );

    if (rechargeBalanceFromTrasactionQueryData.affectedRows === 0) {
      await connection.rollback();
      return 0;
    }

    //2nd query for get existing balance from credit master
    const getBalanceQuery = `SELECT balance FROM credit_master WHERE it_business_master_id =?`;
    const getBalanceQueryResult = await connection.query(getBalanceQuery, [
      req.body.it_business_master_id,
    ]);
    if (getBalanceQueryResult.length == 0) {
      return 0;
    }
    const totalBalance = Number(getBalanceQueryResult[0].balance); //convert balance into number type
    const newBalance = totalBalance + req.body.balance;
    console.log("totalBalance ", totalBalance);
    console.log("newBalance ", newBalance);

    //3rd query for update recharge balance credit_master table
    const updateTotalBalance = `UPDATE credit_master SET balance = ? WHERE it_business_master_id = ?`;
    const updateTotalBalanceData = await connection.query(updateTotalBalance, [
      newBalance,
      req.body.it_business_master_id,
    ]);

    if (updateTotalBalanceData.affectedRows === 0) {
      await connection.rollback();
      return 0;
    }
    return 1;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

const transactioRecords = async (req, res) => {
  try {
    const connection = await getConnection();
    const date = new Date();
    let creditMasterId;

    const selectIdQuery = `SELECT id, balance FROM credit_master WHERE it_business_master_id = ?`;
    const selectIdQueryResult = await connection.query(selectIdQuery, [
      req.body.it_business_master_id,
    ]);
    if (selectIdQueryResult.affectedRows === 0) {
      return 0;
    }
    creditMasterId = selectIdQueryResult[0].id;
    const balance = parseFloat(selectIdQueryResult[0].balance);
    const amount = parseFloat(req.body.amount);
    const newBalance = (balance + amount).toFixed(2);

    console.log("balance:", balance);
    console.log("req.body.amount:", req.body.amount);
    console.log("newBalance:", newBalance);

    const getPaymentHistoryQuery = `INSERT INTO credit_transactions(
      credit_master_id, 
      ref_number, 
      receive, 
      paid, 
      balance, 
      transaction_date, 
      updated_date, 
      c_at, 
      c_by, 
      m_at, 
      m_by, 
      status ) 
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?) `;
    const getPaymentHistoryQueryData = await connection.query(
      getPaymentHistoryQuery,
      [
        creditMasterId,
        req.body.id,
        req.body.amount,
        req.body.amount,
        newBalance,
        date,
        date,
        date,
        req.body.user_id,
        date,
        req.body.user_id,
        2,
      ]
    );
    if (getPaymentHistoryQueryData.affectedRows === 0) {
      return 0;
    }
    const updateTotalBalance = `UPDATE credit_master SET 
    balance = ?, 
    transaction_date = ?, 
    m_at = ?, 
    m_by = ? 
    WHERE 
    it_business_master_id = ?`;
    const updateTotalBalanceData = await connection.query(updateTotalBalance, [
      newBalance,
      date,
      date,
      req.body.user_id,
      req.body.it_business_master_id,
    ]);
    if (updateTotalBalanceData.affectedRows === 0) {
      return 0;
    }
  } catch (err) {
    console.log(err);
      throw new Error("Database query failed");
  }
};
module.exports = {
  viewBalance,
  rechargeBalance,
  paymentHistory,
  loadPieChart,
  transactioRecords,
};
