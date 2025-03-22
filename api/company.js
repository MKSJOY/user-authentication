import { companyRoutes } from "../routes/company.js";

export default function handler(req, res) {
  companyRoutes(req, res);  // This will call your existing company route logic
}
