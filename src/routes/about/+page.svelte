<script>
	import skills from '$lib/Skills';
	import experience from '$lib/Experience';
</script>

<svelte:head>
	<title>Fazril Ramadhan — About</title>
</svelte:head>

<div class="container">
	<main>
		<h1>About</h1>
		<p>
			<strong>Professional Summary</strong> <br/>
			Results-driven Backend Engineer with a proven track record in the information technology and services industry. Proficient in a diverse range of technologies, including JavaScript (Node.js, Vue.js, Nuxt.js, React.js, Svelte.js), PHP (Laravel, CodeIgniter, Lumen, Magento), Flutter, and Go, with expertise in problem-solving and data structures. Adept at designing and implementing scalable solutions that drive business success.
		</p>
		<p>
			<strong>Unique Value Proposition</strong> <br/>
			With a strong foundation in technology and a deep interest in business strategy, I leverage my technical expertise to deliver impactful solutions that align with organizational goals. My experience enables me to bridge the gap between engineering and business, fostering innovation and growth.
		</p>
		<p>
			<strong>Career Vision</strong> <br/>
			I am passionate about using technology to solve complex challenges and contribute to the growth of forward-thinking companies. Always eager to learn, adapt, and innovate in dynamic environments.
		</p>
		<h2>Skills</h2>
		{#each Object.entries(skills) as [section, technologies]}
			<ul>
				<li>
					<h4>
						{section}:
					</h4>
					<div class="list">
						{#each technologies as technology}
							<div>
								{technology}
							</div>
						{/each}
					</div>
				</li>
			</ul>
		{/each}
		<h2>Experience</h2>
		{#each Object.entries(experience) as [section, exp]}
			<ul>
				<li>
					<h4>
						{section}:
					</h4>
					<div class="list">
						Company: {exp.company} * {exp.type} <br>
						Role: {exp.role}<br>
					</div>
				</li>
			</ul>
		{/each}
	</main>
</div>

<style>
	.container {
		max-width: 900px;
		padding: 0;
		display: flex;
		justify-content: center;
	}

	main {
		max-width: 100%;
		min-height: 500px;
		text-align: left;
		margin: 0 auto;
		box-sizing: border-box;
	}

	h1 {
		font-weight: 700;
		margin: 0 0 50px 0;
		font-size: 36px;
		text-align: start;
	}

	h2 {
		margin-top: 50px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	@media (min-width: 900px) {
		.list {
			flex-direction: row;
		}
		main > h1 {
			font-size: 48px;
		}
	}
</style>