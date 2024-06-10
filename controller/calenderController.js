const { getConnection } = require("../config/db");

const events = async (req, res) => {
    try {
        const connection = await getConnection();
        const get_events = `
        SELECT
            campaign_master.text AS title,
            campaign_master.schedule_date_and_time AS start
        FROM
            campaign_master
        WHERE
            campaign_master.it_business_master_id = ?
        `;
        const results = await connection.query(get_events, [req.body.it_business_master_id]);
        // console.log(req.body);
        res.json(results);
        // console.log(results);
    } catch (error) {
        console.error("Error", error);
        res.status(500).send("Can't fetch events.");
    }
};

module.exports = { events };
