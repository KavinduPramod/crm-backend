const express = require('express')
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const{viewBalance,rechargeBalance,paymentHistory,loadPieChart,transactioRecords} = require('../controller/paymentController');
const { Body } = require('twilio/lib/twiml/MessagingResponse');

const environment = process.env.ENVIRONMENT || 'sandbox';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const endpoint_url = environment === 'sandbox' ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';

async function get_access_token() {
    const auth = `${client_id}:${client_secret}`;
    const data = 'grant_type=client_credentials';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
    };
    
    try {
        const response = await axios.post(`${endpoint_url}/v1/oauth2/token`, data, { headers });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

router.post('/create_order', async (req, res) => {
    if (!req.body.intent || !req.body.amount) {
        res.status(400).send('Missing required fields: amount');
        return;
    }
    try {
        const access_token = await get_access_token();
        const order_data_json = {
            "intent": req.body.intent.toUpperCase(),
            "purchase_units": [{
                "amount": {
                    "currency_code": "USD",
                    "value": req.body.amount
                }
            }]
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        };
        
        const response = await axios.post(`${endpoint_url}/v2/checkout/orders`, order_data_json, { headers });
        res.json({ id: response.data.id });
        console.log("response.data ==> ",response.data);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send(error.message);
    }
});

router.post('/complete_payment', async (req, res) => {
    try {
        const access_token = await get_access_token();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        };

        const response = await axios.post(`${endpoint_url}/v2/checkout/orders/${req.body.order_id}/${req.body.intent}`, {}, { headers });
        console.log("response.data ==> ",response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error completing payment:', error);
        res.status(500).send(error.message);
    }
});

router.post('/credit-transaction', async (req, res) => {    
    try{
    const response = await transactioRecords(req,res);
    if(response == 0){
        res.status(404).json({ "code": 404, "message": "Recharge Unsuccessfull!" });
        return;
    }
    res.status(200).json({ "code": 200, "message": "Recharge Successfull!"});
}
catch (error){
    console.log("Error:", error);
    res.status(500).json({ "code": 500, "message": "Cannnot Recharge Balance", "error": error.message });
}
});


// router.post('/getTotal', async (req, res) => {
//     try {
//         console.log("wewewe..");
//         const response = await axios.get(`https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/shopify_payments/balance.json`, {
//             auth: {
//                 username: process.env.SHOPIFY_API_KEY,
//                 password: process.env.SHOPIFY_API_PASSWORD
//             }
//         });
//         console.log(response);
//         const giftCards = response.data.gift_cards;
//         const totalCreditBalance = giftCards.reduce((total, giftCard) => {
//             return total + parseFloat(giftCard.initial_value);
//         }, 0);

//         res.json({ totalCreditBalance });
//     } catch (error) {
//         console.error("Error:", error);
//     }
// });

//to user recharge amount
router.post("/recharge-balance",async (req,res)=>{
    try{
        const recahrgeBalance = await rechargeBalance(req,res);
        console.log("recahrgeBalance ==> ",recahrgeBalance);
        if(recahrgeBalance == 0){
            res.status(404).json({ "code": 404, "message": "Recharge Unsuccessfull!" });
            return;
        }
        res.status(200).json({ "code": 200, "message": "Recharge Successfull!"});
    }
    catch (error){
        console.log("Error:", error);
        res.status(500).json({ "code": 500, "message": "Cannnot Recharge Balance", "error": error.message });
    }
}) 

//to get balance in payments from credit_master
router.post("/get-balance", async (req, res) => {
    try{
        const getBalanceResult = await viewBalance(req, res);
        console.log("getBalanceResult ==> ",getBalanceResult);
        if(getBalanceResult == 0){
            res.status(404).json({ "code": 404, "message": "Balance Unavailable!" });
            return;
        }
        res.status(200).json({ "code": 200, "message": "Payment Balance Fetched Successfully!", "data": getBalanceResult });
    }
    catch (error){
        console.log("Error:", error);
        res.status(500).json({ "code": 500, "message": "Cannot fetch balance", "error": error.message });
    }
});

//to get payment history in credit_master
router.post("/payment-history", async (req, res) =>{
    try{
        const getPaymentHistory = await paymentHistory(req, res);
        // console.log("getPaymentHistory",getPaymentHistory);
        if(getPaymentHistory == 0){
            res.status(404).json({ "code": 404, "message": "Payment History Unavailable" });
            return;
        }
        res.status(200).json({ "code": 200, "message": "Payment History Fetched Successfully!", "data": getPaymentHistory });
    }
    catch (error){
        console.log("Error:", error);
        res.status(500).json({ "code": 500, "message": "Cannnot fetch payment history", "error": error.message });
    }
})

//to get pie chart data
router.post("/get-pie-chart",async(req,res) => {
    try{
        const getPieChartData= await loadPieChart(req,res);
        // console.log("getPieChartData ",getPieChartData);
        if(getPieChartData == 0){
            res.status(404).json({ "code": 404, "message": "Pie Chart Data Unavailable" });
            return;
        }
        res.status(200).json({ "code": 200, "message": "Pie Chart Data Fetched Successfully!", "data": getPieChartData });
    }
    catch (error){
        console.log("Error:", error);
        res.status(500).json({ "code": 500, "message": "Cannnot fetch pie chart data", "error": error.message });
    }
})

module.exports = router;