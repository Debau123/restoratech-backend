'use strict';

/**
 * pedido-producto service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pedido-producto.pedido-producto');
