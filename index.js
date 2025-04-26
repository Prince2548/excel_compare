import express from "express";
import multer from "multer";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder
app.use(express.static("public"));

// Multer config
const upload = multer({ dest: "uploads/" });

// GET route
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// POST route with error handling
app.post(
  "/submit",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    try {
      const file1 = req.files.file1[0];
      const file2 = req.files.file2[0];

      const workbook1 = xlsx.readFile(file1.path);
      const workbook2 = xlsx.readFile(file2.path);

      const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
      const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];

      const cognism = xlsx.utils.sheet_to_json(sheet1);
      const vincere = xlsx.utils.sheet_to_json(sheet2);

      const filteredArray = cognism.filter(
        (obj1) => !vincere.some((obj2) => obj2.email === obj1.email)
      );

      // Create new workbook with filtered data
      const worksheet = xlsx.utils.json_to_sheet(filteredArray);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const outputDir = path.join(__dirname, "filterContact");
      const outputPath = path.join(outputDir, "filteredContact.xlsx");

      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      xlsx.writeFile(workbook, outputPath);

      // Clean up uploads
      fs.unlinkSync(file1.path);
      fs.unlinkSync(file2.path);

      res.download(outputPath);
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).send("An error occurred while processing the files.");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
