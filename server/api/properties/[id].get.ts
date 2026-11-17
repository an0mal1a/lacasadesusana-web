/** One published property. `id` may be a numeric Ref or a `1355-some-slug`. */
export default defineCachedEventHandler(
  async (event) => {
    const id = idFromSlug(getRouterParam(event, 'id') ?? '')
    const lang = getQuery(event).lang === 'es' ? 'es' : 'en'
    if (!id) throw createError({ statusCode: 404, statusMessage: 'Property not found' })
    const property = await getProperty(event, id, lang)
    if (!property) throw createError({ statusCode: 404, statusMessage: 'Property not found' })
    return property
  },
  { maxAge: 300, swr: true, name: 'property-v2', getKey: event => `${getRouterParam(event, 'id')}:${getQuery(event).lang}` },
)
