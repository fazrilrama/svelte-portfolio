<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import FaLinkedin from 'svelte-icons/fa/FaLinkedin.svelte';
	import FaGithub from 'svelte-icons/fa/FaGithub.svelte';
	import FaEnvelope from 'svelte-icons/fa/FaEnvelope.svelte';
	import { modalOpened } from '$lib/store';

	let visible = false;
	let mouseX = 0;
	let mouseY = 0;
	let typedText = '';
	const fullText = "Full Stack Engineer 💻";
	let typeIndex = 0;

	// Typing animation
	onMount(() => {
		visible = true;
		
		const typeInterval = setInterval(() => {
			if (typeIndex < fullText.length) {
				typedText = fullText.slice(0, typeIndex + 1);
				typeIndex++;
			} else {
				clearInterval(typeInterval);
			}
		}, 100);

		// Mouse move effect
		const handleMouseMove = (e) => {
			mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			clearInterval(typeInterval);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});

	const skills = [
		{ icon: '⚡', text: 'Fast Development', delay: 0 },
		{ icon: '🚀', text: 'Scalable Solutions', delay: 100 },
		{ icon: '🎯', text: 'Quality Focused', delay: 200 },
		{ icon: '🤖', text: 'Automation Expert', delay: 300 }
	];

	const socialLinks = [
		{
			icon: FaEnvelope,
			label: 'Email',
			action: () => modalOpened.set(true),
			color: '#EA4335'
		},
		{
			icon: FaGithub,
			label: 'GitHub',
			href: 'https://github.com/fazrilrama',
			color: '#333'
		},
		{
			icon: FaLinkedin,
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/fazrilrmdhnn/',
			color: '#0077B5'
		}
	];
</script>

<svelte:head>
	<title>Fazril Ramadhan - Full Stack Engineer</title>
	<meta name="description" content="Full Stack Engineer specializing in scalable web applications, automation testing, and modern JavaScript frameworks." />
</svelte:head>

{#if visible}
	<main>
		<!-- Background Effects -->
		<div class="background">
			<div class="gradient-orb orb-1" style="transform: translate({mouseX}px, {mouseY}px)"></div>
			<div class="gradient-orb orb-2" style="transform: translate({-mouseX}px, {-mouseY}px)"></div>
			<div class="gradient-orb orb-3" style="transform: translate({mouseY}px, {mouseX}px)"></div>
		</div>

		<div class="content">
			<!-- Hero Section -->
			<div class="hero" in:fade={{ duration: 600 }}>
				<div class="greeting" in:fly={{ y: 30, duration: 800, delay: 100, easing: quintOut }}>
					<span class="wave">👋</span>
					<span>Hey there!</span>
				</div>

				<h1 in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}>
					I'm <span class="gradient-text">Fazril Ramadhan</span>
				</h1>

				<div class="subtitle" in:fly={{ y: 30, duration: 800, delay: 300, easing: quintOut }}>
					<span class="typed-text">{typedText}<span class="cursor">|</span></span>
				</div>

				<p class="description" in:fly={{ y: 30, duration: 800, delay: 400, easing: quintOut }}>
					Crafting scalable solutions with modern technologies.<br>
					Passionate about clean code and automation.
				</p>

				<!-- CTA Buttons -->
				<div class="cta-buttons" in:fly={{ y: 30, duration: 800, delay: 500, easing: quintOut }}>
					<a href="/about" class="btn btn-primary">
						<span>View My Work</span>
						<span class="arrow">→</span>
					</a>
					<a href="/articles" class="btn btn-secondary">
						<span>Read Articles</span>
					</a>
				</div>
			</div>

			<!-- Skills Grid -->
			<div class="skills-grid">
				{#each skills as skill, idx}
					<div 
						class="skill-card"
						in:scale={{ duration: 500, delay: 600 + skill.delay, easing: elasticOut }}
					>
						<div class="skill-icon">{skill.icon}</div>
						<div class="skill-text">{skill.text}</div>
					</div>
				{/each}
			</div>

			<!-- Social Links -->
			<div class="social-section" in:fly={{ y: 30, duration: 800, delay: 900, easing: quintOut }}>
				<div class="social-title">Let's Connect</div>
				<div class="social-links">
					{#each socialLinks as social, idx}
						{#if social.href}
							<a
								href={social.href}
								aria-label={social.label}
								target="_blank"
								rel="noopener noreferrer"
								class="social-link"
								style="--hover-color: {social.color}"
								in:scale={{ duration: 400, delay: 1000 + (idx * 100), easing: elasticOut }}
							>
								<div class="social-icon">
									<svelte:component this={social.icon} />
								</div>
								<span class="social-label">{social.label}</span>
							</a>
						{:else}
							<button
								on:click={social.action}
								aria-label={social.label}
								class="social-link"
								style="--hover-color: {social.color}"
								in:scale={{ duration: 400, delay: 1000 + (idx * 100), easing: elasticOut }}
							>
								<div class="social-icon">
									<svelte:component this={social.icon} />
								</div>
								<span class="social-label">{social.label}</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	:global(body) {
		--primary: #6366F1;
		--secondary: #EC4899;
		--accent: #14B8A6;
		--text-primary: #F1F5F9;
		--text-secondary: #94A3B8;
	}

	main {
		position: relative;
		min-height: calc(100vh - 80px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px 20px;
		overflow: hidden;
	}

	/* Background Effects */
	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
	}

	.gradient-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		opacity: 0.3;
		transition: transform 0.3s ease-out;
	}

	.orb-1 {
		width: 500px;
		height: 500px;
		background: var(--primary);
		top: -200px;
		right: -200px;
		animation: float 15s ease-in-out infinite;
	}

	.orb-2 {
		width: 400px;
		height: 400px;
		background: var(--secondary);
		bottom: -150px;
		left: -150px;
		animation: float 20s ease-in-out infinite reverse;
	}

	.orb-3 {
		width: 350px;
		height: 350px;
		background: var(--accent);
		top: 50%;
		left: 50%;
		animation: float 18s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translate(0, 0) rotate(0deg); }
		33% { transform: translate(30px, -30px) rotate(120deg); }
		66% { transform: translate(-20px, 20px) rotate(240deg); }
	}

	/* Content */
	.content {
		position: relative;
		z-index: 10;
		max-width: 1000px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 60px;
	}

	/* Hero Section */
	.hero {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.greeting {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 24px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.wave {
		display: inline-block;
		animation: wave 2s ease-in-out infinite;
		font-size: 32px;
	}

	@keyframes wave {
		0%, 100% { transform: rotate(0deg); }
		25% { transform: rotate(20deg); }
		75% { transform: rotate(-20deg); }
	}

	h1 {
		font-size: clamp(36px, 8vw, 72px);
		font-weight: 800;
		line-height: 1.2;
		margin: 0;
		color: var(--text-primary);
	}

	.gradient-text {
		background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		background-size: 200% 200%;
		animation: gradientShift 4s ease infinite;
	}

	@keyframes gradientShift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	.subtitle {
		font-size: clamp(24px, 4vw, 32px);
		font-weight: 600;
		color: var(--accent);
		font-family: 'JetBrains Mono', monospace;
	}

	.typed-text {
		position: relative;
	}

	.cursor {
		animation: blink 1s step-end infinite;
		color: var(--accent);
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

	.description {
		font-size: 18px;
		line-height: 1.8;
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0;
	}

	/* CTA Buttons */
	.cta-buttons {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 20px;
	}

	.btn {
		padding: 14px 32px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 16px;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: none;
		cursor: pointer;
		font-family: inherit;
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		color: white;
		box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
	}

	.btn-primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 15px 40px rgba(99, 102, 241, 0.5);
	}

	.btn-primary .arrow {
		transition: transform 0.3s;
	}

	.btn-primary:hover .arrow {
		transform: translateX(4px);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-primary);
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--accent);
		transform: translateY(-3px);
	}

	/* Skills Grid */
	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
		width: 100%;
		max-width: 900px;
	}

	.skill-card {
		padding: 24px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
	}

	.skill-card:hover {
		transform: translateY(-8px);
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--accent);
		box-shadow: 0 15px 40px rgba(20, 184, 166, 0.2);
	}

	.skill-icon {
		font-size: 40px;
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.skill-card:nth-child(1) .skill-icon { animation-delay: 0s; }
	.skill-card:nth-child(2) .skill-icon { animation-delay: 0.2s; }
	.skill-card:nth-child(3) .skill-icon { animation-delay: 0.4s; }
	.skill-card:nth-child(4) .skill-icon { animation-delay: 0.6s; }

	.skill-text {
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
	}

	/* Social Section */
	.social-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		width: 100%;
	}

	.social-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.social-links {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.social-link {
		width: 120px;
		height: 120px;
		background: rgba(255, 255, 255, 0.03);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		text-decoration: none;
		color: var(--text-primary);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.social-link::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--hover-color);
		transform: scaleX(0);
		transition: transform 0.3s;
	}

	.social-link:hover {
		transform: translateY(-8px);
		background: rgba(255, 255, 255, 0.08);
		border-color: var(--hover-color);
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
	}

	.social-link:hover::before {
		transform: scaleX(1);
	}

	.social-icon {
		width: 40px;
		height: 40px;
		transition: transform 0.3s;
	}

	.social-link:hover .social-icon {
		transform: scale(1.2) rotate(5deg);
	}

	.social-label {
		font-size: 14px;
		font-weight: 600;
	}

	/* Scroll Indicator */
	.scroll-indicator {
		position: absolute;
		bottom: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: var(--text-secondary);
		font-size: 14px;
		animation: fadeInOut 3s ease-in-out infinite;
	}

	.scroll-arrow {
		font-size: 24px;
		animation: scrollBounce 2s ease-in-out infinite;
	}

	@keyframes fadeInOut {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 1; }
	}

	@keyframes scrollBounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(10px); }
	}

	/* Responsive */
	@media (max-width: 768px) {
		main {
			padding: 20px 16px;
			min-height: calc(100vh - 60px);
		}

		.greeting {
			font-size: 20px;
		}

		.wave {
			font-size: 28px;
		}

		.description {
			font-size: 16px;
		}

		.cta-buttons {
			flex-direction: column;
			width: 100%;
			max-width: 300px;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}

		.skills-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
		}

		.skill-card {
			padding: 20px;
		}

		.skill-icon {
			font-size: 32px;
		}

		.skill-text {
			font-size: 13px;
		}

		.social-link {
			width: 100px;
			height: 100px;
		}

		.social-icon {
			width: 32px;
			height: 32px;
		}

		.scroll-indicator {
			bottom: 20px;
		}
	}

	@media (max-width: 480px) {
		.skills-grid {
			grid-template-columns: 1fr;
		}
	}
</style>