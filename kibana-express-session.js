const expressSessionHapi = require('express-session-hapi');

const PLUGIN_NAME = 'kibana-express-session';

module.exports = function (kibana) {
  return new kibana.Plugin({
    config(Joi) {
      return Joi.object({
        cookieName: Joi.string(),
        enabled: Joi.boolean().default(true),
        redirectTo: Joi.string().default('/login'),
        redis: Joi.object().keys({
          host: Joi.string(),
          port: Joi.number().default(6379),
          clusterEnabled: Joi.boolean().default(false),
        }),
        secret: Joi.string(),
        sessionIDPrefix: Joi.string(),
        userProp: Joi.string().default('user'),
      }).default()
    },

    init: async function (server) {
      const config = server.config();

      await server.register({
        plugin: expressSessionHapi,
      });

      server.auth.strategy('session-nelo', 'express-session-hapi', {
        cookieName: config.get(`${PLUGIN_NAME}.cookieName`),
        redirectTo: config.get(`${PLUGIN_NAME}.redirectTo`),
        redis: config.get(`${PLUGIN_NAME}.redis`),
        secret: config.get(`${PLUGIN_NAME}.secret`),
        sessionIDPrefix: config.get(`${PLUGIN_NAME}.sessionIDPrefix`),
        userProp: config.get(`${PLUGIN_NAME}.userProp`),
      });
      server.auth.default('session-nelo');
    }
  });
};
