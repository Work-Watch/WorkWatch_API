const Task = require('../models/task.model');
const Team = require('../models/team.model')

// Obtener todos los datos
exports.getAllTask = async (req, res) => {

    try {

       // agregando paginacion

       const page = req.query.page || 1; // Página actual, valor predeterminado: 1
       const limit = req.query.limit || 10; // Elementos por página, valor predeterminado: 10
       const offset = (page - 1) * limit;  // Calcular el desplazamiento (offset) según la página actual y el límite
       const count = await User.count(); // Conteo total de datos
 

      const task = await Task.findAll({ include: Team, limit: limit, offset: offset });

      return res.status(200).json({
        status: 200,
        page: page,   // pagina actual
        count: count, // total de datos
        limit: limit, // limite elegido
        body: task  
      });
      
    } catch (error) {
      
      return res.status(500).json({
        message: ('Error al obtener datos: ' + error)
      });

    }
}

// crear una nueva task
exports.createTask = async (req, res) => {

  try {

    const { task, latitude, longitude, hourStart, hourFinal, date, idTeam } = req.body;

    if(!task || !latitude || !longitude || !hourStart || !date || !idTeam)
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });

    await Task.create({ task, latitude, longitude, hourStart, hourFinal, date, idTeam });

    return res.status(201).json({ message: "Tarea creada correctamente"});
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la tarea: " + error });
  }
}

// Actualizar una task
exports.updateTask = async (req, res) => {

  try {

  const { id } = req.params;
  const { task, latitude, longitude, hourStart, hourFinal, date, idTeam } = req.body;

  const tasks = await Task.findOne({ where: { idTask: id } });

  if (!tasks)
    return res.status(400).json({ message: 'Registro no encontrado' });


  // Actualiza el registro con los datos proporcionados
  await Task.update(
    { 
        task: task,
        latitude: latitude,
        longitude: longitude,
        hourStart: hourStart,
        hourFinal: hourFinal,
        date: date,
        idTeam: idTeam
    }, // Valores que quieres actualizar
    { where: { idTask: id }});
  
  return res.status(200).json({ message: 'Registro actualizado correctamente' });

  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el registro' });
  }

}

// Elimina una task
exports.deleteTask = async (req, res) => {

  try {
    
    const { id } = req.params;

    const tasks = await Task.findOne({ where: { idTask: id } });

    if (!tasks)
      return res.status(400).json({ message: 'Registro no encontrado' });
    
    await Task.destroy({
      where: {
        idTask: id
      }
    });

    return res.status(200).json({ message: 'Registro eliminado correctamente' });
    
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el registro' });
  }

}

// Obtener una sola task
exports.getOneTask = async (req, res) => {

  try {

    const { id } = req.params

    const task = await Task.findOne({ include: Team, where: { idTask: id } })

    if (!task){
      return res.status(400).json({ message: 'Tarea no encontrado' });
    }

    return res.status(200).json({
        ok: true,
        status: 200,
        body: task   
    });
    
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener datos: ' + error});
  }
}