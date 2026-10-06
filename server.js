import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 CONNESSIONE A MONGODB ATLAS
// Sostituisci LA_TUA_STRINGA_ATLAS con la tua connection string
mongoose.connect("LA_TUA_STRINGA_ATLAS", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas connesso"))
.catch(err => console.error("Errore connessione MongoDB:", err));

// 📌 Schema utente
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// 🟣 REGISTRAZIONE
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "Email già registrata" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Errore server" });
    }
});

// 🟢 LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Utente non trovato" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ success: false, message: "Password errata" });
        }

        res.json({
            success: true,
            name: user.name
        });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Errore server" });
    }
});

// 🚀 AVVIO SERVER (Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server attivo su porta ${PORT}`);
});
