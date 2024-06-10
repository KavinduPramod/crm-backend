const { getConnection } = require('../config/db');

//Message Settings
const getMMSProfile = async (req, res) => {
    try {
        const connection = await getConnection();
        const query = `
        SELECT
            sender_profile.profile_name,
            sender_profile.id
        FROM
            it_business_master
            INNER JOIN
            sender_profile
            INNER JOIN
            campaign_master
            ON
                it_business_master.id = campaign_master.it_business_master_id AND
                sender_profile.id = campaign_master.sender_profile_id
        WHERE
            sender_profile.type = 1
        `;
        const result = await connection.query(query);
        return result;
    } catch (err) {
        throw new Error("Database query failed");
    }
}

const getMMSServiceNumber = async (req, res) => {
    try {
        const connection = await getConnection();
        const query = `
        SELECT
            sender_profile.mms_sending_number,
            sender_profile.id
        FROM
            it_business_master
            INNER JOIN
            sender_profile
            INNER JOIN
            campaign_master
            ON
                it_business_master.id = campaign_master.it_business_master_id AND
                sender_profile.id = campaign_master.sender_profile_id
        WHERE
            sender_profile.type = 1
        `;
        const result = await connection.query(query);
        return result;
    }
    catch (err) {
        throw new Error("Database query failed");
    }
}

const getSMSProfile = async (req, res) => {
    try {
        const connection = await getConnection();
        const query = `
        SELECT
            sender_profile.profile_name,
            sender_profile.id
        FROM
            it_business_master
            INNER JOIN sender_profile
            INNER JOIN campaign_master ON it_business_master.id = campaign_master.it_business_master_id
            AND sender_profile.id = campaign_master.sender_profile_id
        WHERE
            sender_profile.type = 2
        `;
        const result = await connection.query(query);
        return result;
    }
    catch (err) {
        console.log("Error", err);
        res.status(500).send("Can't Found Data.");
    }
}

const getWhatsAppProfile = async (req, res) => {
    try {
        const connection = await getConnection();
        const query = `
        SELECT
            sender_profile.profile_name,
            sender_profile.id
        FROM
            it_business_master
            INNER JOIN
            sender_profile
            INNER JOIN
            campaign_master
            ON
                it_business_master.id = campaign_master.it_business_master_id AND
                sender_profile.id = campaign_master.sender_profile_id
        WHERE
            sender_profile.type = 3
        `;
        const result = await connection.query(query);
        return result;
    }
    catch (err) {
        throw new Error("Database query failed");
    }
}

/**
 * Load All Social Media Profile Business Master ID Using
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getPlatform = async (req, res) => {
    try {
        console.log("----------")
        const connection = await getConnection();
        const query = `
        SELECT sm_profiles.name as name,
	    sm_profiles.m_by as m_by, 
	    it_business_entity.entity_name as enity_name
        FROM sm_profiles INNER JOIN it_business_entity ON sm_profiles.it_business_entity_id = it_business_entity.id
        WHERE it_business_entity.it_business_master_id = ?`;
        const result = await connection.query(query,[req.body.id]);
        return result;
    }
    catch (err) {
        throw new Error("Database query failed");
    }
}

//Social Media
const getPlatformName = async (req, res) => {
    try {
        const connection = await getConnection();
        const query = `
        SELECT
            sm_platforms.platform_name,
            sm_platforms.id
        FROM
            sm_platforms
        `;
        const result = await connection.query(query);
        return result;
    }
    catch (err) {
        throw new Error("Database query failed");
    }
}

const getBusinessEntity = async (req, res) => {
    try {
        const connection = await getConnection();
        const query = `
        SELECT
            it_business_entity.entity_name,
            it_business_entity.id
        FROM
            it_business_entity
        `;
        const result = await connection.query(query);
        return result;
    }
    catch (err) {
        throw new Error("Database query failed");
    }
}

//to save Message Settings

const saveMessageSettings = async (req, res) => {
    console.log("gggg", req.body, typeof req.body.sms_mask,
        typeof req.body.mms_profile_id,
        typeof req.body.sms_profile,
        typeof req.body.whatsapp_profile)
    try {
        const connection = await getConnection();
        const query = `insert into it_business_master(
            sms_mask,
            mms_profile_id,
            sms_profile_id,
            whatsapp_profile_id
        )values(?,?,?,?)`;
        const resItBusinessMaster = await connection.query(query, [
            req.body.sms_mask,
            req.body.mms_profile_id,
            req.body.sms_profile,
            req.body.whatsapp_profile
        ]);
    }
    catch (err) {
        throw new Error("Database query failed");
    }
}


/**
 * Save Social Media Profiles Data
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const saveSocialMedia = async (req, res) => {
    console.log("ffff", req.body);
    try {
        const connection = await getConnection();
        const query = `insert into sm_profiles(
            id,
            it_business_entity_id,
            sm_platform_id,
            token,
            name,
            c_at,
            c_by,
            m_at,
            m_by
        ) values (?, ?, ?, ?, ?,?,?,?,?)`;
        const resItBusinessMaster = await connection.query(query, [
            0,
            req.body.business_entity_id,
            req.body.sm_platform_id,
            req.body.token,
            req.body.name,
            req.body.c_at,
            req.body.c_by,
            req.body.m_at,
            req.body.m_by
        ]);
        res.status(200).json({ code: 200, message: 'Successfully saved Social Media profile' });
    } catch (err) {
        throw new Error("Database query failed");
    }
};



module.exports = { getMMSProfile, getMMSServiceNumber, getSMSProfile, getWhatsAppProfile, getPlatform, getBusinessEntity, saveMessageSettings, saveSocialMedia,getPlatformName };