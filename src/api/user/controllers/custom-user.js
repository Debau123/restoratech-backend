'use strict';

module.exports = {
  async register(ctx) {
    const { username, email, password, role } = ctx.request.body;

    if (!username || !email || !password || !role) {
      return ctx.badRequest('Faltan datos obligatorios');
    }

    // Mapeo de roles
    const roleMap = {
      cliente: 2,
      camarero: 3,
      cocinero: 4,
      administrador: 1,
    };

    const roleId = roleMap[role];

    if (!roleId) {
      return ctx.badRequest('Rol no válido');
    }

    // Comprueba si ya existe el usuario o email
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
          role: roleId,
        },
      });

      return ctx.send({ message: 'Usuario creado y confirmado', user });
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
