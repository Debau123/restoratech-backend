'use strict';

module.exports = {
  async registerCustom(ctx) {
    const { username, email, password, rol } = ctx.request.body;

    if (!username || !email || !password || !rol) {
      return ctx.badRequest('Faltan campos obligatorios');
    }

    try {
      // Buscar el ID del rol por nombre
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: rol },
      });

      if (!role) {
        return ctx.badRequest('Rol no válido');
      }

      // Crear el usuario con confirmado:true y rol asignado
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username,
          email,
          password,
          confirmed: true,
          role: role.id,
        },
      });

      return ctx.send({ message: 'Usuario creado correctamente', user });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      return ctx.internalServerError('Error al crear usuario');
    }
  },
};
