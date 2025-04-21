import { query } from "../config/database.js";

export default class Client {
  static async createClient(data) {
    const {
      company_id, project_name, building_site, name, father_name, mother_name, date_of_birth, 
      marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number, 
      nid_number, nominees = [], // Default to empty array if not provided
      present_village, present_post_code, present_police_station, present_district, present_address_1, 
      present_address_2, permanent_village, permanent_post_code, permanent_police_station, 
      permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name, 
      branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment, 
      lottery_number, national_id_file, passport_file, tin_file, photo_file,
    } = data;

    // Prepare client values for insert
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

    // SQL query to insert the client record
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
      // Execute the insert query
      await query(sql, clientValues);

      // Now, get the last inserted client ID (most recent row inserted)
      const result = await query("SELECT id FROM clients ORDER BY id DESC LIMIT 1");
      const clientId = result[0].id;  // Get the last inserted client's ID

      // Proceed with nominee insertion if nominees exist
      if (nominees.length > 0) {
        const nomineeValues = nominees.map(nominee => [
          clientId, 
          nominee.nominee_name ?? null,
          nominee.nominee_phone ?? null,
          nominee.nominee_email ?? null,
          nominee.nominee_nid ?? null,
          nominee.relation_with_owner ?? null
        ]);

        const nomineeSql = `
          INSERT INTO nominees (client_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner) 
          VALUES ${nomineeValues.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')};`;

        await query(nomineeSql, nomineeValues.flat());
      }

      return {
        success: true,
        message: "Client and nominees registered successfully",
      };
    } catch (error) {
      console.error("Query error:", error);
      return {
        success: false,
        message: "Error registering client or nominees",
        error: error.message,
      };
    }
  }

  // Update client with handling for nominees
  static async updateClient(id, data) {
    const client = await Client.getClientById(id);
    if (client.length === 0) throw new Error("Client not found");

    // Keep existing file paths if new ones are not provided
    const national_id_file = data.national_id_file ?? client[0].national_id_file;
    const passport_file = data.passport_file ?? client[0].passport_file;
    const tin_file = data.tin_file ?? client[0].tin_file;
    const photo_file = data.photo_file ?? client[0].photo_file;

    const sql = `
      UPDATE clients 
      SET 
        company_id = ?, project_name = ?, building_site = ?, name = ?, father_name = ?, 
        mother_name = ?, date_of_birth = ?, marriage_anniversary_date = ?, occupation = ?, 
        religion = ?, nationality = ?, phone_number = ?, email = ?, tin_number = ?, 
        nid_number = ?, present_village = ?, present_post_code = ?, 
        present_police_station = ?, present_district = ?, present_address_1 = ?, 
        present_address_2 = ?, permanent_village = ?, permanent_post_code = ?, 
        permanent_police_station = ?, permanent_district = ?, permanent_address_1 = ?, 
        permanent_address_2 = ?, account_name = ?, bank_name = ?, branch_name = ?, 
        ac_no = ?, routing_no = ?, bkash = ?, nagad = ?, rocket = ?, dutch_bangla = ?, 
        share = ?, flat_or_apartment = ?, lottery_number = ?, 
        national_id_file = ?, passport_file = ?, tin_file = ?, photo_file = ?
      WHERE id = ?;
    `;

    const values = [
      data.company_id ?? null, data.project_name ?? null, data.building_site ?? null, data.name ?? null, 
      data.father_name ?? null, data.mother_name ?? null, data.date_of_birth ?? null, data.marriage_anniversary_date ?? null, 
      data.occupation ?? null, data.religion ?? null, data.nationality ?? null, data.phone_number ?? null, 
      data.email ?? null, data.tin_number ?? null, data.nid_number ?? null, data.present_village ?? null, 
      data.present_post_code ?? null, data.present_police_station ?? null, data.present_district ?? null, 
      data.present_address_1 ?? null, data.present_address_2 ?? null, data.permanent_village ?? null, 
      data.permanent_post_code ?? null, data.permanent_police_station ?? null, data.permanent_district ?? null, 
      data.permanent_address_1 ?? null, data.permanent_address_2 ?? null, data.account_name ?? null, 
      data.bank_name ?? null, data.branch_name ?? null, data.ac_no ?? null, data.routing_no ?? null, 
      data.bkash ?? null, data.nagad ?? null, data.rocket ?? null, data.dutch_bangla ?? null, 
      data.share ?? null, data.flat_or_apartment ?? null, data.lottery_number ?? null, 
      national_id_file ?? null, passport_file ?? null, tin_file ?? null, photo_file ?? null, id,
    ];

    const result = await query(sql, values);

    // If nominees are updated, handle nominee updates
    if (data.nominees && data.nominees.length > 0) {
      // Delete existing nominees for this client
      const deleteNomineesSql = `DELETE FROM nominees WHERE client_id = ?`;
      await query(deleteNomineesSql, [id]);

      // Insert updated nominees
      const nomineeValues = data.nominees.map(nominee => [
        id,
        nominee.nominee_name ?? null,  // Ensure these fields are not undefined
        nominee.nominee_phone ?? null,
        nominee.nominee_email ?? null,
        nominee.nominee_nid ?? null,
        nominee.relation_with_owner ?? null
      ]);

      const nomineeSql = `
        INSERT INTO nominees (client_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner) 
        VALUES ${nomineeValues.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')};`;
      
      await query(nomineeSql, nomineeValues.flat());
    }

    return result;
  }

  // Delete a client along with nominees
  static async deleteClient(id) {
    // First delete the nominees for this client
    const deleteNomineesSql = `DELETE FROM nominees WHERE client_id = ?`;
    await query(deleteNomineesSql, [id]);

    // Then delete the client
    const deleteClientSql = `DELETE FROM clients WHERE id = ?`;
    return query(deleteClientSql, [id]);
  }

  // Get all clients along with their nominees
  static async getAllClients() {
    const sql = `
      SELECT c.*, n.id AS nominee_id, n.nominee_name, n.nominee_phone, n.nominee_email, 
             n.nominee_nid, n.relation_with_owner
      FROM clients c
      LEFT JOIN nominees n ON c.id = n.client_id;
    `;
    return query(sql);
  }

  // Get client by ID along with their nominees
  static async getClientById(id) {
    const sql = `
      SELECT c.*, n.id AS nominee_id, n.nominee_name, n.nominee_phone, n.nominee_email, 
             n.nominee_nid, n.relation_with_owner
      FROM clients c
      LEFT JOIN nominees n ON c.id = n.client_id
      WHERE c.id = ?;
    `;
    return query(sql, [id]);
  }
}
