const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const PDFDocument = require("pdfkit");
require("dotenv").config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a letter using OpenAI API
async function generateLetter(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or any other model you want to use
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating text:", error);
  }
}

// Function to create a PDF from the generated text
function createPDF(text, fileName, senderAddress, recipientAddress, date) {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(fileName));

  // Set up font, size, and color for human handwriting effect
  doc
    .font("fonts/SwankyandMooMoo-Regular.ttf") // You need to have a handwriting font in the "fonts" directory
    .fontSize(15)
    .fillColor("#000000"); // You can change color here if you like

  // Add sender's address
  //   doc.text(senderAddress, { align: "left" });

  //   // Add date
  //   doc.moveDown().text(date, { align: "left" });

  //   // Add recipient's address
  //   doc.text(recipientAddress, { align: "right" });

  // Add some space
  doc.moveDown(1);

  // Add the letter body
  doc.text(text);

  // Finalize the PDF
  doc.end();
}

// Function to read the prompt from a file
function readPromptFromFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

// Main function
(async function main() {
  // Define personal details
  const htmlContent = `
<div style="display: flex; justify-content: space-between;">
  <div>
    <p>[Full Name]</p>
    <p>[City, State, ZIP]</p>
    <p>[SSN]</p>
    <p>[Date of Birth]</p>
  </div>
  <div style="text-align: right;">
    <p>[The bureau's address]</p>
    <p>[P.O. Box]</p>
    <p>[City, State, ZIP]</p>
  </div>
</div>
`;
  const date = new Date().toLocaleDateString();

  // Read the prompt from a file
  const prompt = readPromptFromFile(path.join(__dirname, "prompt.txt"));

  // Generate the letter
  const letterText = await generateLetter(prompt);

  // Create a PDF with the generated text
  createPDF(letterText, "output_letter.pdf", htmlContent, date);

  console.log("PDF created successfully.");
})();
