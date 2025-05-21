'use strict';

module.exports = {
  async registerCustom(ctx) {
    const { username, email, password, rol } = ctx.request.body;

    if (!username || !email || !password || !rol) {
      return ctx.badRequest('Faltan campos obligatorios');
    }

    // Usa el servicio user de Strapi para crear usuario
    const newUser = await strapi.plugins['users-permissions'].services.user.add({
      username,
      email,
      password,
      rol,          // tu campo enum
      confirmed: true,
    });

    return ctx.send({
      message: 'Usuario creado y confirmado',
      user: newUser,
    });
  },
};
