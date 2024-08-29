const OpenAI = require("openai");
const PDFDocument = require("pdfkit");
const fs = require("fs");
require("dotenv").config();

// Set up OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

// Function to generate text using OpenAI
async function generateLetter(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4", // or any other model you want to use
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content.trim();
}

// Function to create PDF with human handwriting fonts and colors
function createPDF(text, outputPath) {
  const doc = new PDFDocument();

  // Customize font, size, and color to simulate handwriting
  doc
    .font("fonts/Caveat.ttf") // Add your handwriting font file here
    .fontSize(16)
    .fillColor("#000000");

  // Write text into PDF
  doc.text(text, {
    align: "left",
    lineGap: 0.5,
  });

  // Save the PDF
  doc.pipe(fs.createWriteStream(outputPath));
  doc.end();
}

// Main function to generate and save the letter
async function generateAndSaveLetter() {
  const prompt = fs.readFileSync("prompt.txt", "utf8").trim();
  const letter = await generateLetter(prompt);

  const outputPath = "letter.pdf";
  createPDF(letter, outputPath);

  console.log(`Letter saved to ${outputPath}`);
}

generateAndSaveLetter();
