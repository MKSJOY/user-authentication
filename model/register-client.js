import { query } from "../config/database.js";

export default class Client {
  // Method to create a new client along with multiple nominees, projects, and buildings
  static async createClient(data) {
    const {
      company_id, name, father_name, mother_name, date_of_birth,
      marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number,
      nid_number, nominees = [], project_ids = [], building_ids = [],
      present_village, present_post_code, present_police_station, present_district, present_address_1,
      present_address_2, permanent_village, permanent_post_code, permanent_police_station,
      permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name,
      branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment,
      lottery_number, national_id_file, passport_file, tin_file, photo_file,
    } = data;
  
    const clientValues = [
      company_id ?? null, name ?? null, father_name ?? null, mother_name ?? null, date_of_birth ?? null,
      marriage_anniversary_date ?? null, occupation ?? null, religion ?? null, nationality ?? null,
      phone_number ?? null, email ?? null, tin_number ?? null, nid_number ?? null, present_village ?? null,
      present_post_code ?? null, present_police_station ?? null, present_district ?? null, present_address_1 ?? null,
      present_address_2 ?? null, permanent_village ?? null, permanent_post_code ?? null, permanent_police_station ?? null,
      permanent_district ?? null, permanent_address_1 ?? null, permanent_address_2 ?? null, account_name ?? null,
      bank_name ?? null, branch_name ?? null, ac_no ?? null, routing_no ?? null, bkash ?? null, nagad ?? null,
      rocket ?? null, dutch_bangla ?? null, share ?? null, flat_or_apartment ?? null, lottery_number ?? null,
      national_id_file ?? null, passport_file ?? null, tin_file ?? null, photo_file ?? null
    ];
  
    try {
      // Get the next serial number safely
      const serialResult = await query(`SELECT COALESCE(MAX(serial_no), 0) + 1 AS next_serial FROM clients`);
      const next_serial = serialResult[0]?.next_serial ?? 1;
  
      // Insert the client
      const insertSql = `
        INSERT INTO clients (
          serial_no, company_id, name, father_name, mother_name, date_of_birth,
          marriage_anniversary_date, occupation, religion, nationality, phone_number, email, tin_number,
          nid_number, present_village, present_post_code, present_police_station, present_district,
          present_address_1, present_address_2, permanent_village, permanent_post_code, permanent_police_station,
          permanent_district, permanent_address_1, permanent_address_2, account_name, bank_name,
          branch_name, ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment,
          lottery_number, national_id_file, passport_file, tin_file, photo_file
        ) VALUES (
          ?, ${clientValues.map(() => '?').join(', ')}
        )
      `;
  
      const insertResult = await query(insertSql, [next_serial, ...clientValues]);
      if (insertResult.affectedRows === 0) {
        throw new Error("Client insertion failed.");
      }
  
      // Get the last inserted client ID
      const clientResult = await query("SELECT id FROM clients ORDER BY created_at DESC LIMIT 1");
      const clientId = clientResult[0]?.id;
      if (!clientId) throw new Error("Client ID not found after insert.");
  
      // Insert project associations
      if (Array.isArray(project_ids) && project_ids.length > 0) {
        const projectValues = project_ids.map(pid => [clientId, pid]);
        const projectSql = `
          INSERT INTO client_projects (client_id, project_id)
          VALUES ${projectValues.map(() => '(?, ?)').join(', ')};
        `;
        await query(projectSql, projectValues.flat());
      }
  
      // Insert building associations
      if (Array.isArray(building_ids) && building_ids.length > 0) {
        const buildingValues = building_ids.map(bid => [clientId, bid]);
        const buildingSql = `
          INSERT INTO client_buildings (client_id, building_id)
          VALUES ${buildingValues.map(() => '(?, ?)').join(', ')};
        `;
        await query(buildingSql, buildingValues.flat());
      }
  
      // Insert nominees
      if (Array.isArray(nominees) && nominees.length > 0) {
        const nomineeValues = nominees.map(n => [
          clientId,
          n.nominee_name ?? null,
          n.nominee_phone ?? null,
          n.nominee_email ?? null,
          n.nominee_nid ?? null,
          n.relation_with_owner ?? null
        ]);
  
        const nomineeSql = `
          INSERT INTO nominees (client_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner)
          VALUES ${nomineeValues.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')};
        `;
        await query(nomineeSql, nomineeValues.flat());
      }
  
      return { success: true, message: "Client created successfully", client_id: clientId };
    } catch (error) {
      console.error("Client creation error:", error);
      return { success: false, message: "Client creation failed", error: error.message };
    }
  }
  



