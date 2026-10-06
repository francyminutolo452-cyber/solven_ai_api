from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

app = FastAPI(title="Solven AI Engine")

# Rilascia i permessi di sicurezza CORS per permettere a GitHub Pages di parlare liberamente con Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Struttura dati arricchita con le preferenze personali inviate dall'applicazione
class RichiestaUtente(BaseModel):
    messaggio: str
    versione_ia: str = "solven-2.5"
    nome_utente: Optional[str] = "Francesco"
    tono_ia: Optional[str] = "bilanciato"
    scopo_ia: Optional[str] = "studio"
    interessi_utente: Optional[List[str]] = []

@app.get("/")
def home():
    return {"stato": "Il motore logico di Solven AI è online e configurato!"}

@app.post("/chiedi")
def rispondi_a_utente(dati: RichiestaUtente):
    testo = dati.messaggio
    modello = dati.versione_ia
    nome = dati.nome_utente
    tono = dati.tono_ia
    scopo = dati.scopo_ia
    
    # 🧠 DEFINIZIONE DELLA PERSONALITÀ IN BASE AL TONO SELEZIONATO
    prefisso_personalita = ""
    if tono == "amichevole":
        prefisso_personalita = f"Ciao {nome}! 😊 Ecco un chiarimento semplice ed empatico per te: "
    elif tono == "tecnico":
        prefisso_personalita = f"[ANALISI TECNICA PER {nome.upper()}]: "
    elif tono == "ironico":
        prefisso_personalita = f"Eccomi {nome}, pronto a risolvere i tuoi dubbi con un pizzico di ironia! ⚡ "
    else:
        prefisso_personalita = f"Solven AI per {nome}: "

    # 🤖 LOGICA DELLE VERSIONI IA INTEGRATE CON IL CONTESTO DI UTILIZZO
    if modello == "solven-1.5":
        risposta_base = f"Risposta rapida (Ottimizzata per la velocità). Sto analizzando la tua domanda focalizzata su {scopo}: '{testo}'"
    
    elif modello == "solven-2.5":
        risposta_base = f"Risposta standard bilanciata. Elaborazione logica completata per la richiesta: '{testo}'"
        
    elif modello == "solven-3.5":
        risposta_base = f"Analisi Plus attiva ✨. Ho attivato una rete di ragionamento estesa per strutturare la risposta migliore su '{testo}'"
        
    elif modello == "solven-4.5":
        risposta_base = f"Potenza Pro abilitata 🔥. Risoluzione complessa a livello enterprise completata con successo per l'obiettivo: '{testo}'"
        
    else:
        risposta_base = f"Sto elaborando il tuo messaggio: '{testo}'"
        
    # Combiniamo lo stile grafico del tono con la logica del modello scelto
    risposta_finale = f"{prefisso_personalita}{risposta_base}"
        
    return {"risposta": respuesta_finale}
