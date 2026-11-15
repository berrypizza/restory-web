// Keep the registered AceCounter account/domain settings and vendor endpoint.
// The inline Next Script runs after the existing member variables are ready.
export const aceCounterLoader = `
(function () {
  if (window.__restoryAceCounter) return;

  var state = window.__restoryAceCounter = { status: 'loading', attempts: 0 };
  var info = ['restorystudio.co.kr', 'www.restorystudio.co.kr,restorystudio.co.kr,m.restorystudio.co.kr', 'AZ1A106207', '1', 'NaPm,Ncisy', '1'];
  var groups = window._AceGID ? window._AceGID.val : [];
  if (groups.some(function (group) { return group[2] === info[2]; })) {
    state.status = 'existing';
    return;
  }
  groups.push(info);
  window._AceGID = { o: groups.length, val: groups };

  var retryDelays = [1000, 3000];
  function load() {
    state.attempts += 1;
    state.status = 'loading';
    var script = document.createElement('script');
    script.async = true;
    script.dataset.acecounterLoader = 'restory';
    script.src = 'https://cr.acecounter.com/ac.js?gc=' + info[2]
      + '&py=' + info[1] + '&up=' + info[4].replace(/,/g, '_') + '&rd=' + Date.now();
    window._AceCounter = script.src;

    script.onload = function () {
      script.onload = script.onerror = null;
      state.status = 'loaded';
    };
    script.onerror = function () {
      script.onload = script.onerror = null;
      script.remove();
      if (state.attempts <= retryDelays.length) {
        state.status = 'retrying';
        window.setTimeout(load, retryDelays[state.attempts - 1]);
      } else {
        state.status = 'failed';
        console.warn('[AceCounter] Script loading failed after 3 attempts.');
      }
    };
    // Retry only a confirmed resource-load failure. A slow or already executed
    // script must not be loaded again, since it could duplicate collection.
    document.head.appendChild(script);
  }
  load();
})();
`;
