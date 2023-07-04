const User = require('../models/user.model');
const jwt = require('../utils/jwt');
const mailer = require('../utils/mailer');
const bcrypt = require('bcryptjs');

// creacion del token
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } }); 

        if(!email || !password)
            return res.status(400).json({ message: 'Ingrese datos completos'});

        // Validando que el email ya este registrado
        if(!user)
            return  res.status(400).json({ message: 'Credenciales invalidas'});

        // const validPass = password === user.password;

        if (!(await bcrypt.compare(password, user.password)))
            return res.status(404).json({ message: 'Credenciales invalidas' });

        // Construccion del token

        const token = jwt.signToken({ idUser: user.idUser });

        return res.status(token ? 200 : 404).json({ token });

            
    } catch (error) {
        return res.status(500).json({
            message: ('Error: ' + error)
          });
    }

}

exports.register = async (req, res) => {

    try {
        
        const { name, lastName, email, password, confirmPassword, company, phone, idRol } = req.body;

        // Verificar si hay campos vacíos
        if (!name || !lastName || !email || !password || !confirmPassword || !company || !phone) 
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

// solicitar el cambio de contrasena
exports.requestPassword = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        // Validando que el email ya este registrado
        if(!user)
            return  res.status(400).json({ message: 'Usuario no encontrado'});

        // Construccion del token

        const token = jwt.signTokenForRecovery({ idUser: user.idUser });

        // asignar el token a la variable
        user.recovery = token;

        await user.save();

        const host = req.headers.host;
        const link = `http://${host}/auth/reset/${token}`;

        const msg = {
            to: email,
            subject: 'Recuperacion de contraseña',
            html: `
            <p>Hola ${user.name} ${user.lastName}, Para restablecer tu contrasena
            <br><br>
            Haz click en el siguiente enlace: <a href="${link}">Restablecer contrasena</a></p>`,
        }   

        await mailer(msg);

        return res.status(200).json({ message: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña '});

            
    } catch (error) {
        return res.status(500).json({
            message: ('Error: ' + error)
          });
    }
}

// realizar el cambio de contrasena
exports.resetPassword = async (req, res) => {

    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        try {

            // Verifica el token de recuperación de contraseña
            jwt.verifyTokenForRecovery(token);

        } catch (error) {
            return res.status(400).json({ message: 'Token de recuperación inválido' });
        }

        const user = await User.findOne({ where: { recovery: token }});

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        if( password !== confirmPassword)
            return res.status(400).json({ message: 'Las contrasenas no coinciden' });

        user.password = password;
        user.recovery = null;

        await user.save();

        return res.status(200).json({ message: 'Contraseña actualizada' });

    } catch (error) {

        return res.status(500).json({
            message: 'Error: ' + error,
        });
        
    }

}