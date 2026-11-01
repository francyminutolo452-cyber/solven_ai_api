import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";

// MODELLO USER
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// APP EXPRESS
const app = express();
app.use(express.json());
app.use(cors());

// ROTTA REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Controllo utente esistente
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email già registrata" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva utente
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ success: true, message: "Registrazione completata" });

  } catch (err) {
    console.error("Errore nella registrazione:", err);
    res.status(500).json({ error: "Errore server" });
  }
});

// ROTTA LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utente non trovato" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Password errata" });

    res.json({ success: true, message: "Login effettuato" });

  } catch (err) {
    console.error("Errore nel login:", err);
    res.status(500).json({ error: "Errore server" });
  }
});

// AVVIO SERVER SOLO DOPO CONNESSIONE ATLAS
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });

    console.log("MongoDB Atlas connesso");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server attivo su porta ${PORT}`);
    });

  } catch (err) {
    console.error("Errore connessione MongoDB:", err);
  }
}

startServer();
