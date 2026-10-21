import fetch from "node-fetch";

export async function solvenChat(req, res) {
    try {
        const { prompt } = req.body;

        // URL del tuo server Python (FastAPI) su Colab
        const PYTHON_URL = "https://TUO-ENDPOINT-PYTHON/chat";

        const response = await fetch(PYTHON_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
