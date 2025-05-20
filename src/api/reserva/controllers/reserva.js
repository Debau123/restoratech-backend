'use strict';

/**
 * reserva controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::reserva.reserva', ({ strapi }) => ({
  async create(ctx) {
    // 1. Creamos la reserva usando el controlador base
    const response = await super.create(ctx);

    // 2. Obtenemos el ID del cliente desde el cuerpo de la solicitud
    const clienteId = ctx.request.body.data?.cliente;

    if (!clienteId) {
      strapi.log.warn('❗ Reserva creada sin cliente asignado, no se envía email.');
      return response;
    }

    try {
      // 3. Cargar usuario por ID
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', clienteId, {
        fields: ['username', 'email'],
      });

      if (!user?.email) {
        strapi.log.warn(`❗ Cliente sin email: ${user?.username || 'Desconocido'}`);
        return response;
      }

      // 4. Extraer datos de la reserva
      const { fecha, hora, comensales } = response.data.attributes;

      // 5. Enviar email
      await strapi.plugins['email'].services.email.send({
        to: user.email,
        subject: 'Confirmación de reserva',
        text: `Hola ${user.username}, tu reserva para el día ${fecha} a las ${hora} ha sido confirmada para ${comensales} comensales.`,
      });

      strapi.log.info(`📩 Email de reserva enviado a ${user.email}`);
    } catch (err) {
      strapi.log.error('❌ Error al enviar email de confirmación de reserva:', err);
    }

    return response;
  },
}));
