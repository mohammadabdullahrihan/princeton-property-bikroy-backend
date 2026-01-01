const Sentry = require("@sentry/node")

const initSentry = (app) => {
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    })

    app.use(Sentry.Handlers.requestHandler())
    app.use(Sentry.Handlers.errorHandler())
  }
}

module.exports = { initSentry, Sentry }
