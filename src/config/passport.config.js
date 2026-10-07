import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import User from '../models/User.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import { cookieExtractor } from '../utils/jwtExtractor.js';

export const initializePassport = () => {
  // 1. Estrategia de Registro ('register')
  passport.use(
    'register',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;

          // Validar campos obligatorios
          if (!first_name || !last_name || !email || !password) {
            return done(null, false, { message: 'Faltan campos obligatorios' });
          }

          // Validar duplicados
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: 'El usuario ya existe' });
          }

          // Crear usuario con password hasheada
          const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            role: 'user'
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // 2. Estrategia de Login ('login')
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Credenciales inválidas' });
          }

          const isValid = isValidPassword(password, user.password);
          if (!isValid) {
            return done(null, false, { message: 'Credenciales inválidas' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // 3. Estrategia JWT para la ruta protegida ('current')
  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET || 'secretkey'
      },
      async (jwt_payload, done) => {
        try {
          // req.user quedará asignado con el payload/usuario
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};