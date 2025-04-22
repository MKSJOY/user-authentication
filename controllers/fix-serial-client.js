import { getClientBySerial, updateClientSerial } from "../model/fix-serial-client.js";

export const fixClientSerial = async (req, res) => {
  try {
    let { from_serial, to_serial } = req.body;
    from_serial = parseInt(from_serial, 10);
    to_serial = parseInt(to_serial, 10);

    if (isNaN(from_serial) || isNaN(to_serial) || from_serial === to_serial) {
      return res.status(400).json({
        message: "'from_serial' and 'to_serial' must be different and valid numbers.",
      });
    }

    const clientToMove = await getClientBySerial(from_serial);
    if (!clientToMove) {
      return res.status(404).json({
        message: `Client not found at serial_no ${from_serial}`,
      });
    }

    // Step 1: Move target to temp serial to avoid unique conflict
    await updateClientSerial(from_serial, -1);

    if (from_serial < to_serial) {
      // Moving down: shift others up
      for (let i = from_serial + 1; i <= to_serial; i++) {
        const exists = await getClientBySerial(i);
        if (exists) {
          await updateClientSerial(i, i - 1);
        }
      }
    } else {
      // Moving up: shift others down
      for (let i = from_serial - 1; i >= to_serial; i--) {
        const exists = await getClientBySerial(i);
        if (exists) {
          await updateClientSerial(i, i + 1);
        }
      }
    }

    // Step 3: Insert target client into final position
    await updateClientSerial(-1, to_serial);

    res.json({
      message: `Client serial rearranged from ${from_serial} to ${to_serial}`,
    });

  } catch (error) {
    console.error("Error in fixClientSerial:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
