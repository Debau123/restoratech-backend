'use strict';

module.exports = {
  async register(ctx) {
    const { username, email, password, rol } = ctx.request.body; // rol es string de enumeración

    if (!username || !email || !password || !rol) {
      return ctx.badRequest('Faltan datos obligatorios');
    }

    // Buscar usuario existente
    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { $or: [{ email }, { username }] },
    });

    if (existingUser) {
      return ctx.badRequest('Usuario o email ya existe');
    }

    try {
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username,
          email,
          password,
          confirmed: true,
          blocked: false,
          rol,  // Guardamos directamente la cadena de la enumeración
           role: 'authenticated',  // asigna el rol "Authenticated"
          provider: 'local',    
        },
      });

      return ctx.send({ message: 'Usuario creado y confirmado', user });
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
