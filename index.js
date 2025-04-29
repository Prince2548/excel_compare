import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { readFile, utils, writeFile } = xlsx; 
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder
app.use(express.static("public"));

// Multer config
const upload = multer({ dest: "uploads/" });

// GET routecd
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

      const workbook1 = readFile(file1.path);
      const workbook2 = readFile(file2.path);

      const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
      const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];

      const cognism = utils.sheet_to_json(sheet1);
      const vincere = utils.sheet_to_json(sheet2);

      const vincereEmails = new Set(
        vincere.map((obj) => obj.email).filter((email) => !!email)
      );
      const vincerePhones = new Set(
        vincere.map((obj) => obj.phone).filter((phone) => !!phone)
      );

      const filteredArray = cognism.filter((obj1) => {
        if (obj1.Email) {
          return !vincereEmails.has(obj1.Email);
        } else if (obj1.Mobile) {
          return !vincerePhones.has(obj1.Mobile);
        } else {
          return true;
        }
      });

      // const filteredArray = cognism.filter(
      //   (obj1) => !vincere.some((obj2) => obj2.email === obj1.email)
      // );

      // Create new workbook with filtered data

      const headers = [
        "contact-companyId",
        "contact-externalId",
        "contact-lastName",
        "contact-middleName",
        "contact-firstName",
        "contact-email",
        "contact-phone",
        "contact-jobTitle",
        "contact-linkedin",
      ];

      const vincereFormat = filteredArray.map((obj) => ({
        "contact-companyId": "",
        "contact-externalId": obj["Profile ID"] || "",
        "contact-lastName": obj["Last Name"] || "",
        "contact-middleName": "",
        "contact-firstName": obj["First Name"] || "",
        "contact-email": obj.Email || "",
        "contact-phone": obj.Mobile || "",
        "contact-jobTitle": obj["Job Title"] || "",
        "contact-linkedin": obj["Personal Linkedin URL"] || "",
      }));


      const worksheet = utils.json_to_sheet(vincereFormat, {
        header: headers,
      });

      // const worksheet = utils.json_to_sheet(vincereFormat, { header: headers });

      // Convert worksheet to CSV string
      const csvData = utils.sheet_to_csv(worksheet);

      const outputDir = path.join(__dirname, "filterContact");
      const outputPath = path.join(outputDir, "filteredContact.csv");

      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write CSV string to a file
      fs.writeFileSync(outputPath, csvData);

      // const csvData = utils.sheet_to_csv(worksheet);

      // const outputDir = path.join(__dirname, "filterContact");
      // const outputPath = path.join(outputDir, "filteredContact.csv");

      // // Ensure output directory exists
      // if (!fs.existsSync(outputDir)) {
      //   fs.mkdirSync(outputDir, { recursive: true });
      // }

      // writeFile(workbook, outputPath);

      // Clean up uploads
      fs.unlinkSync(file1.path);
      fs.unlinkSync(file2.path);

      res.download(outputPath, (err) => {
        if (err) {
          console.log(err);
        }
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).send("An error occurred while processing the files.");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
