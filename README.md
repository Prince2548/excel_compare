📊 Excel Comparison Tool
This tool compares two Excel files (.xlsx or .xls) by their email or phone number and returns the contacts that are unique to the first file. It’s a simple yet powerful tool for managing contact lists and eliminating duplicates from data.

🚀 Features
Upload two Excel files.

Compares email addresses (or phone numbers if email is missing).

Outputs a filtered file in .xlsx format.

Works with Cognism and Vincere contact data, but can be used with any dataset.

🧑‍💻 Technologies Used
Node.js - Backend runtime.

Express.js - Web framework.

Multer - File upload middleware.

xlsx npm - For handling Excel file processing.

Render.com - To deploy the application.

GitHub - For version control and collaboration.

🛠 How to Run Locally
Clone the repository:
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
Navigate to the project folder:

cd YOUR-REPO-NAME
Install dependencies:

npm install
Run the application:

npm start
By default, it will be available at http://localhost:3000/.

Upload Excel files:

Go to http://localhost:3000/ in your browser.

Upload two .xlsx files using the file input fields.

The tool will process the files and give you a filtered Excel file for download.

🌐 Deploying to Render
Push your code to GitHub (if you haven't already).

Create a Render.com account and connect your GitHub.

Create a new Web Service on Render, choosing your repo and setting build/start commands:

Build Command: npm install

Start Command: npm start

Render will deploy your app, and you'll get a live URL (e.g., https://yourapp.onrender.com).

📝 File Formats Supported
Input: .xlsx, .xls files.

Output: .xlsx file containing the filtered contacts.

⚠️ Notes
The comparison is done based on the email field. If email is not available, it will compare by phone number.

The tool uses Multer to handle file uploads and the xlsx npm package to parse and create Excel files.

Ensure that the Excel files are properly formatted with the correct column names (e.g., Email, Phone, First Name, etc.).
