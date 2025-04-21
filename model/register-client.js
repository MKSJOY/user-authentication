import { query } from "../config/database.js";

export default class Client {
  static async createClient(data) {
    const {
      company_id, project_name, building_site, name, father_name, mother_name, date_of_birth, 
      marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number, 
      nid_number, nominees = [],
      present_village, present_post_code, present_police_station, present_district, present_address_1, 
      present_address_2, permanent_village, permanent_post_code, permanent_police_station, 
      permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name, 
      branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment, 
      lottery_number, national_id_file, passport_file, tin_file, photo_file,
    } = data;

    const clientValues = [
      company_id ?? null, project_name ?? null, building_site ?? null, name ?? null, father_name ?? null, 
      mother_name ?? null, date_of_birth ?? null, marriage_anniversary_date ?? null, occupation ?? null, 
      religion ?? null, nationality ?? null, phone_number ?? null, email ?? null, tin_number ?? null, 
      nid_number ?? null, present_village ?? null, present_post_code ?? null, present_police_station ?? null, 
      present_district ?? null, present_address_1 ?? null, present_address_2 ?? null, permanent_village ?? null, 
      permanent_post_code ?? null, permanent_police_station ?? null, permanent_district ?? null, 
      permanent_address_1 ?? null, permanent_address_2 ?? null, account_name ?? null, bank_name ?? null, 
      branch_name ?? null, ac_no ?? null, routing_no ?? null, bkash ?? null, nagad ?? null, rocket ?? null, 
      dutch_bangla ?? null, share ?? null, flat_or_apartment ?? null, lottery_number ?? null, 
      national_id_file ?? null, passport_file ?? null, tin_file ?? null, photo_file ?? null
    ];

    const sql = `
      INSERT INTO clients (
        company_id, project_name, building_site, name, father_name, mother_name, date_of_birth, 
        marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number, 
        nid_number, present_village, present_post_code, present_police_station, present_district, 
        present_address_1, present_address_2, permanent_village, permanent_post_code, permanent_police_station, 
        permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name, 
        branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment, 
        lottery_number, national_id_file, passport_file, tin_file, photo_file
      ) VALUES (${clientValues.map(() => '?').join(', ')});
    `;

    try {
      await query(sql, clientValues);
      const result = await query("SELECT id FROM clients ORDER BY id DESC LIMIT 1");
      const clientId = result[0].id;

      if (nominees.length > 0) {
        const nomineeValues = nominees.map(n => [
          clientId, n.nominee_name ?? null, n.nominee_phone ?? null,
          n.nominee_email ?? null, n.nominee_nid ?? null, n.relation_with_owner ?? null
        ]);
        const nomineeSql = `
          INSERT INTO nominees (client_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner) 
          VALUES ${nomineeValues.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')};
        `;
        await query(nomineeSql, nomineeValues.flat());
      }

      return { success: true, message: "Client and nominees registered successfully" };
    } catch (error) {
      console.error("Query error:", error);
      return { success: false, message: "Error registering client or nominees", error: error.message };
    }
  }

