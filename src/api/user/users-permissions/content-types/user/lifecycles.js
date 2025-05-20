module.exports = {
    async afterCreate(event) {
      const { result } = event;
  
      console.log("🎯 afterCreate ejecutado para:", result.email);
  
      await strapi.entityService.update('plugin::users-permissions.user', result.id, {
        data: {
          rol: 'cliente',
        },
      });
    },
  };
  