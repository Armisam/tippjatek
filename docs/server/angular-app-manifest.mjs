
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/"
  },
  {
    "renderMode": 1,
    "route": "/jatekos-statisztika/*"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 639, hash: 'ca910532e688baf4327ba3c9264d68869c21dc45f521815400cfdb949da13d46', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 972, hash: 'b92928668f16216139d032cc6736a686a2d304f6b1542270ef87b8753db28ff3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ATR3652Q.css': {size: 55, hash: 'CAtEuq9LdrY', text: () => import('./assets-chunks/styles-ATR3652Q_css.mjs').then(m => m.default)}
  },
};
