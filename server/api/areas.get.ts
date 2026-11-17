export default defineCachedEventHandler(event => listAreas(event), { maxAge: 900, swr: true, name: 'areas' })
