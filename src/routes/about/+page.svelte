<script>
	import skills from '$lib/Skills';
</script>

<svelte:head>
	<title>Fazril Ramadhan — About</title>
</svelte:head>

<div class="container">
	<main>
		<h1>About</h1>
		<p>
			I'm a Software developer with over 2 years of Full Stack developer experience, experienced in
			both enterprise and open-source software development. I'm based in Jakarta and currently working as a Full Stack Developer and coding in Node.js, Vue.js or Nuxt JS (and other web technologies), with the experience and learning that I have gone through, I hope we can collaborate and make the best contribution to your company.
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
