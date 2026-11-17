/** Which data source is live. Used to show an honest "sample listings" note in development. */
export default defineEventHandler(event => ({ fixtures: !vesttaConfigured(event), mail: mailConfigured(event) }))
