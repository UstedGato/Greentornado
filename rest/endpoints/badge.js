const fetch = require('fetch-base64').remote;
function createTextNode(n) {
  return n.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
module.exports = (app, client) => {
    app.get('/api/badge/:id', async (req, res) => {
        let data;
        try {
        data = await client.users.fetch(req.params.id)
        } catch (e) {
            res.send(e)
            return
        }
        const presence = data.presence.activities.filter((a) => a.type != 'CUSTOM_STATUS' & typeof a.details !== typeof null)
// soon tm <text fill="white" xml:space="preserve" style="white-space: pre" font-family="${req?.query.font || 'Noto Sans'}" font-size="48" letter-spacing="0em"><tspan x="353" y="368.124">00:24 elapsed</tspan></text>     
        const largeData = presence[0]?.assets.largeImage ? await fetch(presence[0]?.assets?.largeImageURL()) : undefined
        const smallData = presence[0]?.assets.smallImage ? await fetch(presence[0]?.assets?.smallImageURL()) : undefined
        const svg = `
<svg width="495" height="241" viewBox="0 0 1024 495" fill="none" xmlns="http://www.w3.org/2000/svg">
<style>
svg {
    overflow: hidden;
}
text {
    opacity: 0;
    animation: fade 0.3s ease-in-out forwards;
  }
  .bigimg, .smallimg {
    transform: scale(0);
    animation: scale 1s ease-in-out forwards, fade 0.3s ease-in-out forwards;
  }
  text:nth-of-type(1) { animation-delay: 450ms; }
  text:nth-of-type(2) { animation-delay: 600ms; }
  text:nth-of-type(3) { animation-delay: 750ms; }
  
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  
  
  @keyframes scale { 
    0% { -webkit-transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    5.81% { -webkit-transform: matrix3d(0.483, 0, 0, 0, 0, 0.483, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.483, 0, 0, 0, 0, 0.483, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    11.61% { -webkit-transform: matrix3d(0.88, 0, 0, 0, 0, 0.88, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.88, 0, 0, 0, 0, 0.88, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    17.42% { -webkit-transform: matrix3d(1.09, 0, 0, 0, 0, 1.09, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.09, 0, 0, 0, 0, 1.09, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    23.12% { -webkit-transform: matrix3d(1.142, 0, 0, 0, 0, 1.142, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.142, 0, 0, 0, 0, 1.142, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    30.33% { -webkit-transform: matrix3d(1.098, 0, 0, 0, 0, 1.098, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.098, 0, 0, 0, 0, 1.098, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    37.44% { -webkit-transform: matrix3d(1.033, 0, 0, 0, 0, 1.033, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.033, 0, 0, 0, 0, 1.033, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    44.54% { -webkit-transform: matrix3d(0.994, 0, 0, 0, 0, 0.994, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.994, 0, 0, 0, 0, 0.994, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    51.65% { -webkit-transform: matrix3d(0.984, 0, 0, 0, 0, 0.984, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.984, 0, 0, 0, 0, 0.984, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    80.28% { -webkit-transform: matrix3d(1.002, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.002, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    100% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
  }
  
</style>
<rect width="1024" height="447" fill="${req?.query.color2 ? '#' + req.query.color2 : '#E5E5E5'}"/>
<rect width="1024" height="447" fill="url(#paint0_linear)"/>
<rect width="1024" height="447" fill="${req?.query.color1 ? '#' + req.query.color1 : '#436E76'}"/>
<rect width="1024" height="447" fill="url(#paint1_linear)"/>
<text fill="${req?.query.textcolor ? '#' + req.query.textcolor : 'white'}" xml:space="preserve" style="white-space: pre" font-family="${req.query.font ? decodeURIComponent(req?.query.font) : 'Noto Sans'}" font-size="48" font-weight="bold" letter-spacing="0em"><tspan x="40" y="82.124">${presence[0] ? 'Playing' : 'Playing nothing'}</tspan></text>
<text fill="${req?.query.textcolor ? '#' + req.query.textcolor : 'white'}" xml:space="preserve" style="white-space: pre" font-family="${req.query.font ? decodeURIComponent(req?.query.font) : 'Noto Sans'}" font-size="62" font-weight="bold" letter-spacing="0em"><tspan x="353" y="215.056">${presence[0] ?  createTextNode(presence[0].name) : ''}</tspan></text>
<text fill="${req?.query.textcolor ? '#' + req.query.textcolor : 'white'}" xml:space="preserve" style="white-space: pre" font-family="${req.query.font ? decodeURIComponent(req?.query.font) : 'Noto Sans'}" font-size="48" letter-spacing="0em"><tspan x="353" y="289.124">${presence[0] ?  createTextNode(presence[0].details) : ''}</tspan></text>
` +
(presence[0]?.assets?.largeImage ? `
<mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="40" y="140" width="270" height="265">
<path class="bigimg" fill-rule="evenodd" clip-rule="evenodd" d="M80 405C57.9086 405 40 387.091 40 365V180C40 157.909 57.9086 140 80 140H270C292.091 140 310 157.909 310 180V329.258C301.581 324.023 291.643 321 281 321C250.624 321 226 345.624 226 376C226 386.643 229.023 396.581 234.258 405H80Z" fill="#FFC200"/>
</mask>
<g mask="url(#mask0)">
<rect class="bigimg" x="40" y="140" width="270" height="265" fill="url(#pattern0)"/>
</g>` +
(presence[0]?.assets?.smallImage ? `<mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="237" y="332" width="88" height="88">
<circle cx="281" cy="376" r="44" fill="black"/>
</mask>
<g class="smallimg" mask="url(#mask1)">
<rect x="237" y="332" width="88" height="88" fill="url(#pattern1)"/>
</g>` : '' ) : '') +
`<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use href="#image0" transform="translate(0 -0.00943396) scale(0.0078125 0.00795991)"/>
</pattern>
<pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
<use href="#image1" transform="scale(0.0078125)"/>
</pattern>
<linearGradient id="paint0_linear" x1="512" y1="0" x2="512" y2="447" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="${req?.query.color1 ? '#' + req.query.color1 : '#436E76'}"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="512" y1="0" x2="512" y2="447" gradientUnits="userSpaceOnUse">
<stop stop-color="${req?.query.color1 ? '#' + req.query.color1 : '#436E76'}"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<image id="image0" width="128" height="128" href="${largeData ? largeData[1] : ''}"/>
<image id="image1" width="128" height="128" href="${smallData ? smallData[1] : ''}"/>
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