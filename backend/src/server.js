require("dotenv").config();
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = require("./app");
app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${PORT}`);
});

