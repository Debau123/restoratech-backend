'use strict';

const path = require('path');

// Carga Strapi como aplicación existente
async function loadStrapi() {
  const strapiPath = path.resolve(__dirname, '../');
  process.chdir(strapiPath);

  const appContext = require('@strapi/strapi');
  const strapi = await appContext().load();

  return strapi;
}

async function main() {
  const strapi = await loadStrapi();

  const año = 2025;
  const fechaInicio = new Date(año, 0, 1); // 1 de enero
  const fechaFin = new Date(año, 11, 31); // 31 de diciembre
  let fechaActual = new Date(fechaInicio);

  const diasPermitidos = [3, 4, 5, 6, 0]; // Mié a Dom

  while (fechaActual <= fechaFin) {
    const dia = fechaActual.getDay();

    if (diasPermitidos.includes(dia)) {
      const fechaStr = fechaActual.toISOString().split('T')[0];

      const turnos = [
        ['13:00:00.000', '15:00:00.000'],
        ['20:00:00.000', '23:00:00.000'],
      ];

      for (const [hora_inicio, hora_fin] of turnos) {
        const nueva = await strapi.entityService.create('api::disponibilidad.disponibilidad', {
          data: {
            fecha: fechaStr,
            hora_inicio,
            hora_fin,
            aforo_maximo: 40,
            activo: true,
          },
        });

        await strapi.entityService.update('api::disponibilidad.disponibilidad', nueva.id, {
          data: {
            publishedAt: new Date().toISOString(),
          },
        });

        console.log(`✅ ${fechaStr} de ${hora_inicio} a ${hora_fin} creada y publicada`);
      }
    }

    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  console.log('✅ Todas las disponibilidades de 2025 fueron creadas y publicadas');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error al generar disponibilidades:', err);
  process.exit(1);
});
