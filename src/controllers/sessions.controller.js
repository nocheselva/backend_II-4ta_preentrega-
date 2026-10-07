import { generateToken } from '../utils/jwt.js';

export class SessionsController {
  // Callback tras autenticación exitosa en 'register'
  async register(req, res) {
    const user = req.user;
    return res.status(201).json({
      status: 'success',
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  }

  // Genera JWT y establece la cookie HttpOnly
  async login(req, res) {
    const token = generateToken(req.user);

    res.cookie('currentUser', token, {
      httpOnly: true,
      maxAge: 3600000 // 1 hora
    });

    return res.json({
      status: 'success',
      message: 'Login correcto'
    });
  }

  // Muestra los datos expuestos en req.user por la estrategia JWT ('current')
  async current(req, res) {
    const user = req.user;
    return res.json({
      status: 'success',
      payload: {
        id: user.id || user._id,
        email: user.email,
        role: user.role
      }
    });
  }

  // Elimina la cookie activa
  async logout(req, res) {
    res.clearCookie('currentUser');
    return res.json({
      status: 'success',
      message: 'Sesión cerrada'
    });
  }
}