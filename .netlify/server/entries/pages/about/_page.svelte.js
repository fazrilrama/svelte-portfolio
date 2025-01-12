import { c as create_ssr_component, b as each, e as escape } from "../../../chunks/ssr.js";
const skills = {
  programming: ["Javascript", "PHP", "TypeScript", "Go", "Flutter"],
  frameworks: ["Node.js", "Express.js", "React.js", "Vue.js", "Nuxt.js", "Next.js", "Nest.Js", "Laravel", "Codeigniter", "Lumen"],
  databases: ["Mysql", "MongoDB", "Sql Server", "Posgresql"],
  // tools: [],
  languages: ["English"],
  other: ["Docker", "IT Infrastructure", "Web Server (Apache/Nginx)"]
};
const experience = {
  "Sep 2023 - Present": {
    company: "PT. BGR Logistik Indonesia",
    role: "Specialist Programmer",
    type: "Purnawaktu"
  },
  "Feb 2023 - Sep 2023": {
    company: "PT. Erakomp Infonusa",
    role: "Full Stack Developer",
    type: "Purnawaktu"
  },
  "Mei 2022 - Feb 2023": {
    company: "Orbitin",
    role: "Full Stack Developer",
    type: "Purnawaktu"
  },
  "Nov 2021 - Mei 2022": {
    company: "PT Degan Technowave",
    role: "Software Engineer (Backend)",
    type: "Pekerja Lepas"
  },
  "Des 2020 - Mei 2022": {
    company: "CV. Two Dicodding",
    role: "IT Programmer",
    type: "Purnawaktu"
  },
  "Agu 2020 - Okt 2020": {
    company: "PT Bogor Ekspres Media (Radar Bogor)",
    role: "Web Developer",
    type: "Magang"
  }
};
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".container.svelte-1x4k9zh.svelte-1x4k9zh{max-width:900px;padding:0;display:flex;justify-content:center}main.svelte-1x4k9zh.svelte-1x4k9zh{max-width:100%;min-height:500px;text-align:left;margin:0 auto;box-sizing:border-box}h1.svelte-1x4k9zh.svelte-1x4k9zh{font-weight:700;margin:0 0 50px 0;font-size:36px;text-align:start}h2.svelte-1x4k9zh.svelte-1x4k9zh{margin-top:50px}.list.svelte-1x4k9zh.svelte-1x4k9zh{display:flex;flex-direction:column;gap:30px}@media(min-width: 900px){.list.svelte-1x4k9zh.svelte-1x4k9zh{flex-direction:row}main.svelte-1x4k9zh>h1.svelte-1x4k9zh{font-size:48px}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1k8shsz_START -->${$$result.title = `<title>Fazril Ramadhan — About</title>`, ""}<!-- HEAD_svelte-1k8shsz_END -->`, ""} <div class="container svelte-1x4k9zh"><main class="svelte-1x4k9zh"><h1 class="svelte-1x4k9zh" data-svelte-h="svelte-soqi9t">About</h1> <p data-svelte-h="svelte-tu54uw"><strong>Professional Summary</strong> <br>
			Results-driven Backend Engineer with a proven track record in the information technology and services industry. Proficient in a diverse range of technologies, including JavaScript (Node.js, Vue.js, Nuxt.js, React.js, Svelte.js), PHP (Laravel, CodeIgniter, Lumen, Magento), Flutter, and Go, with expertise in problem-solving and data structures. Adept at designing and implementing scalable solutions that drive business success.</p> <p data-svelte-h="svelte-xop5j2"><strong>Unique Value Proposition</strong> <br>
			With a strong foundation in technology and a deep interest in business strategy, I leverage my technical expertise to deliver impactful solutions that align with organizational goals. My experience enables me to bridge the gap between engineering and business, fostering innovation and growth.</p> <p data-svelte-h="svelte-196henx"><strong>Career Vision</strong> <br>
			I am passionate about using technology to solve complex challenges and contribute to the growth of forward-thinking companies. Always eager to learn, adapt, and innovate in dynamic environments.</p> <h2 class="svelte-1x4k9zh" data-svelte-h="svelte-1w8bmy8">Skills</h2> ${each(Object.entries(skills), ([section, technologies]) => {
    return `<ul><li><h4>${escape(section)}:</h4> <div class="list svelte-1x4k9zh">${each(technologies, (technology) => {
      return `<div>${escape(technology)} </div>`;
    })} </div></li> </ul>`;
  })} <h2 class="svelte-1x4k9zh" data-svelte-h="svelte-10mha1a">Experience</h2> ${each(Object.entries(experience), ([section, exp]) => {
    return `<ul><li><h4>${escape(section)}:</h4> <div class="list svelte-1x4k9zh">Company: ${escape(exp.company)} * ${escape(exp.type)} <br>
						Role: ${escape(exp.role)}<br> </div></li> </ul>`;
  })}</main> </div>`;
});
export {
  Page as default
};
