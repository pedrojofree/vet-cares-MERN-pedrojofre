import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req,res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id
    try {
        const pacienteAlmacenado = await paciente.save()
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error);
    }
};
const obtenerPacientes = async (req,res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario);
    res.json(pacientes)
};
const obtenerPaciente = async (req,res)=>{
    //Comprobar que el veterinario sea quien modifique el paciente
    const {id}=req.params;
    const paciente = await Paciente.findById(id)

    if(!paciente){
        return res.status(404).json({msg:"Not Found."})
    };

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg:"Pacient is not yours. Failed to GET ONE"});
    };
    
    res.json(paciente);
}
const actualizarPaciente = async (req,res)=>{
    //Comprobar que el veterinario sea quien modifique el paciente
    const {id}=req.params;
    const paciente = await Paciente.findById(id)

    if(!paciente){
        return res.status(404).json({msg:"Not Found."})
    };

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg:"Pacient is not yours. Failed to PUT"});
    };

    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    try {
        const pacienteActualizado = await paciente.save()
        res.json({pacienteActualizado})
    } catch (error) {
        console.log(error);
    }
}
const eliminarPaciente = async (req,res)=>{
    //Comprobar que el veterinario sea quien modifique el paciente
    const {id}=req.params;
    const paciente = await Paciente.findById(id)

    if(!paciente){
        return res.status(404).json({msg:"Not Found."})
    };

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg:"Pacient is not yours. Failed to DELETE"});
    }
    //Eliminar paciente
    try {
        await paciente.deleteOne()
        res.json({msg:`${paciente.nombre} - Pacient deleted.`})
    } catch (error) {
        console.log(error);
    }
};


export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};