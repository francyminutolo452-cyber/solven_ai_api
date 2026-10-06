from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Solven AI Engine")

# Rilascia i permessi di sicurezza CORS per permettere a GitHub Pages di parlare liberamente con Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Struttura dati pulita per ricevere i messaggi dall'applicazione
class RichiestaUtente(BaseModel):
    messaggio: str
    versione_ia: str = "solven-2.5"
    nome_utente: str = "Francesco"

@app.get("/")
def home():
    return {"stato": "Il motore logico di Solven AI è online e operativo!"}

@app.post("/chiedi")
def rispondi_a_utente(dati: RichiestaUtente):
    testo = dati.messaggio
    modello = dati.versione_ia
    nome = dati.nome_utente
    
    # Risposta del modello logico
    if modello == "solven-1.5":
        risposta_finale = f"[Solven-1.5 Lite]: Ciao {nome}, elaborazione rapida in corso per la tua richiesta: '{testo}'"
    elif modello == "solven-3.5":
        risposta_finale = f"[Solven-3.5 Plus ✨]: Ciao {nome}, analisi avanzata attiva. Ragionamento profondo applicato a: '{testo}'"
    elif modello == "solven-4.5":
        risposta_finale = f"[Solven-4.5 Pro 🔥]: Ciao {nome}, potenza massima del network abilitata per l'obiettivo: '{testo}'"
    else:
        risposta_finale = f"[Solven-2.5 Base]: Ciao {nome}, elaborazione logica completata con successo per: '{testo}'"
        
    return {"risposta": risposta_finale}
