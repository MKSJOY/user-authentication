import { query } from "../config/database.js";

// Get client by serial_no
export const getClientBySerial = async (serial_no) => {
    const parsedSerial = Number(serial_no);
    //console.log("Querying for serial_no:", parsedSerial, "type:", typeof parsedSerial);

    const rows = await query(`SELECT * FROM clients WHERE serial_no = ?`, [parsedSerial]);
    //console.log("DB result for serial_no", parsedSerial, rows);

    // Return the first client or null if not found
    return rows && rows.length > 0 ? rows[0] : null;
};

// Get clients from `to_serial` to `from_serial - 1`, descending
export const getClientsInRange = async (to_serial, from_serial) => {
    const [rows] = await query(
        `SELECT * FROM clients WHERE serial_no >= ? AND serial_no < ? ORDER BY serial_no DESC`,
        [to_serial, from_serial]
    );
    return rows;
};

// Update a single client's serial_no
export const updateClientSerial = async (old_serial, new_serial) => {
    try {
        await query(`UPDATE clients SET serial_no = ? WHERE serial_no = ?`, [new_serial, old_serial]);
        //console.log(`Successfully updated serial_no from ${old_serial} to ${new_serial}`);
    } catch (error) {
        console.error(`Error updating serial_no from ${old_serial} to ${new_serial}:`, error);
        throw error;
    }
};

// Insert client into new serial_no (keeping the same UUID)
export const insertClientAtSerial = async (client, id, newSerial) => {
    //console.log(`Inserting client at serial_no: ${newSerial}`);
    try {
        await query(
            `INSERT INTO clients (
                id, serial_no, company_id, project_name, building_site, name, father_name, mother_name,
                date_of_birth, marriage_anniversary_date, occupation, religion, nationality, phone_number,
                email, tin_number, nid_number, present_village, present_post_code, 
                present_police_station, present_district, present_address_1, present_address_2,
                permanent_village, permanent_post_code, permanent_police_station, permanent_district,
                permanent_address_1, permanent_address_2, account_name, bank_name, branch_name,
                ac_no, routing_no, bkash, nagad, rocket, dutch_bangla, share, flat_or_apartment,
                lottery_number, national_id_file, passport_file, tin_file, photo_file
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                newSerial,
                client.company_id,
                client.project_name,
                client.building_site,
                client.name,
                client.father_name,
                client.mother_name,
                client.date_of_birth,
                client.marriage_anniversary_date,
                client.occupation,
                client.religion,
                client.nationality,
                client.phone_number,
                client.email,
                client.tin_number,
                client.nid_number,
                client.present_village,
                client.present_post_code,
                client.present_police_station,
                client.present_district,
                client.present_address_1,
                client.present_address_2,
                client.permanent_village,
                client.permanent_post_code,
                client.permanent_police_station,
                client.permanent_district,
                client.permanent_address_1,
                client.permanent_address_2,
                client.account_name,
                client.bank_name,
                client.branch_name,
                client.ac_no,
                client.routing_no,
                client.bkash,
                client.nagad,
                client.rocket,
                client.dutch_bangla,
                client.share,
                client.flat_or_apartment,
                client.lottery_number,
                client.national_id_file,
                client.passport_file,
                client.tin_file,
                client.photo_file,
            ]
        );
    } catch (error) {
        console.error(`Error inserting client at serial_no ${newSerial}:`, error);
        throw error;
    }
};

// Delete client by serial_no
export const deleteClientBySerial = async (serial_no) => {
    //console.log(`Deleting client at serial_no: ${serial_no}`);
    try {
        await query(`DELETE FROM clients WHERE serial_no = ?`, [serial_no]);
        //console.log(`Client at serial_no ${serial_no} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting client at serial_no ${serial_no}:`, error);
        throw error;
    }
};
