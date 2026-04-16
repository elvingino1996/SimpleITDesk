import "dotenv/config";
import express from "express";
import cors from "cors";
import { appendRow, getRows } from "./sheets.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

const EMPLOYEE_RANGE = "Employees!A:K";

function toEmployeeObject(row = []) {
  return {
    empCode: row[0] ?? "",
    name: row[1] ?? "",
    team: row[2] ?? "",
    email: row[3] ?? "",
    phone: row[4] ?? "",
    manager: row[5] ?? "",
    joinDate: row[6] ?? "",
    lastWorkingDate: row[7] ?? "",
    status: row[8] ?? "",
    reason: row[9] ?? "",
    remarks: row[10] ?? "",
  };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/employees", async (_req, res) => {
  try {
    const rows = await getRows(EMPLOYEE_RANGE);
    if (rows.length <= 1) {
      return res.json([]);
    }

    const employees = rows.slice(1).map(toEmployeeObject);
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to read employees from Google Sheets",
      details: error.message,
    });
  }
});

app.post("/employees", async (req, res) => {
  const {
    empCode,
    name,
    team,
    email,
    phone,
    manager,
    joinDate,
    lastWorkingDate,
    status,
    reason,
    remarks,
  } = req.body;

  if (!empCode || !name || !email || !status) {
    return res.status(400).json({
      error: "empCode, name, email, and status are required",
    });
  }

  try {
    await appendRow(EMPLOYEE_RANGE, [
      empCode,
      name,
      team || "",
      email,
      phone || "",
      manager || "",
      joinDate || "",
      lastWorkingDate || "",
      status,
      reason || "",
      remarks || "",
    ]);

    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to write employee to Google Sheets",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`SimpleITDesk backend listening on http://localhost:${port}`);
});
