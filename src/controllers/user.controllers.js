const Rol = require("../models/rol.model");
const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const mailer = require('../utils/mailer');

// obtener todos los usuario
exports.getAllUser = async (req, res) => {

    try {

      // agregando paginacion

      const page = req.query.page || 1; // Página actual, valor predeterminado: 1
      const limit = parseInt(req.query.limit || 10); // Elementos por página, valor predeterminado: 10
      const offset = (page - 1) * limit;  // Calcular el desplazamiento (offset) según la página actual y el límite
      const count = await User.count(); // Conteo total de datos

      const user = await User.findAll({ include: Rol, limit: limit, offset: offset});

      return res.status(200).json({
          status: 200,
          page: page,   // pagina actual
          count: count, // total de datos
          limit: limit, // limite elegido
          body: user   
      });
      
    } catch (error) {
      
      return res.status(500).json({
        message: ('Error al obtener datos: ' + error)
      });

    }
}

// crear usuarios nuevos
exports.createUser = async (req, res) => {

  const { name, lastName, email, password, confirmPassword, company, phone, idRol } = req.body;

  // Verificar si hay campos vacíos
  if (!name || !lastName || !email || !password || !confirmPassword || !company || !phone || !idRol) 
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });

  // verificar si el correo a sido utilizado
  const user = await User.findOne({ where: { email } });

  // Validando que el correo ya este registrado
  if(user)
      return  res.status(400).json({ message: 'El correo ya esta en uso'});

  // Validadando 8 digitos de contra
  if ( password.length <  8 || confirmPassword.length < 8 )
      return res.status(400).json({ message: 'Ingrese 8 o mas caracteres ' });

  // Verificando que las contras coinsidan
  if( password !== confirmPassword)
      return res.status(400).json({ message: 'Las contrasenas no coinciden' });

  try {
    await User.create({
      name,
      lastName,
      email,
      password,
      confirmPassword,
      company,
      phone,
      idRol,
    });

    res.status(201).json({ message: "Usuario creado correctamente"});
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario: " + error });
  }
}

// actualizart los usuarios por el id
exports.updateUser = async (req, res) => {
  try {
    const { name, lastName, email, password, confirmPassword, company, phone, idRol } = req.body;

    const { id } = req.params;

    const users = await User.findOne({ where: { idUser: id } });

    if (!users) 
      return res.status(400).json({ message: 'Registro no encontrado' });

    // verificar si el correo a sido utilizado
    if (email){
      const user = await User.findOne({ where: { email } });

      // Validando que el correo ya este registrado
      if(user)
          return res.status(400).json({ message: 'El correo ya esta en uso'});
    }

    // Validadando 8 digitos de contra
    if ( password.length <  8 || confirmPassword.length < 8 )
      return res.status(400).json({ message: 'Ingrese 8 o mas caracteres ' });

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) 
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    
    let hashedPassword = '';

    if(password)
      hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

    // Actualizar el registro con los datos proporcionados
    await User.update(
      {
        name: name,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        confirmPassword: confirmPassword,
        company: company,
        phone: phone,
        idRol: idRol
      },
      {
        where: { idUser: id }
      });

    return res.status(200).json({ message: 'Registro actualizado correctamente' });

  } catch (error) {

    return res.status(500).json({ error: 'Error al actualizar el registro -- ' + error});

  }
};

// eliminar el usuario por el id
exports.deleteUser = async (req, res) => {

  try {
  
    const { id } = req.params;

    const users = await User.findOne({ where: { idUser: id } });

    if (!users) 
      return res.status(400).json({ message: 'Registro no encontrado' });

    await User.destroy({
      where: {
        idUser: id
      }
    });

    return res.status(200).json({ message: 'Registro eliminado correctamente' });

    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar el registro '});
    }

}

// buscar un usuartio por el id
exports.getOneUser = async (req, res) => {

  try {

    const { id } = req.params

    const user = await User.findOne({ include: Rol, where: { idUser: id} })

    if (!user){
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
        ok: true,
        status: 200,
        body: user   
    });
    
  } catch (error) {
    
    return res.status(500).json({
      message: ('Error al obtener datos: ' + error)
    });

  }
}

// buscar un usuario por el nombre
exports.getFindName = async (req, res) => {
  try {

    const { name } = req.query

    if(!name)
      return res.status(400).json({ message: 'Campo nopmbre obligatorio' });

    const user = await User.findOne({ include: Rol, where: { name: name} })

    if (!user){
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
        ok: true,
        status: 200,
        body: user   
    });
    
  } catch (error) {
    
    return res.status(500).json({
      message: ('Error al obtener datos: ' + error)
    });

  }
}

// retornar info del usuario por el token
exports.getOwn = async (req, res) => {
    return res.status(200).json({
      body: req.user
    })
}

exports.isCreatedCode = async (req, res) => {

  try {

    const { email } = req.body

    // verificar si el correo a sido utilizado
    const user = await User.findOne({ where: { email } });

    // Si el usuaio tiene los campos llenos ya esta registrado
    if (user && (user.name || user.lastName || user.company || user.password || user.phone))
      return res.status(400).json({ message: "El usuario ya está registrado" });


    // Se genera un codigo de invitacion
    let code = '';

    for ( let i = 0; i < 6; i++)
      code += Math.floor(Math.random() * 9) + 1;
  
    if (user) {
      // Si el usuario ya existe se actualiza el codigo de invitacion
      user.isVerified = code;
      await user.save();
      
    } else {
      // Si el usuario no existe, crear uno nuevo
      await User.create({ email, isVerified: code, idRol: 2 });
    }
    
    const msg = {
      to: email,
      subject: 'Codigo de invitacion WorkWatch',
      html: `<p>
      ¡Bienvenido/a a WorkWatch!
      <br><br>
      Estamos encantados de que te hayas unido a nuestra comunidad. Como parte del proceso de registro, te pedimos que verifiques tu cuenta mediante el siguiente código de invitación:
      <br><br>
      Código de invitación: <h2><strong>${code}</strong></h2>
      <br><br>
      Por favor, ingresa este código en la aplicación para completar tu registro y acceder a todas las funcionalidades.
      <br><br>
      ¡Gracias por unirte a WorkWatch!
      <br><br>
      Saludos cordiales,
      WorkWatch
      </p>`,
    }   

    await mailer(msg);

    res.status(200).json({ message: "Codigo de verificacion enviado" });
    
  } catch (error) {
    res.status(400).json({ message: "Error" + error });
  }
  
}

exports.isVerifiedCode = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({ where: { isVerified: code }});

    if (!user) {
      return res.status(404).json({ message: 'El código ingresado es incorrecto' });
    }

    if (user.isVerified) {

      user.isVerified = null;
      await user.save();

      return res.status(200).json({ message: 'Código correcto' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar el código: ' + error });
  }

};