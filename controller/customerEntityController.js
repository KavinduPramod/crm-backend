const { getConnection } = require("../config/db");

const addCustomer = async (req, res) => {
  try {
    console.log(req.body);
    const connection = await getConnection();
    const query = `insert into customer_master(
                          id,it_business_entity_id,first_name,last_name,phone_number,whatsapp,email,level,c_at,c_by,m_at,m_by
                        ) values(?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await connection.query(query, [
      0,
      req.body.it_business_entity_id,
      req.body.first_name,
      req.body.last_name,
      req.body.phone_number,
      req.body.whatsapp,
      req.body.email,
      req.body.level,
      req.body.c_at,
      req.body.c_by,
      req.body.m_at,
      req.body.m_by,
    ]);
    return true;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

const importCustomer = async (req, res) => {
  try {
    let dataArray = req.body.data;
    const query = `insert into customer_master(
                              id,it_business_entity_id,first_name,last_name,phone_number,whatsapp,email,level,c_at,c_by,m_at,m_by
                            ) values(?,?,?,?,?,?,?,?,?,?,?,?)`;
    const connection = await getConnection();
    for (const index in dataArray) {
      const obj = dataArray[index];
      const result = await connection.query(query, [
        0,
        req.body.it_business_entity_id,
        obj.FirstName,
        obj.LastName,
        obj.PhoneNumber,
        obj.WhatsApp,
        obj.Email,
        req.body.level,
        req.body.c_at,
        req.body.c_by,
        req.body.m_at,
        req.body.m_by,
      ]);
    }
    return true;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

const getCustomers = async (req, res) => {
    try {
        const connection = await getConnection();
        const query = `
            SELECT it_business_entity.entity_name, COUNT(customer_master.id) AS customer_count
            FROM customer_master
            INNER JOIN it_business_entity ON customer_master.it_business_entity_id = it_business_entity.id
            WHERE it_business_entity.it_business_master_id = ?
            GROUP BY it_business_entity.entity_name;
        `;
        const result = await connection.query(query, [
            req.body.business_master_id,
        ]);
        return result;
    } catch (err) {
        throw new Error("Database query failed");
    }
};

module.exports = { addCustomer, getCustomers, importCustomer };
