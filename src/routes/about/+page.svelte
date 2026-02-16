<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import skills from '$lib/Skills';
	import experience from '$lib/Experience';

	let visible = false;
	let activeSkillCategory = null;
	let activeExperience = null;

	onMount(() => {
		visible = true;
	});

	function handleSkillHover(category) {
		activeSkillCategory = category;
	}

	function handleExpHover(index) {
		activeExperience = index;
	}
</script>

<svelte:head>
	<title>Fazril Ramadhan — About</title>
</svelte:head>

<div class="container">
	{#if visible}
		<main>
			<!-- Hero Section -->
			<div class="hero-section" in:fade={{ duration: 600 }}>
				<h1 in:fly={{ y: 30, duration: 800, delay: 100, easing: quintOut }}>
					About Me
				</h1>
				<div class="hero-tagline" in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}>
					<span class="gradient-text">Full Stack Engineer</span> passionate about building scalable solutions
				</div>
			</div>

			<!-- Professional Summary - Full Width -->
			<div class="professional-summary" in:fly={{ y: 40, duration: 700, delay: 300, easing: quintOut }}>
				<div class="summary-header">
					<div class="card-icon">💼</div>
					<h2>Professional Summary</h2>
				</div>
				<p>
					Results-driven Backend Engineer with a proven track record in the information technology and services industry. Proficient in a diverse range of technologies, including JavaScript (Node.js, Vue.js, Nuxt.js, React.js, Svelte.js), PHP (Laravel, CodeIgniter, Lumen, Magento), Flutter, and Go, with expertise in problem-solving, data structures, and automation testing. Adept at designing and implementing scalable solutions that drive business success.
				</p>
			</div>

			<!-- Value Proposition & Career Vision - Two Columns -->
			<div class="summary-grid">
				<div class="summary-card" in:fly={{ y: 40, duration: 700, delay: 400, easing: quintOut }}>
					<div class="card-icon">🎯</div>
					<h3>Unique Value Proposition</h3>
					<p>
						With a strong foundation in technology and a deep interest in business strategy, I leverage my technical expertise to deliver impactful solutions that align with organizational goals. My experience enables me to bridge the gap between engineering and business, fostering innovation and growth through quality assurance and automated testing practices.
					</p>
				</div>

				<div class="summary-card" in:fly={{ y: 40, duration: 700, delay: 500, easing: quintOut }}>
					<div class="card-icon">🚀</div>
					<h3>Career Vision</h3>
					<p>
						I am passionate about using technology to solve complex challenges and contribute to the growth of forward-thinking companies. Always eager to learn, adapt, and innovate in dynamic environments, with a focus on delivering reliable, well-tested solutions.
					</p>
				</div>
			</div>

			<!-- Skills Section -->
			<section class="skills-section" in:fly={{ y: 40, duration: 700, delay: 600, easing: quintOut }}>
				<h2>
					<span class="section-number">01.</span> Technical Skills
				</h2>
				<div class="skills-grid">
					{#each Object.entries(skills) as [section, technologies], idx}
						<div 
							class="skill-category" 
							class:active={activeSkillCategory === section}
							on:mouseenter={() => handleSkillHover(section)}
							on:mouseleave={() => handleSkillHover(null)}
							in:scale={{ duration: 500, delay: 700 + (idx * 100), easing: quintOut }}
						>
							<h4>
								<span class="skill-icon">//</span> {section}
							</h4>
							<div class="tech-tags">
								{#each technologies as technology}
									<span class="tech-tag">{technology}</span>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Experience Section -->
			<section class="experience-section" in:fly={{ y: 40, duration: 700, delay: 800, easing: quintOut }}>
				<h2>
					<span class="section-number">02.</span> Work Experience
				</h2>
				<div class="experience-timeline">
					{#each Object.entries(experience) as [period, exp], idx}
						<div 
							class="timeline-item"
							class:active={activeExperience === idx}
							on:mouseenter={() => handleExpHover(idx)}
							on:mouseleave={() => handleExpHover(null)}
							in:fly={{ x: -30, duration: 600, delay: 900 + (idx * 100), easing: quintOut }}
						>
							<div class="timeline-dot"></div>
							<div class="timeline-content">
								<div class="timeline-period">{period}</div>
								<h3>{exp.role}</h3>
								<div class="company-info">
									<span class="company-name">{exp.company}</span>
									<span class="company-type">{exp.type}</span>
								</div>
								{#if exp.description}
									<p class="experience-description">{exp.description}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</section>
		</main>
	{/if}
</div>

<style>
	:global(body) {
		--primary: #6366F1;
		--secondary: #EC4899;
		--accent: #14B8A6;
		--text-primary: #F1F5F9;
		--text-secondary: #94A3B8;
		--bg-card: rgba(255, 255, 255, 0.03);
		--border-color: rgba(255, 255, 255, 0.1);
	}

	.container {
		max-width: 1200px;
		padding: 60px 20px;
		margin: 0 auto;
	}

	main {
		width: 100%;
		min-height: 500px;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 80px;
	}

	h1 {
		font-weight: 800;
		margin: 0 0 20px 0;
		font-size: 48px;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-tagline {
		font-size: 20px;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.gradient-text {
		background: linear-gradient(135deg, var(--secondary), var(--primary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-weight: 700;
	}

	/* Professional Summary - Full Width */
	.professional-summary {
		padding: 40px;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 20px;
		margin-bottom: 40px;
		position: relative;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.professional-summary::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--primary), var(--accent));
	}

	.professional-summary:hover {
		border-color: var(--primary);
		box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2);
		background: rgba(255, 255, 255, 0.05);
	}

	.summary-header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 20px;
	}

	.summary-header h2 {
		font-size: 28px;
		font-weight: 700;
		margin: 0;
		color: var(--text-primary);
	}

	.professional-summary p {
		font-size: 17px;
		line-height: 1.8;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Summary Cards Grid - Two Columns */
	.summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 24px;
		margin-bottom: 100px;
	}

	.summary-card {
		padding: 32px;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.summary-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--primary), var(--accent));
		transform: scaleX(0);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.summary-card:hover {
		transform: translateY(-8px);
		border-color: var(--primary);
		box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2);
		background: rgba(255, 255, 255, 0.05);
	}

	.summary-card:hover::before {
		transform: scaleX(1);
	}

	.card-icon {
		font-size: 48px;
		margin-bottom: 16px;
		display: inline-block;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-10px); }
	}

	.summary-card h3 {
		font-size: 24px;
		font-weight: 700;
		margin-bottom: 16px;
		color: var(--text-primary);
	}

	.summary-card p {
		font-size: 16px;
		line-height: 1.7;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Section Headers */
	h2 {
		font-size: 36px;
		font-weight: 800;
		margin: 0 0 40px 0;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.section-number {
		font-family: 'JetBrains Mono', monospace;
		font-size: 24px;
		color: var(--accent);
		font-weight: 600;
	}

	/* Skills Section */
	.skills-section {
		margin-bottom: 100px;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
	}

	.skill-category {
		padding: 28px;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
	}

	.skill-category:hover,
	.skill-category.active {
		border-color: var(--accent);
		box-shadow: 0 15px 50px rgba(20, 184, 166, 0.2);
		transform: translateY(-5px);
		background: rgba(20, 184, 166, 0.05);
	}

	.skill-category h4 {
		font-family: 'JetBrains Mono', monospace;
		font-size: 18px;
		font-weight: 700;
		margin: 0 0 20px 0;
		color: var(--accent);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.skill-icon {
		color: var(--primary);
		font-size: 20px;
	}

	.tech-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.tech-tag {
		padding: 8px 16px;
		background: rgba(99, 102, 241, 0.1);
		border: 1px solid rgba(99, 102, 241, 0.3);
		border-radius: 8px;
		font-size: 14px;
		color: var(--text-primary);
		transition: all 0.2s;
		font-weight: 500;
	}

	.tech-tag:hover {
		background: rgba(99, 102, 241, 0.2);
		border-color: var(--primary);
		transform: translateY(-2px);
	}

	/* Experience Section */
	.experience-section {
		margin-bottom: 60px;
	}

	.experience-timeline {
		position: relative;
		padding-left: 40px;
	}

	.experience-timeline::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(180deg, var(--primary), var(--accent));
	}

	.timeline-item {
		position: relative;
		margin-bottom: 40px;
		padding-left: 40px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.timeline-dot {
		position: absolute;
		left: -39px;
		top: 8px;
		width: 16px;
		height: 16px;
		background: var(--primary);
		border: 3px solid var(--bg-card);
		border-radius: 50%;
		transition: all 0.3s;
		z-index: 1;
	}

	.timeline-item:hover .timeline-dot,
	.timeline-item.active .timeline-dot {
		background: var(--accent);
		transform: scale(1.3);
		box-shadow: 0 0 20px rgba(20, 184, 166, 0.6);
	}

	.timeline-content {
		padding: 24px;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.timeline-item:hover .timeline-content,
	.timeline-item.active .timeline-content {
		border-color: var(--primary);
		background: rgba(99, 102, 241, 0.05);
		transform: translateX(8px);
		box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2);
	}

	.timeline-period {
		font-family: 'JetBrains Mono', monospace;
		font-size: 13px;
		color: var(--accent);
		font-weight: 600;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.timeline-content h3 {
		font-size: 20px;
		font-weight: 700;
		margin: 0 0 12px 0;
		color: var(--text-primary);
	}

	.company-info {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 12px;
	}

	.company-name {
		font-size: 15px;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.company-type {
		padding: 4px 12px;
		background: rgba(236, 72, 153, 0.1);
		border: 1px solid rgba(236, 72, 153, 0.3);
		border-radius: 6px;
		font-size: 12px;
		color: var(--secondary);
		font-weight: 600;
	}

	.experience-description {
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin-top: 12px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.container {
			padding: 40px 16px;
		}

		h1 {
			font-size: 36px;
		}

		h2 {
			font-size: 28px;
		}

		.hero-tagline {
			font-size: 18px;
		}

		.professional-summary {
			padding: 28px;
		}

		.summary-header h2 {
			font-size: 24px;
		}

		.professional-summary p {
			font-size: 15px;
		}

		.summary-grid {
			grid-template-columns: 1fr;
			margin-bottom: 60px;
		}

		.skills-grid {
			grid-template-columns: 1fr;
		}

		.experience-timeline {
			padding-left: 30px;
		}

		.timeline-item {
			padding-left: 30px;
		}

		.timeline-dot {
			left: -34px;
		}
	}

	@media (min-width: 900px) {
		h1 {
			font-size: 64px;
		}

		h2 {
			font-size: 42px;
		}

		.summary-header h2 {
			font-size: 32px;
		}
	}
</style>