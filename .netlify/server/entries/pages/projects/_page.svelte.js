import { c as create_ssr_component, b as each, e as escape, a as add_attribute } from "../../../chunks/ssr.js";
const projects = [
  {
    title: "GDLauncher",
    technologies: ["Node", "React", "Redux", "Electron"],
    description: "GDLauncher is a simple, yet powerful Minecraft custom launcher with a strong focus on the user experience",
    url: "https://github.com/gorilla-devs/GDLauncher"
  },
  {
    title: "WiseMan Discord Bot",
    technologies: ["NodeJs", "FireBase", "MongoDb", "golang"],
    description: "The wiseMan bot allows you to level up based on the time you spend in a vocal channel",
    url: "https://github.com/Ladvace/WiseMan-DiscordBot"
  },
  {
    title: "Easy-react-carousel",
    technologies: ["React", "NodeJs"],
    description: "A simple carousel made in reactjs",
    url: "https://github.com/Ladvace/easy-react-carousel"
  }
];
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".projectContainer.svelte-dtt2x3.svelte-dtt2x3{width:100%;max-width:900px;display:flex;justify-content:center;box-sizing:border-box;text-align:center;padding:1em;margin:0 auto;text-align:center}.note.svelte-dtt2x3.svelte-dtt2x3{opacity:0.5;margin:0;max-width:900px;text-align:left}a.svelte-dtt2x3.svelte-dtt2x3{text-decoration:none}.projectContainer.svelte-dtt2x3 .projects.svelte-dtt2x3{display:grid;grid-template-columns:1fr;grid-gap:40px;margin-top:30px}h1.svelte-dtt2x3.svelte-dtt2x3{font-weight:700;text-align:start}h2.svelte-dtt2x3.svelte-dtt2x3{display:flex;margin:0}.project.svelte-dtt2x3.svelte-dtt2x3{text-align:start;box-sizing:border-box;display:flex;flex-direction:column;color:white;background:#111;padding:2rem;width:100%;border-radius:5px;transition:transform 0.2s ease-in-out;border-radius:25px}.project.svelte-dtt2x3 p.svelte-dtt2x3{font-weight:100;color:#708090}.projects.svelte-dtt2x3.svelte-dtt2x3{width:100%;margin:50px auto;display:grid;grid-gap:1rem;grid-template-columns:1fr;margin-bottom:10px}.techsContainer.svelte-dtt2x3.svelte-dtt2x3{display:flex;flex-wrap:wrap;gap:10px}.techs.svelte-dtt2x3.svelte-dtt2x3{display:flex;justify-content:space-between;align-items:center}.techs.svelte-dtt2x3>div.svelte-dtt2x3{margin:0 0 0 10px}.button.svelte-dtt2x3.svelte-dtt2x3{display:flex;justify-content:center;align-items:center;color:white;border:2px solid white;padding:10px}@media(min-width: 900px){.projectContainer.svelte-dtt2x3.svelte-dtt2x3{padding:0}.projects.svelte-dtt2x3>h1.svelte-dtt2x3{font-size:48px;margin:50px 0 0 0}.projects.svelte-dtt2x3.svelte-dtt2x3{grid-template-columns:1fr}.projects.svelte-dtt2x3 .project.svelte-dtt2x3{min-height:200px}.button.svelte-dtt2x3.svelte-dtt2x3{max-width:200px}}@media(min-width: 600px){.projects.svelte-dtt2x3.svelte-dtt2x3{grid-template-columns:1fr}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-12ozewt_START -->${$$result.title = `<title>Gianmarco Cavallo — Projects</title>`, ""}<!-- HEAD_svelte-12ozewt_END -->`, ""} <div class="projectContainer svelte-dtt2x3"><div class="projects svelte-dtt2x3"><h1 class="svelte-dtt2x3" data-svelte-h="svelte-136d6se">Projects</h1> <p class="note svelte-dtt2x3" data-svelte-h="svelte-g1lemg">Note: most of my projects are under NDA so I am unable to share those projects. If there is
			anything you would like to see further, please feel free to contact me.</p> ${each(projects, (project) => {
    return `<div class="project svelte-dtt2x3"><div class="header"><h2 class="svelte-dtt2x3">${escape(project.title)}</h2> <div class="techsContainer svelte-dtt2x3">Technologies:
						<div class="techs svelte-dtt2x3">${each(project.technologies, (tech) => {
      return `<div class="svelte-dtt2x3">${escape(tech)}</div>`;
    })}</div> </div></div> <p class="svelte-dtt2x3">${escape(project.description)}</p> <a${add_attribute("href", project.url, 0)} target="_blank" rel="noreferrer" class="svelte-dtt2x3"><div class="button svelte-dtt2x3" data-svelte-h="svelte-1izmg24">Project url =&gt;</div></a> </div>`;
  })}</div> </div>`;
});
export {
  Page as default
};