  static async updateClient(id, data) {
    const client = await Client.getClientById(id);
    if (client.length === 0) throw new Error("Client not found");

    const national_id_file = data.national_id_file ?? client[0].national_id_file;
    const passport_file = data.passport_file ?? client[0].passport_file;
    const tin_file = data.tin_file ?? client[0].tin_file;
    const photo_file = data.photo_file ?? client[0].photo_file;

    const sql = `
      UPDATE clients SET 
        company_id = ?, project_name = ?, building_site = ?, name = ?, father_name = ?, mother_name = ?, 
        date_of_birth = ?, marriage_anniversary_date = ?, occupation = ?, religion = ?, nationality = ?, 
        phone_number = ?, email = ?, tin_number = ?, nid_number = ?, present_village = ?, 
        present_post_code = ?, present_police_station = ?, present_district = ?, present_address_1 = ?, 
        present_address_2 = ?, permanent_village = ?, permanent_post_code = ?, permanent_police_station = ?, 
        permanent_district = ?, permanent_address_1 = ?, permanent_address_2 = ?, account_name = ?, 
        bank_name = ?, branch_name = ?, ac_no = ?, routing_no = ?, bkash = ?, nagad = ?, rocket = ?, 
        dutch_bangla = ?, share = ?, flat_or_apartment = ?, lottery_number = ?, 
        national_id_file = ?, passport_file = ?, tin_file = ?, photo_file = ?
      WHERE id = ?;
    `;

    const values = [
      data.company_id ?? null, data.project_name ?? null, data.building_site ?? null, data.name ?? null,
      data.father_name ?? null, data.mother_name ?? null, data.date_of_birth ?? null, 
      data.marriage_anniversary_date ?? null, data.occupation ?? null, data.religion ?? null, 
      data.nationality ?? null, data.phone_number ?? null, data.email ?? null, data.tin_number ?? null,
      data.nid_number ?? null, data.present_village ?? null, data.present_post_code ?? null,
      data.present_police_station ?? null, data.present_district ?? null, data.present_address_1 ?? null,
      data.present_address_2 ?? null, data.permanent_village ?? null, data.permanent_post_code ?? null,
      data.permanent_police_station ?? null, data.permanent_district ?? null, data.permanent_address_1 ?? null,
      data.permanent_address_2 ?? null, data.account_name ?? null, data.bank_name ?? null, data.branch_name ?? null,
      data.ac_no ?? null, data.routing_no ?? null, data.bkash ?? null, data.nagad ?? null, data.rocket ?? null,
      data.dutch_bangla ?? null, data.share ?? null, data.flat_or_apartment ?? null, data.lottery_number ?? null,
      national_id_file ?? null, passport_file ?? null, tin_file ?? null, photo_file ?? null, id,
    ];

    const result = await query(sql, values);

    if (data.nominees && data.nominees.length > 0) {
      await query(`DELETE FROM nominees WHERE client_id = ?`, [id]);
      const nomineeValues = data.nominees.map(n => [
        id, n.nominee_name ?? null, n.nominee_phone ?? null,
        n.nominee_email ?? null, n.nominee_nid ?? null, n.relation_with_owner ?? null
      ]);
      const nomineeSql = `
        INSERT INTO nominees (client_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner) 
        VALUES ${nomineeValues.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')};
      `;
      await query(nomineeSql, nomineeValues.flat());
    }

    return result;
  }

  static async deleteClient(id) {
    await query(`DELETE FROM nominees WHERE client_id = ?`, [id]);
    return query(`DELETE FROM clients WHERE id = ?`, [id]);
  }

  static async getClientById(id) {
    const sql = `
      SELECT c.*, 
        n.id AS nominee_id, n.nominee_name, n.nominee_phone, n.nominee_email, 
        n.nominee_nid, n.relation_with_owner
      FROM clients c
      LEFT JOIN nominees n ON c.id = n.client_id
      WHERE c.id = ?
    `;

    const results = await query(sql, [id]);
    if (results.length === 0) return [];

    const client = { ...results[0], nominees: [] };

    for (const row of results) {
      if (row.nominee_id) {
        client.nominees.push({
          id: row.nominee_id,
          nominee_name: row.nominee_name,
          nominee_phone: row.nominee_phone,
          nominee_email: row.nominee_email,
          nominee_nid: row.nominee_nid,
          relation_with_owner: row.relation_with_owner
        });
      }
    }

    return [client];
  }

  static async getAllClients() {
    const sql = `
      SELECT c.*, 
        n.id AS nominee_id, n.nominee_name, n.nominee_phone, n.nominee_email, 
        n.nominee_nid, n.relation_with_owner
      FROM clients c
      LEFT JOIN nominees n ON c.id = n.client_id
    `;

    const results = await query(sql);
    const clientsMap = new Map();

    for (const row of results) {
      if (!clientsMap.has(row.id)) {
        const { nominee_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner, ...clientData } = row;
        clientsMap.set(row.id, { ...clientData, nominees: [] });
      }

      if (row.nominee_id) {
        clientsMap.get(row.id).nominees.push({
          id: row.nominee_id,
          nominee_name: row.nominee_name,
          nominee_phone: row.nominee_phone,
          nominee_email: row.nominee_email,
          nominee_nid: row.nominee_nid,
          relation_with_owner: row.relation_with_owner
        });
      }
    }

    return Array.from(clientsMap.values());
  }
}
