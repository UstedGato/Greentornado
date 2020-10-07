module.exports = (app, client) => {
    app.get('/api/badge/:id', async (req, res) => {
        const data = await client.users.fetch(req.params.id)
        const presence = data.presence.activities.filter((a) => a.type != 'CUSTOM_STATUS' & typeof a.details !== typeof null)
// soon tm <text fill="white" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="48" letter-spacing="0em"><tspan x="353" y="368.124">00:24 elapsed</tspan></text>
        const svg = `
<svg width="495" heigh495 viewBox="0 0 1024 447" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="1024" height="447" fill="#E5E5E5"/>
<rect width="1024" height="447" fill="url(#paint0_linear)"/>
<rect width="1024" height="447" fill="#436E76"/>
<rect width="1024" height="447" fill="url(#paint1_linear)"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="62" font-weight="bold" letter-spacing="0em"><tspan x="353" y="215.056">${presence[0] ? presence[0].name : ''}</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="48" letter-spacing="0em"><tspan x="353" y="289.124">${presence[0] ? presence[0].details : ''}</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Noto Sans" font-size="48" font-weight="bold" letter-spacing="0em"><tspan x="40" y="82.124">${presence[0] ? 'Playing' : 'Playing nothing'}</tspan></text>
<mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="40" y="140" width="270" height="265">
<path fill-rule="evenodd" clip-rule="evenodd" d="M80 405C57.9086 405 40 387.091 40 365V180C40 157.909 57.9086 140 80 140H270C292.091 140 310 157.909 310 180V329.258C301.581 324.023 291.643 321 281 321C250.624 321 226 345.624 226 376C226 386.643 229.023 396.581 234.258 405H80Z" fill="#FFC200"/>
</mask>` +
(presence[0] ? `<g mask="url(#mask0)">
<rect x="40" y="140" width="270" height="265" fill="url(#pattern0)"/>
</g>
<mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="237" y="332" width="88" height="88">
<circle cx="281" cy="376" r="44" fill="black"/>
</mask>
<g mask="url(#mask1)">
<rect x="237" y="332" width="88" height="88" fill="url(#pattern1)"/>
</g>` : '') +
`<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0" transform="translate(0 -0.00943396) scale(0.0078125 0.00795991)"/>
</pattern>
<pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image1" transform="scale(0.0078125)"/>
</pattern>
<linearGradient id="paint0_linear" x1="512" y1="0" x2="512" y2="447" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="#355960"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="512" y1="0" x2="512" y2="447" gradientUnits="userSpaceOnUse">
<stop stop-color="#355960"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<image id="image0" width="128" height="128" xlink:href="${presence[0] ? presence[0]?.assets?.largeImageURL() : ''}"/>
<image id="image1" width="128" height="128" xlink:href="${presence[0] ? presence[0]?.assets?.smallImageURL() : ''}"/>
</defs>
</svg>
        `
        res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.setHeader('Expires', '-1');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('content-type', 'image/svg+xml')
        res.send(svg)
    })
}