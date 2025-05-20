module.exports = {
    async afterCreate(event) {
      const { result } = event;
  
      console.log("🎯 afterCreate ejecutado para:", result.email);
  
      try {
        await strapi.entityService.update('plugin::users-permissions.user', result.id, {
          data: {
            rol: 'cliente',
          },
        });
  
        console.log("✅ Rol 'cliente' asignado al usuario:", result.email);
      } catch (err) {
        console.error("❌ Error al asignar el rol:", err);
      }
    },
  };
  