// const { getConnection } = require('../config/db');
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// // const insert_transaction_sms = async (req, res) => {
// //     try {
// //         const connection = await getConnection();
// //         const query = `INSERT INTO transaction_sms (
// //                 it_business_master_id,
// //                 text,
// //                 status,
// //                 cost
// //             ) VALUES (?, ?, ?, ?)`;
// //         const insert = await connection.query(query, [
// //             req.body.it_business_master_id,
// //             req.body.text,
// //             req.body.status,
// //             req.body.cost
// //         ]);
// //         res.status(200).json({ code: 200, message: 'Successfully saved transaction SMS' });
// //     } catch (error) {
// //         console.error("Error", error);
// //         res.status(500).send("Can't save transaction SMS.");
// //     }
// // }

// const sendSMS = async (req, res) => {
//     try {
//         console.log(req.body);
//         const connection = await getConnection();
//         const currentDate = new Date();
//         const currentDateTime = new Date().toISOString();
//         const branch_Ids = req.body.bussiness_id;
//         const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
//         // console.log(formattedDate);

//         const get_Mobile_Num_Query_today_date = `
//             SELECT
//                 customer_master.it_business_entity_id,
//                 customer_master.phone_number,
//                 it_business_entity.entity_name
//             FROM
//                 customer_master
//                 INNER JOIN
//                 it_business_entity
//                 ON
//                     customer_master.it_business_entity_id = it_business_entity.id
//             WHERE
//                 customer_master.it_business_entity_id IN (?)
//         `;
//         const get_Mobile_Num_today_date_Result = await connection.query(get_Mobile_Num_Query_today_date, [branch_Ids]);

//         console.log("===========");
//         if (formattedDate === req.body.today_date) {
//             console.log("today");
//             console.log("get_Mobile_Num_today_date_Result length", get_Mobile_Num_today_date_Result.length);

//             // Delay function
//             const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//             let counter = 0;
//             for (const item of get_Mobile_Num_today_date_Result) {
//                 counter++;
//                 const items = counter + req.body.text + currentDateTime;
//                 console.log(items, item.phone_number);

//                 if (counter % 10 === 0) {
//                     await delay(1500);
//                     console.log(items, "=========", counter);
//                 }
//                 const message = await client.messages.create({
//                     body: req.body.text, //req.body.text
//                     messagingServiceSid: 'MGd9e3a97c364a381df5026863f5685647',
//                     to: item.phone_number //'+16463187397',
//                 });
//                 console.log(message.sid);
//                 try {
//                     const query = `INSERT INTO transaction_sms (
//                                         it_business_master_id,
//                                         text,
//                                         status,
//                                         cost,
//                                         phone_number,
//                                         c_at,
//                                         c_by,
//                                         m_at,
//                                         m_by,
//                                         sending_date,
//                                         ref_sid,
//                                         type
//                                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//                     const insert = await connection.query(query, [
//                         req.body.it_business_master_id,
//                         req.body.text,
//                         1,
//                         0,
//                         item.phone_number,
//                         formattedDate,
//                         0,
//                         formattedDate,
//                         0,
//                         req.body.scheduled_date,
//                         message.sid,
//                         "SMS Today"
//                     ]);
//                     // res.status(200).json({ code: 200, message: 'Successfully saved transaction SMS' });
//                 } catch (error) {
//                     console.error("Error", error);
//                     res.status(500).send("Can't save transaction SMS.");
//                 }
//             }

//         } else {
//             console.log("scheduled");
//             try {
//                 for (const item of get_Mobile_Num_today_date_Result) {
//                     const query = `INSERT INTO transaction_sms (
//                                         it_business_master_id,
//                                         text,
//                                         status,
//                                         cost,
//                                         phone_number,
//                                         c_at,
//                                         c_by,
//                                         m_at,
//                                         m_by,
//                                         sending_date,
//                                         ref_sid,
//                                         type
//                                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//                     const insert = await connection.query(query, [
//                         req.body.it_business_master_id,
//                         req.body.text,
//                         0,
//                         0,
//                         item.phone_number,
//                         formattedDate,
//                         0,
//                         formattedDate,
//                         0,
//                         req.body.scheduled_date,
//                         "scheduled",
//                         "SMS Sched"

//                     ]);
//                 }
//                 // res.status(200).json({ code: 200, message: 'Successfully saved transaction SMS' });
//             } catch (error) {
//                 console.error("Error", error);
//                 res.status(500).send("Can't save transaction SMS.");
//             }
//         }
//         console.log("===========");

//         const get_Mobile_Num_Query_scheduled_date = `
//         SELECT
//             transaction_sms.id, 
//             transaction_sms.phone_number
//         FROM
//             transaction_sms
//         WHERE
//             transaction_sms.status = 0 AND
//             transaction_sms.sending_date = ?
//         `;
//         const get_Mobile_Num_scheduled_date_Result = await connection.query(get_Mobile_Num_Query_scheduled_date, [formattedDate]);

//         console.log(get_Mobile_Num_scheduled_date_Result);

//         if (get_Mobile_Num_scheduled_date_Result.length > 0) {
//             console.log("Scheduled SMS for today");
//             for (const item of get_Mobile_Num_scheduled_date_Result) {
//                 const message = await client.messages.create({
//                     body: item.text, //req.body.text
//                     messagingServiceSid: 'MGd9e3a97c364a381df5026863f5685647',
//                     to: item.phone_number //'+16463187397'
//                 });
//                 console.log(message.sid);
//             }
//         } else {
//             console.log("No scheduled SMS for today");
//         }
//     } catch (error) {
//         console.error("Error", error);
//         res.status(500).send("Can't send SMS.");
//     }
// };

// module.exports = { sendSMS }; //insert_transaction_sms,