'use strict';

module.exports = {
  async registerCustom(ctx) {
    const { username, email, password, rol } = ctx.request.body;

    if (!username || !email || !password || !rol) {
      return ctx.badRequest('Faltan campos obligatorios');
    }

    try {
      // Buscar role 'authenticated' en users-permissions
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (!role) {
        return ctx.badRequest('Rol interno no válido');
      }

      // Crear el usuario con role real y rol personalizado
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username,
          email,
          password,
          confirmed: true,
          role: role.id,  // users-permissions: 'authenticated'
          rol,            // nuestro campo personalizado
        },
      });

      return ctx.send({ message: 'Usuario creado correctamente', user });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      return ctx.internalServerError('Error al crear usuario');
    }
  },
};
