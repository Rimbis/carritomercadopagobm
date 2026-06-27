from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #Esto es lo que permite la conexion del backend con el front
from pydantic import BaseModel
#Mercado pago parte
import mercadopago
from dotenv import load_dotenv
import os

#Traemos del .env la credencial
TOKEN_PAGO= os.getenv("MERCADO_TOKEN")


app = FastAPI()
origins = [
    "http://tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "https://tusitio.com" # Reemplaza con tu dominio real
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Permite solicitudes de estos dominios
    allow_credentials=True,      # Permite cookies y encabezados de autenticación
    allow_methods=["*"],         # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],         # Permite todos los encabezados HTTP
)


# Agrega credenciales
sdk = mercadopago.SDK("TOKEN_PAGO")

@app.get("/")
def root ():
    return "andando"


@app.post ("/carrito")
def post_productos (carrito: Carrito)
# Crea un ítem en la preferencia
preference_data = {
    "items": [
        {
            "title": "Mi producto",
            "quantity": 1,
            "unit_price": 75.76,
        }
    ]
}

preference_response = sdk.preference().create(preference_data)
preference = preference_response["response"]
return {
        "id": preference["id"],
        "init_point": preference["init_point"],
        "sandbox_init_point": preference["sandbox_init_point"]
    }