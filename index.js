import express from "express";
import multer from "multer";
import * as xlsx from 'xlsx';
import {dirname} from "path"
import {fileURLToPath} from "url";

const app = express();
const PORT = 3000;

// Set up EJS
//app.set("view engine", "ejs");

// Static folder
app.use(express.static("public"));

// Multer config
const upload = multer({ dest: "uploads/" });


app.get("/", (req,res)=>{
  res.render("index.ejs");
});

app.post(
  "/submit",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  (req, res) => {
    const file1 = req.files.file1[0];
    const file2 = req.files.file2[0];

    const workbook1 = xlsx.readFile(file1.path);
    const workbook2 = xlsx.readFile(file2.path);

    const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
    const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];

    const cognism = xlsx.utils.sheet_to_json(sheet1);
    const vincere = xlsx.utils.sheet_to_json(sheet2);

    const filteredArray = cognism.filter((obj1) => {
      const index = vincere.findIndex((obj2) => obj2.email === obj1.email);
      return index === -1; // keep only if no match found
    });

    // Clean up uploads
    fs.unlinkSync(file1.path);
    fs.unlinkSync(file2.path);

    // 1. Convert JSON to worksheet
    const worksheet = xlsx.utils.json_to_sheet(jsonData);

    // 2. Create a new workbook and append the worksheet
    const workbook = xlsx.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 3. Write to a file (e.g., output.xlsx)
    xlsx.writeFile(workbook, "filterContact/filteredContact.xlsx");

    res.download("filterContact/filteredContact.xlsx");
  }
);

app.listen(PORT, (req,res)=>{
  console.log(`server running at port ${PORT}`)
})

// const array1 = [
//   { name: "Alice", email: "alice@example.com" },
//   { name: "Bob", email: "bob@example.com" },
//   { name: "Charlie", email: "charlie@example.com" },
// ];

// const array2 = [{ email: "bob@example.com" }, { email: "charlie@example.com" }];

// Remove objects from array1 that have a matching email in array2


//console.log(filteredArray);
