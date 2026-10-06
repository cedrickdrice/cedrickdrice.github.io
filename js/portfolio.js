(() => {
	const menuButton = document.querySelector(".menu-toggle");
	const navigation = document.querySelector("#site-nav");
	const currentYear = document.querySelector("#current-year");

	if (currentYear) {
		currentYear.textContent = String(new Date().getFullYear());
	}

	if (menuButton && navigation) {
		document.documentElement.classList.add("menu-enhanced");

		const setMenuOpen = (isOpen) => {
			menuButton.setAttribute("aria-expanded", String(isOpen));
			navigation.classList.toggle("is-open", isOpen);
		};

		menuButton.addEventListener("click", () => {
			setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
		});

		navigation.addEventListener("click", (event) => {
			if (event.target instanceof HTMLAnchorElement) {
				setMenuOpen(false);
			}
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				setMenuOpen(false);
				menuButton.focus();
			}
		});
	}

	const experienceCards = [...document.querySelectorAll(".experience-card")];
	const setExperienceOpen = (card, isOpen) => {
		const trigger = card.querySelector(".experience-trigger");
		const panel = card.querySelector(".experience-panel");

		card.classList.toggle("is-open", isOpen);
		trigger.setAttribute("aria-expanded", String(isOpen));
		panel.toggleAttribute("inert", !isOpen);
	};

	experienceCards.forEach((card) => {
		const trigger = card.querySelector(".experience-trigger");
		const isInitiallyOpen = trigger.getAttribute("aria-expanded") === "true";

		setExperienceOpen(card, isInitiallyOpen);
		trigger.addEventListener("click", () => {
			const shouldOpen = trigger.getAttribute("aria-expanded") !== "true";

			experienceCards.forEach((otherCard) => {
				if (otherCard !== card) {
					setExperienceOpen(otherCard, false);
				}
			});

			setExperienceOpen(card, shouldOpen);
		});
	});
})();
