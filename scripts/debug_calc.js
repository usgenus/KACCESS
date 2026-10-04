const fs = require('fs');

async function debugCalc() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page');
  const WebSocket = require('ws');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.on('message', (d) => {
    const m = JSON.parse(d);
    if (m.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', m.params.type, m.params.args.map(a => a.value || a.description));
    }
    if (m.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', m.params.exceptionDetails);
    }
    if (m.id && callbacks.has(m.id)) {
      callbacks.get(m.id)(m.result);
      callbacks.delete(m.id);
    }
  });

  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    callbacks.set(curId, resolve);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.on('open', r));
  await send('Runtime.enable');
  await send('Page.enable');

  await send('Page.navigate', { url: 'http://localhost:8080/resource-center#calculator' });
  await new Promise(r => setTimeout(r, 1200));

  const check = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        hasCalc: typeof window.NJAPCalculator !== 'undefined',
        calcHtml: document.getElementById('calcResultsContainer')?.innerHTML,
        hasContainer: !!document.getElementById('calcResultsContainer')
      };
    })()`,
    returnByValue: true,
    awaitPromise: true
  });
  console.log('CHECK:', check);

  ws.close();
}

debugCalc().catch(console.error);
