import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// CREATE
export const createReceiptVoucher = async (req, res) => {
  try {
    const {
      voucher_number, date, due_amount, pay_amount, amount_paid_by,
      payment_type, product_name, product_details, supplier_id, schedules
    } = req.body;

    const parsedSchedules = JSON.parse(schedules || "[]");
    const remaining_due = parseFloat(due_amount) - parseFloat(pay_amount);
    const upload_file_path = req.file ? req.file.path : null;
    const receiptVoucherId = uuidv4();

    await query(
      `INSERT INTO receipt_vouchers (id, voucher_number, date, due_amount, pay_amount, amount_paid_by,
        payment_type, remaining_due, product_name, product_details, supplier_id, upload_file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        receiptVoucherId, voucher_number, date, due_amount, pay_amount,
        amount_paid_by, payment_type, remaining_due,
        product_name, product_details, supplier_id, upload_file_path
      ]
    );

    for (const schedule of parsedSchedules) {
      const scheduleId = uuidv4();
      await query(
        `INSERT INTO payment_schedules (id, receipt_voucher_id, installment_no, installment_amount, due_date, amount, money_receipt_no, received_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          scheduleId, receiptVoucherId, schedule.installment_no, schedule.installment_amount,
          schedule.due_date, schedule.amount || null, schedule.money_receipt_no || null,
          schedule.received_amount || null
        ]
      );
    }

    res.status(201).json({ message: "Receipt voucher created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// READ ALL
export const getAllReceiptVouchers = async (req, res) => {
    try {
      const vouchers = await query(`
        SELECT rv.*, c.name AS client_name, c.email, c.phone_number
        FROM receipt_vouchers rv
        LEFT JOIN clients c ON rv.supplier_id = c.id
        ORDER BY rv.created_at DESC
      `);
  
      const enrichedVouchers = await Promise.all(
        vouchers.map(async (voucher) => {
          const schedules = await query(
            `SELECT * FROM payment_schedules WHERE receipt_voucher_id = ? ORDER BY installment_no ASC`,
            [voucher.id]
          );
  
          // Destructure client fields to append them at the end
          const {
            client_name,
            email,
            phone_number,
            ...voucherData
          } = voucher;
  
          return {
            ...voucherData,
            schedules,
            client_name,
            email,
            phone_number
          };
        })
      );
  
      res.json(enrichedVouchers);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
  
  

// READ ONE
export const getReceiptVoucherById = async (req, res) => {
    try {
      const [voucher] = await query(`SELECT * FROM receipt_vouchers WHERE id = ?`, [req.params.id]);
      if (!voucher) return res.status(404).json({ message: "Not found" });
  
      const schedules = await query(
        `SELECT * FROM payment_schedules WHERE receipt_voucher_id = ? ORDER BY installment_no ASC`,
        [req.params.id]
      );
  
      const clientInfo = await query(`
        SELECT name AS client_name, email, phone_number
        FROM clients WHERE id = ?
      `, [voucher.supplier_id]);
  
      const client = clientInfo[0] || {};
  
      res.json({
        ...voucher,
        schedules,
        client_name: client.client_name,
        email: client.email,
        phone_number: client.phone_number
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

// UPDATE
export const updateReceiptVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      voucher_number, date, due_amount, pay_amount, amount_paid_by,
      payment_type, product_name, product_details, supplier_id, schedules
    } = req.body;

    const parsedSchedules = JSON.parse(schedules || "[]");
    const remaining_due = parseFloat(due_amount) - parseFloat(pay_amount);
    const upload_file_path = req.file ? req.file.path : null;

    const [existing] = await query(`SELECT upload_file_path FROM receipt_vouchers WHERE id = ?`, [id]);
    if (!existing) return res.status(404).json({ message: "Voucher not found" });

    if (upload_file_path && existing.upload_file_path) {
      fs.unlink(existing.upload_file_path, (err) => {
        if (err) console.error("File delete error:", err);
      });
    }

    await query(
      `UPDATE receipt_vouchers SET voucher_number = ?, date = ?, due_amount = ?, pay_amount = ?, amount_paid_by = ?,
        payment_type = ?, remaining_due = ?, product_name = ?, product_details = ?, supplier_id = ?, upload_file_path = ?
        WHERE id = ?`,
      [
        voucher_number, date, due_amount, pay_amount, amount_paid_by,
        payment_type, remaining_due, product_name, product_details,
        supplier_id, upload_file_path || existing.upload_file_path, id
      ]
    );

    await query(`DELETE FROM payment_schedules WHERE receipt_voucher_id = ?`, [id]);

    for (const schedule of parsedSchedules) {
      const scheduleId = uuidv4();
      await query(
        `INSERT INTO payment_schedules (id, receipt_voucher_id, installment_no, installment_amount, due_date, amount, money_receipt_no, received_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          scheduleId, id, schedule.installment_no, schedule.installment_amount,
          schedule.due_date, schedule.amount || null, schedule.money_receipt_no || null,
          schedule.received_amount || null
        ]
      );
    }

    res.json({ message: "Receipt voucher updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
export const deleteReceiptVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await query(`SELECT upload_file_path FROM receipt_vouchers WHERE id = ?`, [id]);
    if (!existing) return res.status(404).json({ message: "Voucher not found" });

    await query(`DELETE FROM receipt_vouchers WHERE id = ?`, [id]);

    if (existing.upload_file_path) {
      fs.unlink(existing.upload_file_path, (err) => {
        if (err) console.error("File delete error:", err);
      });
    }

    res.json({ message: "Receipt voucher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
