/* ES5 runtime for Samsung Tizen 4.0. No remote assets or telemetry. */
(function () {
  'use strict';
  var apps = [
    {name: 'Netflix', key: 'netflix', id: 'RN1MCdNq8t.Netflix', match: /^netflix$/i},
    {name: 'Prime Video', key: 'prime', match: /prime.?video|amazon.*video|amazon instant/i},
    {name: 'YouTube', key: 'youtube', id: '9Ur5IzDKqV.TizenYouTube', match: /^youtube$/i},
    {name: 'HDMI', key: 'hdmi'}
  ];
  var tiles = document.getElementById('tiles');
  var status = document.getElementById('status');
  var selected = 0;
  var mode = 'home';
  var sources = [];
  var busy = false;
  var onTV = typeof tizen !== 'undefined';
  function message(text) { status.textContent = text; }
  function fail(error) {
    busy = false;
    message('Niet gelukt: ' + (error && (error.message || error.name) || 'onbekende fout') + '. Probeer opnieuw.');
  }
  function focus(index) {
    var buttons = tiles.getElementsByTagName('button');
    selected = Math.max(0, Math.min(index, buttons.length - 1));
    if (buttons[selected]) { buttons[selected].focus(); }
  }
  function render(items) {
    tiles.textContent = '';
    for (var i = 0; i < items.length; i++) {
      (function (item, index) {
        var button = document.createElement('button');
        button.className = 'tile ' + (item.key || 'hdmi');
        button.textContent = item.name;
        button.addEventListener('focus', function () { selected = index; });
        button.addEventListener('click', function () { activate(index); });
        tiles.appendChild(button);
      }(items[i], i));
    }
    focus(0);
  }
  function launch(app) {
    if (!onTV) { message('Voorbeeld: ' + app.name + ' openen werkt op de tv.'); return; }
    busy = true;
    message(app.name + ' zoeken…');
    try {
      tizen.application.getAppsInfo(function (installed) {
        var matches = [];
        var preferred = null;
        for (var i = 0; i < installed.length; i++) {
          if (app.id && installed[i].id === app.id) { preferred = installed[i]; }
          if (app.match.test(installed[i].name)) { matches.push(installed[i]); }
        }
        if (preferred) { matches = [preferred]; }
        if (matches.length !== 1) {
          busy = false;
          message(matches.length ? 'Meerdere apps gevonden voor ' + app.name + '; configuratie nodig.' : app.name + ' niet gevonden. Installeer de app eerst via Samsung Apps.');
          return;
        }
        try {
          tizen.application.launch(matches[0].id, function () {
            busy = false; message(app.name + ' geopend.');
          }, fail);
        } catch (error) { fail(error); }
      }, fail);
    } catch (error) { fail(error); }
  }
  function chooseHDMI() {
    if (!onTV) {
      mode = 'sources';
      sources = [{name: 'HDMI 1', number: 1}, {name: 'HDMI 2', number: 2}];
      render(sources); message('Voorbeeldingangen; de tv bepaalt welke ingangen beschikbaar zijn.'); return;
    }
    busy = true;
    try {
      tizen.systeminfo.getPropertyValue('VIDEOSOURCE', function (info) {
        busy = false; sources = [];
        for (var i = 0; i < info.connected.length; i++) {
          if (info.connected[i].type === 'HDMI') {
            sources.push({name: 'HDMI ' + info.connected[i].number, source: info.connected[i]});
          }
        }
        if (!sources.length) { message('Geen aangesloten HDMI-ingangen gevonden.'); return; }
        mode = 'sources'; render(sources); message('Kies een HDMI-ingang.');
      }, fail);
    } catch (error) { fail(error); }
  }
  function showHDMI(item) {
    if (!onTV) { message('Voorbeeld: ' + item.name + ' weergeven werkt op de tv.'); return; }
    busy = true;
    try {
      tizen.tvwindow.setSource(item.source, function () {
        try {
          tizen.tvwindow.show(function () {
            busy = false; mode = 'video'; document.body.className = 'video';
          }, fail, ['0px', '0px', '100%', '100%'], 'MAIN', 'FRONT');
        } catch (error) { fail(error); }
      }, fail);
    } catch (error) { fail(error); }
  }
  function activate(index) {
    if (busy) { return; }
    if (mode === 'sources') { showHDMI(sources[index]); }
    else if (apps[index].key === 'hdmi') { chooseHDMI(); }
    else { launch(apps[index]); }
  }
  function home() {
    mode = 'home'; document.body.className = ''; render(apps); message('');
  }
  function back() {
    if (busy) { return; }
    if (mode === 'video') {
      busy = true;
      try { tizen.tvwindow.hide(function () { busy = false; home(); }, fail); }
      catch (error) { fail(error); }
    } else if (mode === 'sources') { home(); }
    else if (onTV) {
      try { tizen.application.getCurrentApplication().exit(); } catch (error) { fail(error); }
    } else { message('Voorbeeld: Terug sluit de app op de tv.'); }
  }
  document.addEventListener('keydown', function (event) {
    var key = event.keyCode;
    if (key === 10009 || key === 27) { event.preventDefault(); back(); return; }
    if (mode === 'video' || busy) { return; }
    if (key === 37 || key === 38) { event.preventDefault(); focus(selected - 1); }
    else if (key === 39 || key === 40) { event.preventDefault(); focus(selected + 1); }
    /* Enter uses the focused native button's click; avoid double launch. */
  });
  function clock() {
    var now = new Date();
    document.getElementById('clock').textContent = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
  }
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && mode !== 'video') { busy = false; focus(selected); }
  });
  render(apps); clock(); setInterval(clock, 30000);
  message(onTV ? 'Kies een app of ingang.' : 'Browservoorbeeld — apps openen en HDMI werken alleen op de tv.');
}());
