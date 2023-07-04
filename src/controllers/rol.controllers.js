const Rol = require('../models/rol.model');

// obtener todos los rol
exports.getAllRol = async(req, res) => {
    

    try {

      const rol = await Rol.findAll({});

      return res.status(200).json({
          ok: true,
          status: 200,
          body: rol   
      });
      
    } catch (error) {
      
      return res.status(500).json({
        message: ('Error al obtener datos: ' + error)
      });

    }
}

// crear nuevos rol
exports.createRol = async(req, res) => {
    const administrador = await Rol.create({
        rol: "administrador"
    });
    const empleado = await Rol.create({
        rol: "empleado"
    });

    res.status(201).json({
        ok: true,
        status: 201,
        message: "Create rols"
    })
}

// actulizar los rol
exports.updateRol = async(req, res) => {

    try {

      const { id } = req.params;
      const { rol } = req.body;

      const rols = await Rol.findOne({ where: { idRol: id } });

      if (!rols) {
        return res.status(400).json({ message: 'Registro no encontrado' });
      }

      // Actualiza el registro con los datos proporcionados
      await Rol.update({ rol: rol },{ where: { idRol: id }});

      return res.status(200).json({ message: "Rol actualizado correctamente"})
      
    } catch (error) {
      return res.status(500).json({ message: "Error: " + error });
    }
  
}
  
// eliminar los rol
exports.deleteRol = async (req, res) => {
  
  try {

    const { id } = req.params;

    const rols = await Rol.findOne({ where: { idRol: id } });

    if (!rols) 
      return res.status(400).json({ message: 'Registro no encontrado' });
      
    await Rol.destroy({
      where: {
        idRol: id
      }
    }).then((result) => {
      if (result === 0)
          res.status(404).json({ error: 'Registro no encontrado' });
    }
  )
    
    return res.status(200).json({ message: "Rol eliminado"});
    
  } catch (error) {
    return res.status(500).json({ message: "Error: " + error });
  }
}
  
