from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #Esto es lo que permite la conexion del backend con el front
from pydantic import BaseModel
#Mercado pago parte
import mercadopago
from dotenv import load_dotenv
import os

#Traemos del .env la credencial
load_dotenv ()

TOKEN_PAGO= os.getenv("TOKEN_PAGO")

class Item(BaseModel):
    title: str
    quantity: int
    unit_price: float

class Carrito(BaseModel):
    items: list[Item]


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
sdk = mercadopago.SDK(TOKEN_PAGO)

@app.get("/")
def root ():
    return "andando"


@app.post("/carrito")
def post_carrito(carrito: Carrito):

    preference_data = {
    "items": [
        {
            "title": item.title,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
        }
        for item in carrito.items
        ],"back_urls": {
            "success": "https://www.google.com",
            "failure": "https://www.google.com",
            "pending": "https://www.google.com"
},
"auto_return": "approved"
}
    import pprint

    
    pprint.pprint(preference_data)


    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]

    print("STATUS:", preference_response["status"])
    print("RESPONSE:", preference_response["response"])
    return {
        "id": preference["id"],
        "init_point": preference["init_point"],
        "sandbox_init_point": preference["sandbox_init_point"]
        
    }



    
