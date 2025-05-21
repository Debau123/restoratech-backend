'use strict';

module.exports = {
  async register(ctx) {
    const { username, email, password, roleId } = ctx.request.body;

    if (!username || !email || !password || !roleId) {
      return ctx.badRequest('Faltan datos obligatorios');
    }

    // Busca si ya existe
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
