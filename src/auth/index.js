const passport = require('passport');
const User = require('../models/user.model');
const JwtStragety = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(
    new JwtStragety(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(), // sacar el token desde el header de autorizacion y siempre sera un bearer token
            ])
        },
        async (payload, done) => {
            try {
                
                // buscar el usuario en la base de datos usando el idUser del payload
                const user = await User.findOne({ where: { idUser: payload.idUser  } });
        
                if (!user) {
                  return done(null, false); // El usuario no fue encontrado
                }
        
                return done(null, user); // La autenticación fue exitosa, se pasa el usuario al siguiente middleware
        
              } catch (error) {
                return done(error, false); // Ocurrió un error durante la verificación de la autenticación
              }
        }
    )
)