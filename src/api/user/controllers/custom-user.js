'use strict';

module.exports = {
  async register(ctx) {
    const { username, email, password, rol } = ctx.request.body;

    if (!username || !email || !password || !rol) {
      return ctx.badRequest('Faltan datos obligatorios');
    }

    const rolesValidos = ['cliente', 'camarero', 'cocinero', 'administrador'];
    if (!rolesValidos.includes(rol)) {
      return ctx.badRequest('Rol no válido');
    }

    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { $or: [{ email }, { username }] },
    });

    if (existingUser) {
      return ctx.badRequest('Usuario o email ya existe');
    }

    const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { name: 'Authenticated' },
    });

    if (!authenticatedRole) {
      return ctx.badRequest('Role "Authenticated" no encontrado');
    }

    // ✅ Versión correcta para Strapi v4
    const hashedPassword = await strapi
      .service('plugin::users-permissions.user')
      .hashPassword({ password });

    try {
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username,
          email,
          password: hashedPassword,
          confirmed: true,
          blocked: false,
          rol,
          role: authenticatedRole.id,
          provider: 'local',
        },
      });

      return ctx.send({ message: 'Usuario creado y confirmado', user });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      return ctx.internalServerError('Error al crear usuario');
    }
  },
};
