module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'mardefullesprojecte@gmail.com',
            pass: env('EMAIL_APP_PASSWORD'),
          },
        },
        settings: {
          defaultFrom: 'mardefullesprojecte@gmail.com',
          defaultReplyTo: 'mardefullesprojecte@gmail.com',
        },
      },
    },
  });
  