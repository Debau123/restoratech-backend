'use strict';

/**
 * mesa service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mesa.mesa');
