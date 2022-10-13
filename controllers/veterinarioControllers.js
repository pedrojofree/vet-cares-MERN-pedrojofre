import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailPassOlvidado from "../helpers/emailPassOlvidado.js"

const registrar = async (req, res) => { //Comprobar si existe un email repetido y crear un registro sino.

    const { email, nombre } = req.body;

    const usuarioExiste = await Veterinario.findOne({email})
    if (usuarioExiste){
        const error = new Error("User already exists.")
        return res.status(400).json({msg:error.message})
    }
    try {
        //Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar email
        emailRegistro({
            email, 
            nombre, 
            token: veterinarioGuardado.token
        });

        //Mostrar usuario en consola POSTMAN
        res.json(veterinarioGuardado);

    } catch (error) {
        console.log(`error: ${error.message}`);
    }

};
const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario)
};
const confirmar = async (req, res) => { //Leyendo un token desde URL para confirmar su cuenta

    const { token } = req.params;
    const usuarioAConfirmar = await Veterinario.findOne({token});

    if(!usuarioAConfirmar){
        const error = new Error("Invalid Token.");
        return res.status(404).json({msg: error.message})
    };
    try {
        usuarioAConfirmar.token = null
        usuarioAConfirmar.confirmado=true
        await usuarioAConfirmar.save()

        res.json({msg:"User confirmed."})
    } catch (error) {
        console.log({msg: error.message});
    };
    
};
const autenticar = async (req, res) => { //Leyendo email y contraseña desde POSTMAN


    const {email, password}=req.body 
    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})
    if(!usuario){
        const error = new Error("User does not exist.");
        return res.status(403).json({msg: error.message})
    };

    //Confirmar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Your account is not confirmed");
        return res.status(403).json({msg: error.message})
    }

    //Revisar password
    if(await usuario.comprobarPassword(password)){
        //Crear JsonWebToken
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    }else{
        const error = new Error("Incorrect Password");
        return res.status(403).json({msg: error.message})
    };
};
const olvidePassword = async (req, res) => {
    const {email} = req.body;
    const existeVeterinario = await Veterinario.findOne({email})

    if(!existeVeterinario){
        const error = new Error("The user does not exist")
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token=generarId()
        await existeVeterinario.save()

        //Enviar Email con instrucciones
        emailPassOlvidado({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg:"Email sent with instructions."})
    } catch (error) {
        console.log(error);
    }
};
const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido){
        //El token es valido y el usuario existe.
        res.json({msg:"Token valido, el usuario existe."})
    } else {
        const error = new Error("Invalid token.")
        return res.status(400).json({msg: error.message})
    }
};
const nuevoPassword = async (req, res) => {
    const {token}=req.params;
    const {password}=req.body;

    const veterinario = await Veterinario.findOne({token})
    
    if(!veterinario){
        const error = new Error("Error")
        return res.status(400).json({msg: error.message})
    };
    try {
        veterinario.token=null;
        veterinario.password=password;
        await veterinario.save()
        res.json({msg: "Password modified."})
    } catch (error) {
        console.log(error);
    };
};
const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error ("Database error");
        return res.status(400).json({msg: error.message})
    }

    const {email}  = req.body
    
    if(veterinario.email !== req.body.email){

        const existeEmail = await Veterinario.findOne({email})

        if(existeEmail){
            
            const error = new Error ("Email already in use");
            return res.status(400).json({msg: error.message});

        }
    }

    try {
        veterinario.nombre=req.body.nombre;
        veterinario.email=req.body.email;
        veterinario.web=req.body.web;
        veterinario.telefono=req.body.telefono;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
}
const actualizarPassword = async (req, res) => {
    // Leer datos desde donde se invoca esta funcion
    const {id} = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body

    // Comprobar el usuario que intenta cambiar el password
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error ("Database error");
        return res.status(400).json({msg: error.message})
    }

    // Comprobar los password que envio (viejo y nuevo)
    if(await veterinario.comprobarPassword(pwd_actual)){
        // Guardar el nuevo pass en DB

        veterinario.password = pwd_nuevo;
        await veterinario.save()
        res.json({msg: "Password correctly updated"})
    } else {
        const error = new Error ("Incorrect actual password");
        return res.status(400).json({msg: error.message})
    }

    // Guardar el nuevo pass en DB


}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};