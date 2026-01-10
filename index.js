const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PAGE_TOKEN = EAAMHx9ILwh0BQfxJbqUrLCax75wEjXhcSwZCE2JCJeuZAbfMZBjhj7U2wssXyTKjt0fOCR6dz2ijmIuoS2HNvlcjD984ZAqZCPy65G9VkcqVyYDFJ4BBcaVDcanpOeOyfXi8ZAeaiqpW8EMsOUfDwNN5O7bYZBJERGDaoUy4Co4qA3iorZCMy4Iq4XPJUiWgsxCW2GuXHwZDZD;
const VERIFY_TOKEN = my_verify_token;

// Webhook verify
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Receive message
app.post("/webhook", (req, res) => {
  const entry = req.body.entry[0];
  const messaging = entry.messaging[0];

  if (!messaging.message) return res.sendStatus(200);

  const senderId = messaging.sender.id;
  const text = messaging.message.text?.toLowerCase() || "";

  let mainReply = "আপনার মেসেজটি আমরা পেয়েছি। খুব দ্রুত রিপ্লাই দেওয়া হবে ইনশাআল্লাহ।";

  if (text.includes("hi") || text.includes("hello") || text.includes("salam")) {
    mainReply = "কিভাবে সাহায্য করতে পারি?";
  } 
  else if (text.includes("price") || text.includes("dam")) {
    mainReply = "দয়া করে বলুন আপনি কোন সার্ভিসের দাম জানতে চান।";
  } 
  else if (text.includes("help") || text.includes("support")) {
    mainReply = "আমাদের টিম খুব দ্রুত আপনার সাথে যোগাযোগ করবে ইনশাআল্লাহ।";
  } 
  else if (text.includes("order")) {
    mainReply = "অর্ডার করতে চাইলে আপনার নাম ও ঠিকানা লিখুন।";
  }

  // পুরো রিপ্লাই তৈরি
  const finalReply = 
`আসসালামু আলাইকুম 🌸

${mainReply}

🌼 আপনার দিনটি শুভ হোক 🌼`;

  sendMessage(senderId, finalReply);
  res.sendStatus(200);
});

// Send message function
function sendMessage(senderId, message) {
  axios.post(
    `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_TOKEN}`,
    {
      recipient: { id: senderId },
      message: { text: message }
    }
  );
}

app.listen(3000, () => console.log("Bot running on port 3000"));
