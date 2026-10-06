import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Connessione a MongoDB (locale o Atlas)
mongoose.connect("mongodb://localhost:27017/solven_users", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
});

// 🟢 LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

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
});

// 🚀 Avvio server
app.listen(3000, () => {
    console.log("Server attivo su http://localhost:3000");
});
