

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/privacy-policy/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.9ec11590.js","_app/immutable/chunks/scheduler.16623d43.js","_app/immutable/chunks/index.41a3c3dd.js","_app/immutable/chunks/Constants.4288b6fd.js"];
export const stylesheets = ["_app/immutable/assets/6.ff5aa868.css"];
export const fonts = [];
