+'use strict';

module.exports = {
  async registerCustom(ctx) {
    const { username, email, password, rol } = ctx.request.body;

    if (!username || !email || !password || !rol) {
      return ctx.badRequest('Faltan campos obligatorios');
    }

    try {
      // Buscar rol real (users-permissions) por name
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { name: rol },  // O { type: rol } si es el caso
      });

      if (!role) {
        return ctx.badRequest('Rol no válido');
      }

      // Crear usuario con rol real y campo rol
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username,
          email,
          password,
          confirmed: true,
          role: role.id,  // Asignar relación con users-permissions.role
          rol,            // Guardar también el campo enumeration
        },
      });

      return ctx.send({ message: 'Usuario creado correctamente', user });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      return ctx.internalServerError('Error al crear usuario');
    }
  },
};
