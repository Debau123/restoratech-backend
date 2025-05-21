'use strict';

const { sanitize } = require('@strapi/utils');

module.exports = {
  async register(ctx) {
    const { username, email, password, roleId } = ctx.request.body;

    if (!username || !email || !password || !roleId) {
      return ctx.badRequest('Faltan datos obligatorios');
    }

    // Comprueba si ya existe el usuario por email o username
    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { $or: [{ email }, { username }] },
    });

    if (existingUser) {
      return ctx.badRequest('Usuario o email ya existe');
    }

    try {
      // Crea el usuario con confirmed true y rol
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

      const sanitizedUser = await sanitize.sanitizers.defaultSanitizeOutput(user);

      return ctx.send({ user: sanitizedUser, message: 'Usuario creado y confirmado' });
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
