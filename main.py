from fastapi import FastAPI
from pydantic import BaseModel

# Inizializziamo l'API con il nome ufficiale della tua IA!
app = FastAPI(title="Solven AI API")

class RichiestaUtente(BaseModel):
    messaggio: str

@app.get("/")
def home():
    return {"stato": "Solven AI è online e pronta su Render!"}

@app.post("/chiedi")
def rispondi_a_utente(dati: RichiestaUtente):
    testo_ricevuto = dati.messaggio
    
    # Questa è la risposta base che dà Solven AI
    risposta_ia = f"Solven AI ha ricevuto il tuo messaggio: '{testo_ricevuto}'"
    
    return {"risposta": risposta_ia}
