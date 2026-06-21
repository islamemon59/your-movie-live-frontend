export function parseM3U(text) {
  const lines = text.split('\n')
  const channels = []
  let current = null

  for (const line of lines) {
    const t = line.trim()
    if (t.startsWith('#EXTINF:')) {
      const name    = (t.match(/,(.+)$/)                    || [])[1]?.trim() || 'Unknown'
      const logo    = (t.match(/tvg-logo="([^"]*)"/)        || [])[1] || ''
      const group   = (t.match(/group-title="([^"]*)"/)     || [])[1] || ''
      const country = (t.match(/tvg-country="([^"]*)"/)     || [])[1] || ''
      current = { name, logo, group, country, url: '' }
    } else if (t && !t.startsWith('#') && current) {
      current.url = t
      channels.push(current)
      current = null
    }
  }
  return channels
}
