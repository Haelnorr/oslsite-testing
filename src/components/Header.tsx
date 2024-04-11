import LocalLogoImage from "../assets/logo.png";
import ProfileImage from "../assets/icons8-male-user-96.png";

type HeaderLink = {
	id:number,
	label:string,
	image?:{
		obj:any,
		alt:string,
		isLogo:boolean,
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
				isLogo:true,
			},
			dest: "/",
		},
		{
			id: 2,
			label: "League",
			dest: "/league"
		},
		{
			id: 3,
			label: "Discord",
			dest: "https://slapshot.gg/OSL",
		},
		{
			id: 4,
			label: "The Pond",
			dest: "/the-pond",
		},
		{
			id: 5,
			label: "Profile",
			dest: "/profile",
			image: {
				alt: "Login",
				obj: ProfileImage,
				isLogo:false,
			}
		}
	];

	return (
		<header className="flex justify-center py-3 gap-10 bg-gradient-to-r from-osl-blue-700 via-blue-400 to-osl-blue-700">
			{links.map((link) => (
				<a href={link.dest} key={link.id}>
					{link.image === undefined ?
						<p className="text-white font-bold text-base py-2">{link.label}</p>:
						<img className={`${link.image.isLogo ? 'h-10' : 'h-7 mt-2'} text-white font-bold text-base`} src={link.image.obj.src} alt={link.image.alt} loading="lazy" />
					}
				</a>
			))}
		</header>
	)
}

export default Header;