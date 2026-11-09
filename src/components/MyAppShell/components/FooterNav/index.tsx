import { AppShell } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import glassClasses from "../../glass.module.css";
import { navLinks } from "../../nav-links";
import classes from "./FooterNav.module.css";

/**
 * The phone tab bar: a floating capsule over the bottom of the page, the way
 * iOS draws it. The page scrolls on underneath and shows through the glass.
 */
export function FooterNav() {
	return (
		<AppShell.Footer
			hiddenFrom="sm"
			withBorder={false}
			className={classes.footer}
		>
			<nav
				aria-label="Main"
				className={`${glassClasses.surface} ${classes.bar}`}
			>
				{navLinks.map(
					({ label, icon: Icon, activeIcon: ActiveIcon, ...link }) => (
						<Link key={link.to} {...link} className={classes.tab}>
							{({ isActive }) => (
								<>
									{isActive ? (
										<ActiveIcon
											className={classes.icon}
											size={24}
											aria-hidden
										/>
									) : (
										<Icon
											className={classes.icon}
											size={24}
											stroke={1.5}
											aria-hidden
										/>
									)}
									<span className={classes.label}>{label}</span>
								</>
							)}
						</Link>
					),
				)}
			</nav>
		</AppShell.Footer>
	);
}
