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

    // Buscar el Role "Authenticated" para asignar su id
    const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { name: 'Authenticated' },
    });

    if (!authenticatedRole) {
      return ctx.badRequest('Role "Authenticated" no encontrado');
    }

    try {
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username,
          email,
          password,
          confirmed: true,
          blocked: false,
          rol,  // tu enumeración personalizada
          role: authenticatedRole.id,  // asigna el rol "Authenticated"
          provider: 'local',           // importante para login con contraseña
        },
      });

      return ctx.send({ message: 'Usuario creado y confirmado', user });
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