  // Method to update an existing client and their nominees
  static async updateClient(id, data) {
    const client = await Client.getClientById(id);
    if (client.length === 0) throw new Error("Client not found");
  
    const national_id_file = data.national_id_file ?? client[0].national_id_file;
    const passport_file = data.passport_file ?? client[0].passport_file;
    const tin_file = data.tin_file ?? client[0].tin_file;
    const photo_file = data.photo_file ?? client[0].photo_file;
  
    // Update client details
    const sql = `
      UPDATE clients SET
        company_id = ?, name = ?, father_name = ?, mother_name = ?,
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
      data.company_id ?? null, data.name ?? null,
      data.father_name ?? null, data.mother_name ?? null, data.date_of_birth ?? null, data.marriage_anniversary_date ?? null,
      data.occupation ?? null, data.religion ?? null, data.nationality ?? null, data.phone_number ?? null, 
      data.email ?? null, data.tin_number ?? null, data.nid_number ?? null, data.present_village ?? null, 
      data.present_post_code ?? null, data.present_police_station ?? null, data.present_district ?? null,
      data.present_address_1 ?? null, data.present_address_2 ?? null, data.permanent_village ?? null, 
      data.permanent_post_code ?? null, data.permanent_police_station ?? null, data.permanent_district ?? null,
      data.permanent_address_1 ?? null, data.permanent_address_2 ?? null, data.account_name ?? null,
      data.bank_name ?? null, data.branch_name ?? null, data.ac_no ?? null, data.routing_no ?? null, 
      data.bkash ?? null, data.nagad ?? null, data.rocket ?? null, data.dutch_bangla ?? null, data.share ?? null,
      data.flat_or_apartment ?? null, data.lottery_number ?? null, national_id_file ?? null, passport_file ?? null,
      tin_file ?? null, photo_file ?? null, id
    ];
  
    const result = await query(sql, values);
  
    // Update serial_no (if needed)
    if (data.serial_no) {
      const serialUpdateSql = `
        UPDATE clients
        SET serial_no = ?
        WHERE id = ?;
      `;
      await query(serialUpdateSql, [data.serial_no, id]);
    }
  
    // Update client-project associations
    if (data.project_ids && data.project_ids.length > 0) {
      // Remove existing project associations
      await query(`DELETE FROM client_projects WHERE client_id = ?`, [id]);
  
      // Insert new project associations
      const projectValues = data.project_ids.map(project_id => [id, project_id]);
      const projectSql = `
        INSERT INTO client_projects (client_id, project_id)
        VALUES ${projectValues.map(() => '(?, ?)').join(', ')};
      `;
      await query(projectSql, projectValues.flat());
    }
  
    // Update client-building associations
    if (data.building_ids && data.building_ids.length > 0) {
      // Remove existing building associations
      await query(`DELETE FROM client_buildings WHERE client_id = ?`, [id]);
  
      // Insert new building associations
      const buildingValues = data.building_ids.map(building_id => [id, building_id]);
      const buildingSql = `
        INSERT INTO client_buildings (client_id, building_id)
        VALUES ${buildingValues.map(() => '(?, ?)').join(', ')};
      `;
      await query(buildingSql, buildingValues.flat());
    }
  
    // Update nominees if provided
    if (data.nominees && data.nominees.length > 0) {
      await query(`DELETE FROM nominees WHERE client_id = ?`, [id]);
      const nomineeValues = data.nominees.map(n => [
        id, n.nominee_name ?? null, n.nominee_phone ?? null, n.nominee_email ?? null, n.nominee_nid ?? null,
        n.relation_with_owner ?? null
      ]);
      const nomineeSql = `
        INSERT INTO nominees (client_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner)
        VALUES ${nomineeValues.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')};
      `;
      await query(nomineeSql, nomineeValues.flat());
    }
  
    return result;
  }

   // Method to delete a client and their nominees
  static async deleteClient(id) {
  // Delete associated nominees
  await query(`DELETE FROM nominees WHERE client_id = ?`, [id]);

  // Delete associated projects and buildings
  await query(`DELETE FROM client_projects WHERE client_id = ?`, [id]);
  await query(`DELETE FROM client_buildings WHERE client_id = ?`, [id]);

  // Finally, delete the client itself
  return query(`DELETE FROM clients WHERE id = ?`, [id]);
 }


  // Method to get a client by ID with their nominees, projects, and buildings
  static async getClientById(id) {
    const sql = `
      SELECT c.*, 
        n.id AS nominee_id, n.nominee_name, n.nominee_phone, n.nominee_email, 
        n.nominee_nid, n.relation_with_owner,
        p.project_id, b.building_id
      FROM clients c
      LEFT JOIN nominees n ON c.id = n.client_id
      LEFT JOIN client_projects p ON c.id = p.client_id
      LEFT JOIN client_buildings b ON c.id = b.client_id
      WHERE c.id = ?;
    `;
    const results = await query(sql, [id]);
    if (results.length === 0) return [];
  
    // Destructure to exclude project_id and building_id from spreading
    const {
      nominee_id, nominee_name, nominee_phone, nominee_email, nominee_nid, relation_with_owner,
      project_id, building_id,
      ...clientData
    } = results[0];
  
    const client = {
      ...clientData,
      nominees: [],
      projects: [],
      buildings: []
    };
  
    const nomineeMap = new Set();
    const projectSet = new Set();
    const buildingSet = new Set();
  
    for (const row of results) {
      // Add nominees without duplicates
      if (row.nominee_id && !nomineeMap.has(row.nominee_id)) {
        client.nominees.push({
          id: row.nominee_id,
          nominee_name: row.nominee_name,
          nominee_phone: row.nominee_phone,
          nominee_email: row.nominee_email,
          nominee_nid: row.nominee_nid,
          relation_with_owner: row.relation_with_owner
        });
        nomineeMap.add(row.nominee_id);
      }
  
      // Add unique projects
      if (row.project_id && !projectSet.has(row.project_id)) {
        client.projects.push(row.project_id);
        projectSet.add(row.project_id);
      }
  
      // Add unique buildings
      if (row.building_id && !buildingSet.has(row.building_id)) {
        client.buildings.push(row.building_id);
        buildingSet.add(row.building_id);
      }
    }
  
    return [client];
  }
  
  

  // Method to get all clients with their nominees, projects, and buildings)
  static async getAllClients() {
    const sql = `
      SELECT c.*, 
        n.id AS nominee_id, n.nominee_name, n.nominee_phone, n.nominee_email, 
        n.nominee_nid, n.relation_with_owner,
        p.project_id, b.building_id
      FROM clients c
      LEFT JOIN nominees n ON c.id = n.client_id
      LEFT JOIN client_projects p ON c.id = p.client_id
      LEFT JOIN client_buildings b ON c.id = b.client_id
      ORDER BY c.id, p.project_id, b.building_id, n.id;
    `;
    
    const results = await query(sql);
    
    const clients = [];
    let currentClient = null;
    let nomineeMap = new Set();
    let projectSet = new Set();
    let buildingSet = new Set();
  
    for (const row of results) {
      if (!currentClient || currentClient.id !== row.id) {
        if (currentClient) {
          clients.push(currentClient);
        }
  
        // Reset sets for the new client
        nomineeMap = new Set();
        projectSet = new Set();
        buildingSet = new Set();
  
        currentClient = {
          id: row.id,
          company_id: row.company_id,
          serial_no: row.serial_no,  // ✅ Add this line
          name: row.name,
          father_name: row.father_name,
          mother_name: row.mother_name,
          date_of_birth: row.date_of_birth,
          marriage_anniversary_date: row.marriage_anniversary_date,
          occupation: row.occupation,
          religion: row.religion,
          nationality: row.nationality,
          phone_number: row.phone_number,
          email: row.email,
          tin_number: row.tin_number,
          nid_number: row.nid_number,
          present_village: row.present_village,
          present_post_code: row.present_post_code,
          present_police_station: row.present_police_station,
          present_district: row.present_district,
          present_address_1: row.present_address_1,
          present_address_2: row.present_address_2,
          permanent_village: row.permanent_village,
          permanent_post_code: row.permanent_post_code,
          permanent_police_station: row.permanent_police_station,
          permanent_district: row.permanent_district,
          permanent_address_1: row.permanent_address_1,
          permanent_address_2: row.permanent_address_2,
          account_name: row.account_name,
          bank_name: row.bank_name,
          branch_name: row.branch_name,
          ac_no: row.ac_no,
          routing_no: row.routing_no,
          bkash: row.bkash,
          nagad: row.nagad,
          rocket: row.rocket,
          dutch_bangla: row.dutch_bangla,
          share: row.share,
          flat_or_apartment: row.flat_or_apartment,
          lottery_number: row.lottery_number,
          national_id_file: row.national_id_file,
          passport_file: row.passport_file,
          tin_file: row.tin_file,
          photo_file: row.photo_file,
          nominees: [],
          projects: [],
          buildings: []
        };
      }
  
      if (row.nominee_id && !nomineeMap.has(row.nominee_id)) {
        currentClient.nominees.push({
          id: row.nominee_id,
          nominee_name: row.nominee_name,
          nominee_phone: row.nominee_phone,
          nominee_email: row.nominee_email,
          nominee_nid: row.nominee_nid,
          relation_with_owner: row.relation_with_owner
        });
        nomineeMap.add(row.nominee_id);
      }
  
      if (row.project_id && !projectSet.has(row.project_id)) {
        currentClient.projects.push(row.project_id);
        projectSet.add(row.project_id);
      }
  
      if (row.building_id && !buildingSet.has(row.building_id)) {
        currentClient.buildings.push(row.building_id);
        buildingSet.add(row.building_id);
      }
    }
  
    if (currentClient) clients.push(currentClient);
  
    return clients;
  }
  

}
