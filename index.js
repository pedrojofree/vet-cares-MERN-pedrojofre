import express from "express";
import dotenv from "dotenv"; //Importando dependencia para variables de entorno´
import cors from "cors"; //Permitir request de diferentes URL
import conectarDB from "./config/db.js"; 
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacientesRoutes from "./routes/pacientesRoutes.js";


const app = express()

app.use(express.json())

dotenv.config() //Reconociendo variables de entorno

conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2];
const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen existe y esta permitido
            callback(null, true);
        } else {
            callback(new Error("Not allowed due CORS"));
        }
    }
}

app.use(cors(corsOptions));

app.use("/api/veterinarios", veterinarioRoutes)
app.use("/api/pacientes", pacientesRoutes)



const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Server connected on port ${port}`);
})
