'use strict';

/**
 * mesa router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::mesa.mesa');
