module.exports = {
    async afterCreate(event) {
      const { result } = event;
  
      console.log("🎯 afterCreate hook ejecutado para el usuario:", result.email);
  
      await strapi.entityService.update('plugin::users-permissions.user', result.id, {
        data: {
          rol: 'cliente',
        },
      });
    },
  };
  