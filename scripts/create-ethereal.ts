import nodemailer from "nodemailer";

async function main() {
  const testAccount = await nodemailer.createTestAccount();
  console.log("Ethereal account:", testAccount);
}

main().catch(console.error);
