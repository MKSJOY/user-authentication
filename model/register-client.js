import { query } from "../config/database.js";
import fs from "fs"; // For file deletion

export default class Client {
  // Create a new client
  static async createClient(data, files) {
    const {
      company_id, project_name, building_site, name, father_name, mother_name, date_of_birth, 
      marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number, 
      nid_number, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner, 
      present_village, present_post_code, present_police_station, present_district, present_address_1, 
      present_address_2, permanent_village, permanent_post_code, permanent_police_station, 
      permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name, 
      branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment, 
      lottery_number,
    } = data;

    const national_id_file = files?.national_id_file?.path || null;
    const passport_file = files?.passport_file?.path || null;
    const tin_file = files?.tin_file?.path || null;
    const photo_file = files?.photo_file?.path || null;

    const values = [
      company_id, project_name, building_site, name, father_name, mother_name, date_of_birth, 
      marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number, 
      nid_number, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner, 
      present_village, present_post_code, present_police_station, present_district, present_address_1, 
      present_address_2, permanent_village, permanent_post_code, permanent_police_station, 
      permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name, 
      branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment, 
      lottery_number, national_id_file, passport_file, tin_file, photo_file,
    ];

    const sql = `
      INSERT INTO clients (
        company_id, project_name, building_site, name, father_name, mother_name, date_of_birth, 
        marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number, 
        nid_number, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner, 
        present_village, present_post_code, present_police_station, present_district, present_address_1, 
        present_address_2, permanent_village, permanent_post_code, permanent_police_station, 
        permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name, 
        branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment, 
        lottery_number, national_id_file, passport_file, tin_file, photo_file
      ) VALUES (${values.map(() => '?').join(', ')});
    `;

    return query(sql, values);
  }

  // Update client
  static async updateClient(id, data, files) {
    const client = await Client.getClientById(id);
    if (client.length === 0) throw new Error("Client not found");

    // Keep existing file paths if new files are not uploaded
    const national_id_file = files?.national_id_file?.path || client[0].national_id_file;
    const passport_file = files?.passport_file?.path || client[0].passport_file;
    const tin_file = files?.tin_file?.path || client[0].tin_file;
    const photo_file = files?.photo_file?.path || client[0].photo_file;

    const sql = `
      UPDATE clients 
      SET 
        company_id = ?, project_name = ?, building_site = ?, name = ?, father_name = ?, 
        mother_name = ?, date_of_birth = ?, marriage_anniversary_date = ?, occupation = ?, 
        religion = ?, nationality = ?, phone_number = ?, email = ?, tin_number = ?, 
        nid_number = ?, nominee_name = ?, nominee_phone = ?, nominee_email = ?, nominee_nid = ?, 
        relation_with_owner = ?, present_village = ?, present_post_code = ?, 
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
      data.company_id, data.project_name, data.building_site, data.name, data.father_name, 
      data.mother_name, data.date_of_birth, data.marriage_anniversary_date, data.occupation, 
      data.religion, data.nationality, data.phone_number, data.email, data.tin_number, 
      data.nid_number, data.nominee_name, data.nominee_phone, data.nominee_email, 
      data.nominee_nid, data.relation_with_owner, data.present_village, data.present_post_code, 
      data.present_police_station, data.present_district, data.present_address_1, 
      data.present_address_2, data.permanent_village, data.permanent_post_code, 
      data.permanent_police_station, data.permanent_district, data.permanent_address_1, 
      data.permanent_address_2, data.account_name, data.bank_name, data.branch_name, 
      data.ac_no, data.routing_no, data.bkash, data.nagad, data.rocket, data.dutch_bangla, 
      data.share, data.flat_or_apartment, data.lottery_number, 
      national_id_file, passport_file, tin_file, photo_file, id,
    ];

    return query(sql, values);
  }

  // Delete a client
  static async deleteClient(id) {
    const client = await Client.getClientById(id);
    if (client.length === 0) throw new Error("Client not found");

    ['national_id_file', 'passport_file', 'tin_file', 'photo_file'].forEach(file => {
      if (client[0][file]) {
        try {
          fs.unlinkSync(client[0][file]);
        } catch (error) {
          console.error(`Error deleting file: ${client[0][file]}`);
        }
      }
    });

    const sql = `DELETE FROM clients WHERE id = ?`;
    return query(sql, [id]);
  }

  // Get all clients
  static async getAllClients() {
    const sql = `
      SELECT c.*, comp.name AS company_name 
      FROM clients c 
      JOIN companies comp ON c.company_id = comp.id;
    `;
    return query(sql);
  }

  // Get client by ID
  static async getClientById(id) {
    const sql = `SELECT * FROM clients WHERE id = ?`;
    return query(sql, [id]);
  }
}
