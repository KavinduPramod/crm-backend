const { getConnection } = require("../config/db");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendMMS = async (req, res) => {
    try {
        console.log(req.body);
        const connection = await getConnection();
        const currentDate = new Date();
        const currentDateTime = new Date().toISOString();
        const branch_Ids = req.body.bussiness_id;
        const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
        // console.log(formattedDate);
        const scheduleDateTime = req.body.date_time ? req.body.date_time : null;

        const get_Mobile_Num_Query_today_date = `
        SELECT
            customer_master.it_business_entity_id,
            customer_master.phone_number,
            it_business_entity.entity_name
        FROM
            customer_master
            INNER JOIN
            it_business_entity
            ON customer_master.it_business_entity_id = it_business_entity.id
        WHERE
            customer_master.it_business_entity_id IN (?)
    `;
        const get_Mobile_Num_today_date_Result = await connection.query(
            get_Mobile_Num_Query_today_date,
            [branch_Ids]
        );

        console.log("=======================", get_Mobile_Num_today_date_Result);

        const Insert_campain_master = `INSERT INTO campaign_master (
        it_business_master_id,
        campaign_type_id,
        media_link,
        text,
        c_at,
        m_at,
        c_by,
        m_by,
        schedule_date_and_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const Insert_campain_master_result = await connection.query(
            Insert_campain_master,
            [
                req.body.it_business_master_id,
                2,
                req.body.Fire_B_url,
                req.body.text,
                formattedDate,
                formattedDate,
                req.body.user_id,
                req.body.user_id,
                scheduleDateTime
            ]
        );

        const get_campaign_id = `
        SELECT
            campaign_master.id
        FROM
            campaign_master
        WHERE
            campaign_master.c_by = ? AND
            campaign_master.it_business_master_id = ? AND
            campaign_master.text = ?
    `;

        const get_campaign_id_result = await connection.query(get_campaign_id, [
            req.body.user_id,
            req.body.it_business_master_id,
            req.body.text,
        ]);

        console.log("campaign", get_campaign_id_result[0].id);

        const Insert_message = `INSERT INTO messages (
      campaign_master_id,
      it_business_entity_id,
      phone_number,
      cost,
      status,
      c_at,
      c_by,
      m_at,
      m_by,
      schedule_date_and_time
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  for (const item of get_Mobile_Num_today_date_Result) {
      const Insert_message_result = await connection.query(Insert_message, [
          get_campaign_id_result[0].id,
          item.it_business_entity_id,
          item.phone_number,
          req.body.per_cost,
          0,
          formattedDate,
          req.body.user_id,
          formattedDate,
          req.body.user_id,
          scheduleDateTime,
      ]);
  }
  

        for (const item of get_Mobile_Num_today_date_Result) {
            const Insert_message_result = await connection.query(Insert_message, [
                get_campaign_id_result[0].id,
                item.it_business_entity_id,
                item.phone_number,
                req.body.total_cost,
                0,
                formattedDate,
                req.body.user_id,
                formattedDate,
                req.body.user_id,
                scheduleDateTime,
            ]);
        }


        // Update credit_master with balance
        const getBalanceQuery = `SELECT balance FROM credit_master WHERE it_business_master_id = ?`;
        const getBalanceQueryResult = await connection.query(getBalanceQuery, [
            req.body.it_business_master_id,
        ]);
        if (getBalanceQueryResult.length == 0) {
            return 0;
        }
        const totalBalance = Number(getBalanceQueryResult[0].balance); // Convert balance into number type
        const newBalance = totalBalance - req.body.total_cost;

        const updateBalanceQuery = `UPDATE credit_master SET balance = ? WHERE it_business_master_id = ?`;
        const updateBalanceQueryResult = await connection.query(
            updateBalanceQuery,
            [newBalance, req.body.it_business_master_id]
        );
        if (updateBalanceQueryResult.affectedRows === 0) {
            return 0;
        }
        return 1;
    } catch (error) {
        throw new Error("Database query failed");
    }

};

const mmsCost = async (req, res) => {
    const connection = await getConnection();
    try {
        const costQuery = `SELECT sender_profile_id FROM campaign_master WHERE it_business_master_id = ? AND campaign_type_id = 2`;
        const cost = await connection.query(costQuery, [
            req.body.it_business_master_id,
        ]);

        const perCostQuery = `SELECT per_msg_cost FROM sender_profile WHERE id = ?`;
        const perCost = await connection.query(perCostQuery, [
            cost[0].sender_profile_id,
        ]);

        return perCost[0].per_msg_cost;
    } catch (error) {
        throw new Error("Database query failed");
    }
};
module.exports = { sendMMS, mmsCost };