/* Mi Inicio — pantalla de inicio propia para Samsung Tizen.
 * Fuera de la tele (abriendo index.html en un navegador) usa apps de ejemplo. */
(function () {
    "use strict";

    var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, BACK: 10009, ESC: 27 };
    var isTizen = typeof window.tizen !== "undefined" && tizen.application;
    var selfId = isTizen ? tizen.application.getCurrentApplication().appInfo.id : null;

    var rows = [];          // [{ title, small, apps: [{id,name,icon,color}] }]
    var focus = { row: 0, col: 0 };

    // ---------- Datos ----------

    function loadInstalledApps(done) {
        if (!isTizen) {
            done(["Netflix", "YouTube", "Prime Video", "Disney+", "Max", "Spotify",
                  "Navegador", "Galería", "Samsung TV Plus", "Twitch"].map(function (n, i) {
                return { id: "demo." + i, name: n, iconPath: "", show: true };
            }));
            return;
        }
        tizen.application.getAppsInfo(done, function (err) {
            toast("No se pudieron leer las apps: " + err.message);
            done([]);
        });
    }

    function matches(pattern, name) {
        if (pattern instanceof RegExp) return pattern.test(name);
        return name.toLowerCase().indexOf(String(pattern).toLowerCase()) !== -1;
    }

    function buildRows(installed) {
        var visible = installed.filter(function (a) {
            return a.show !== false && a.id !== selfId && a.name &&
                !CONFIG.hideApps.some(function (p) { return matches(p, a.name); });
        });
        var used = {};

        var favs = [];
        CONFIG.favorites.forEach(function (f) {
            var app = visible.filter(function (a) {
                return !used[a.id] && (f.id ? a.id === f.id : matches(f.match, a.name));
            })[0];
            if (app) {
                used[app.id] = true;
                favs.push({ id: app.id, name: f.label || app.name, icon: "", color: f.color });
            }
        });

        var others = visible
            .filter(function (a) { return !used[a.id]; })
            .sort(function (a, b) { return a.name.localeCompare(b.name); })
            .map(function (a) { return { id: a.id, name: a.name, icon: a.iconPath || "" }; });

        var result = [];
        if (favs.length) result.push({ title: "Favoritas", apps: favs });
        if (CONFIG.showOtherApps && others.length) result.push({ title: "Otras apps", small: true, apps: others });
        return result;
    }

    // ---------- Render ----------

    function render() {
        var main = document.getElementById("rows");
        main.innerHTML = "";
        rows.forEach(function (row, r) {
            var section = document.createElement("section");
            section.className = "row" + (row.small ? " small" : "");
            var h = document.createElement("h2");
            h.textContent = row.title;
            var tiles = document.createElement("div");
            tiles.className = "tiles";
            row.apps.forEach(function (app, c) {
                var t = document.createElement("div");
                t.className = "tile";
                t.id = "tile-" + r + "-" + c;
                if (app.color) t.style.setProperty("--tile-color", app.color);
                if (app.icon) {
                    var img = document.createElement("img");
                    img.src = app.icon;
                    img.onerror = function () { img.remove(); };
                    t.appendChild(img);
                }
                var s = document.createElement("span");
                s.textContent = app.name;
                t.appendChild(s);
                t.addEventListener("click", function () { focus = { row: r, col: c }; updateFocus(); launch(app); });
                tiles.appendChild(t);
            });
            section.appendChild(h);
            section.appendChild(tiles);
            main.appendChild(section);
        });
        if (!rows.length) {
            main.innerHTML = "<section class='row'><h2>No hay apps para mostrar</h2></section>";
        }
        clampFocus();
        updateFocus();
    }

    function clampFocus() {
        if (!rows.length) return;
        focus.row = Math.max(0, Math.min(focus.row, rows.length - 1));
        focus.col = Math.max(0, Math.min(focus.col, rows[focus.row].apps.length - 1));
    }

    function updateFocus() {
        var prev = document.querySelector(".tile.focused");
        if (prev) prev.classList.remove("focused");
        var el = document.getElementById("tile-" + focus.row + "-" + focus.col);
        if (!el) return;
        el.classList.add("focused");
        // Desplaza la fila para que la ficha enfocada sea visible.
        var tiles = el.parentNode;
        var viewport = tiles.parentNode.clientWidth;
        var offset = el.offsetLeft + el.offsetWidth - viewport + 60;
        tiles.style.transform = "translateX(" + (-Math.max(0, offset)) + "px)";
    }

    // ---------- Acciones ----------

    function launch(app) {
        if (!isTizen) { toast("(demo) Abriendo " + app.name); return; }
        tizen.application.launch(app.id, null, function (err) {
            toast("No se pudo abrir " + app.name + ": " + err.message);
        });
    }

    var toastTimer;
    function toast(msg) {
        var el = document.getElementById("toast");
        el.textContent = msg;
        el.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3000);
    }

    function onKey(e) {
        if (!rows.length) return;
        switch (e.keyCode) {
            case KEY.LEFT:  focus.col--; break;
            case KEY.RIGHT: focus.col++; break;
            case KEY.UP:    focus.row--; break;
            case KEY.DOWN:  focus.row++; break;
            case KEY.ENTER: launch(rows[focus.row].apps[focus.col]); return;
            case KEY.BACK:
            case KEY.ESC:
                if (focus.row || focus.col) { focus = { row: 0, col: 0 }; break; }
                if (isTizen) tizen.application.getCurrentApplication().exit();
                return;
            default: return;
        }
        e.preventDefault();
        clampFocus();
        updateFocus();
    }

    // ---------- Reloj ----------

    function tick() {
        var now = new Date();
        var h = now.getHours();
        var saludo = h < 6 ? "Buenas noches" : h < 13 ? "Buenos días" : h < 21 ? "Buenas tardes" : "Buenas noches";
        document.getElementById("greeting").textContent = saludo + (CONFIG.userName ? ", " + CONFIG.userName : "");
        document.getElementById("time").textContent =
            ("0" + h).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);
        var fecha = now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
        document.getElementById("date").textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    }

    // ---------- Arranque ----------

    function refresh() {
        loadInstalledApps(function (installed) {
            rows = buildRows(installed);
            render();
        });
    }

    document.addEventListener("keydown", onKey);
    // Al volver a la app (p. ej. tras instalar algo), recarga la lista.
    document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
    tick();
    setInterval(tick, 10000);
    refresh();
})();
