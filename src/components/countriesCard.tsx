import Typography from "@mui/material/Typography";

type countriesCardType = {
	name: string;
	onPress: React.MouseEventHandler<HTMLAnchorElement>;
};
const CountriesCard = ({ name, onPress }: countriesCardType) => {
	return (
		<a onClick={onPress}>
			<Typography
				variant="h6"
				style={{
					marginLeft: "5vw",
					marginRight: "5vw",
					fontWeight: "lighter",
					cursor: "pointer",
				}}
			>
				{name}
			</Typography>
			{/* <hr color="black" style={{ width: "100%" }} /> */}
		</a>
	);
};

export default CountriesCard;
