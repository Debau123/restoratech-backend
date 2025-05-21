'use strict';

module.exports = {
  async register(ctx) {
    const { username, email, password, role } = ctx.request.body;

    if (!username || !email || !password || !role) {
      return ctx.badRequest('Faltan datos obligatorios');
    }

    // Aquí role es directamente string y se guarda tal cual
    try {
      const user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username,
          email,
          password,
          confirmed: true,
          blocked: false,
          role,  // <-- ahora es string
        },
      });

      return ctx.send({ message: 'Usuario creado y confirmado', user });
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
