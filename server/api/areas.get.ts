export default defineCachedEventHandler(event => listAreas(event), { maxAge: 300, swr: true, name: 'areas-v2' })
