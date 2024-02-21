import LocalLogoImage from "../assets/logo.png";

type HeaderLink = {
	id:number,
	label:string,
	image?:{
		obj:any,
		alt:string,
	},
	dest:string,
};

const Header = () => {
	const links:HeaderLink[] = [
		{
			id: 1,
			label: "Home",
			image: {
				alt: "OSL",
				obj: LocalLogoImage,
			},
			dest: "/",
		},
		{
			id: 2,
			label: "Register",
			dest: "/#main",
		},
		{
			id: 3,
			label: "Discord",
			dest: "https://discord.gg/osl",
		},
		{
			id: 4,
			label: "The Pond",
			dest: "/the-pond",
		},
	];

	return (
		<header className="flex justify-center py-3 gap-10 bg-gradient-to-r from-osl-blue-700 via-blue-400 to-osl-blue-700">
			{links.map((link) => (
				<a href={link.dest} key={link.id}>
					{link.image === undefined ?
						<p className="text-white font-bold text-base py-2">{link.label}</p>:
						<img className="text-white font-bold text-base h-10" src={link.image.obj.src} alt={link.image.alt} loading="lazy" />
					}
				</a>
			))}
		</header>
	)
}

export default Header;