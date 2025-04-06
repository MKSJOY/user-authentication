import { getUsersForCompany } from '../models/company.js';

const handleGetUsersForCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    const users = await getUsersForCompany(companyId);
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
