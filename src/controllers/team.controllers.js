const Team = require('../models/team.model');
const User = require('../models/user.model');
const UserTeam = require('../models/UserTeam.model');

// Obtener todos los datos
exports.getAllTeam = async (req, res) => {

    try {

      const team = await Team.findAll({});

      return res.status(200).json({
          ok: true,
          status: 200,
          body: team   
      });
      
    } catch (error) {
      
      return res.status(500).json({
        message: ('Error al obtener datos: ' + error)
      });

    }
}

// crear un nuevo team
exports.createTeam = async (req, res) => {

  try {

    const { name } = req.body;

    if(!name)
      return res.status(400).json("Ingrese campos completos")

    await Team.create({
      name
    });

    return res.status(201).json({ message: "Team creado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el team: " + error });
  }
}

// Actualizar team
exports.updateTeam = async (req, res) => {

  try {

    const { name } = req.body;
    const { id } = req.params;

    const team = await Team.findOne({ where: { idTeam: id } });

    if (!team)
      return res.status(400).json({ message: 'Registro no encontrado' });

    // Actualiza el registro con los datos proporcionados
    await Team.update({ name: name }, { where: { idTeam: id }});
    

    return res.status(200).json({ message: 'Registro actualizado correctamente' });
    
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el registro' + error});
  }

}

// Elimina team
exports.deleteTeam = async (req, res) => {

  try {

    const { id } = req.params;

    const team = await Team.findOne({ where: { idTeam: id } });

    if (!team)
      return res.status(404).json({ message: 'Registro no encontrado' });

    await Team.destroy({ where: { idTeam: id }});
    
    return res.status(200).json({ message: 'Registro eliminado correctamente' });
    
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el registro' });
  }

}

// Obtener un solo team
exports.getOneTeam = async (req, res) => {

  try {

    const { id } = req.params

    const team = await Team.findOne({ where: { idTeam: id } })

    if (!team){
      return res.status(400).json({ message: 'Team no encontrado' });
    }

    return res.status(200).json({
        ok: true,
        status: 200,
        body: team   
    });
    
  } catch (error) {
    return res.status(500).json({ message: ('Error al obtener datos: ' + error)});
  }
}

// obtener team por nombre
exports.getNameTeam = async (req, res) => {

  try {

    const { name } = req.query

    if(!name)
      return res.status(400).json({ message: 'Campo name obligatorio' });

    const team = await Team.findOne({ where: { name: name } })

    if (!team){
      return res.status(400).json({ message: 'Team no encontrado' });
    }

    return res.status(200).json({
        ok: true,
        status: 200,
        body: team   
    });
    
  } catch (error) {
    
    return res.status(500).json({
      message: ('Error al obtener datos: ' + error)
    });

  }
}

// obtener todos los usuarios de un team id
exports.teamUser = async  (req, res) => {
  try {

    const { id } = req.params;


    const team = await Team.findByPk(id, {
      include: {
        model: User,
        through: UserTeam, // Nombre de la tabla cruzada
      },
    });

    if (!team) {
      // El equipo no existe, enviar respuesta 404
      return res.status(400).json({ message: 'El equipo no existe' });
    }

    const users = team.Users; // Usar el plural "Users" en lugar de "User", accediendo a todos los usuarios asociados al equipo team

    return res.status(200).json( { status: 200 ,body: users } ); // Enviar la respuesta con los usuarios al cliente
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener usuarios del equipo:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios del equipo' });
  }
};

// obtener todos los usuarios de un team por la query name
exports.nameTeamUser = async (req, res) => {

  try {

    const { name } = req.query;

    if(!name)
      return res.status(400).json({ message: 'Campo name obligatorio' });
    
    const team = await Team.findOne({ 
      where: { name: name}, 
      include: {
        model: User,
        through: UserTeam, // Nombre de la tabla cruzada
      }, 
    })

    if (!team){
      return res.status(400).json({ message: 'Team no encontrado' });
    }

    const users = team.Users;

    return res.status(200).json({
        ok: true,
        status: 200,
        body: users   
    });
    
  } catch (error) {
    
    return res.status(500).json({
      message: ('Error al obtener datos: ' + error)
    });

  }
}