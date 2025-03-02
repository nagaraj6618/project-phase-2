const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const grammarChatHistoryRoute = require("./routes/grammarChatHistoryRoute");
const grammarChatDataRoute = require("./routes/grammarChatDataRoute");
const contactRoute = require("./routes/contactRoute");
const aiToolRoute = require("./routes/AIToolRoute");

require("dotenv").config();

const PORT = process.env.PORT || 8000

app.use(cors());
app.use(express.json());
app.use(cors())
//DB connection
function dbConnection () {
   mongoose.connect(process.env.MONGODB_URL)
   .then(()=> console.log('DB Connected'))
   .catch((error)=>console.log('DB not connected:',error));
}
dbConnection();

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/grammar-chat-history",grammarChatHistoryRoute);
app.use("/api/v1/grammar-chat-data",grammarChatDataRoute);
app.use("/api/v1/contact",contactRoute);
app.use("/api/v1/ai",aiToolRoute);

app.get("/",(req,res) => {
   return res.status(200).json({
      message:"Server Running..."
   })
});

app.listen(PORT, () => {
   console.log("Server Started..")
})