/*
 * Personaliza aquí "Mi Inicio".
 *
 * favorites: apps de la fila principal, en este orden. "match" se compara con
 * el nombre de la app instalada (sin distinguir mayúsculas). Si la app no está
 * instalada en la tele, simplemente no aparece.
 *
 * Para ver los nombres/IDs exactos de tus apps:  python3 tools/samsung_tv.py apps
 * También puedes poner "id" en lugar de "match" para fijar una app concreta.
 */
var CONFIG = {
    userName: "",            // p. ej. "Raúl" → "Buenas noches, Raúl"
    showOtherApps: true,     // fila con el resto de apps instaladas
    hideApps: [              // apps que nunca quieres ver (por nombre)
        /tv plus/i, /e-manual/i, /universal guide/i, /gaming hub/i
    ],
    favorites: [
        { label: "Netflix",     match: /netflix/i,          color: "#e50914" },
        { label: "YouTube",     match: /^youtube$/i,        color: "#ff0000" },
        { label: "Prime Video", match: /prime video/i,      color: "#00a8e1" },
        { label: "Disney+",     match: /disney/i,           color: "#113ccf" },
        { label: "Max",         match: /^(hbo )?max$/i,     color: "#002be7" },
        { label: "Apple TV",    match: /apple tv/i,         color: "#1c1c1e" },
        { label: "Spotify",     match: /spotify/i,          color: "#1db954" },
        { label: "Plex",        match: /plex/i,             color: "#e5a00d" }
    ]
};
