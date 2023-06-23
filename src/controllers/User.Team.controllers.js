const UserTeam = require('../models/UserTeam.model');

// obtener los datos de la tabla cruzada
exports.getAllUserTeam = async ( req, res ) => {
    
    try {

        const userTeam = await UserTeam.findAll({ });

        return res.status(200).json({
            status: 200,
            body: userTeam
        });
        
    } catch (error) {

        return res.status(500).json({ message: ('Error al obtener datos: ' + error) })
        
    }

}

// crear datos dentro de la tabla cruzada
exports.createUserTeam = async (req, res) => {
  
    try {

      const { idUser, idTeam } = req.body;

      if(!idUser || !idTeam)
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });

      const userTeam = await UserTeam.create({ idUser, idTeam });
  
      res.status(201).json({
        ok: true,
        body: userTeam,
      });

    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuarioTeam: " + error });
    }
  }

// actualizar datos por medio del id 
exports.updateUserTeam = async (req, res) => {

    try {

      const { id } = req.params

      const userteam = await User.findOne({ where: { id: id } });

      if (!userteam) 
        return res.status(400).json({ message: 'Registro no encontrado' });
    
      // Actualiza el registro con los datos proporcionados
      UserTeam.update(
        { idUser: req.body.idUser, 
          idTeam: req.body.idTeam
        }, // Valores que quieres actualizar
        { 
          where: { id: id } 
        } // Condición para seleccionar el registro a actualizar
      )

      return res.status(200).json({ message: 'Registro actualizado correctamente' });
      
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar el registro' });
    }
  
  }
  
// eliminar los datos por medio del id
exports.deleteUserTeam = async (req, res) => {
  
  try {

    const { id } = req.params;

    const userteam = await User.findOne({ where: { id: id } });

    if (!userteam) 
      return res.status(400).json({ message: 'Registro no encontrado' });
    
    await UserTeam.destroy({
      where: {
        id: id
      }
    });

    res.status(200).json({ message: 'Registro eliminado correctamente' });
    
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
}
 