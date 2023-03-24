import { useState, useRef, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Drawer, AppBar, TextField } from "@mui/material";
import { isMobile } from "react-device-detect";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Map, { Marker, Popup } from "react-map-gl";
import CountriesCard from "./components/countriesCard";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import PinImage from "./assets/pin1.png";
// import {defineConfig} from 'vite'

const cities = [
	"Katsina",
	"Warri",
	"Jos",
	"Sapele",
	"Ughelli",
	"Uyo",
	"Bauchi",
	"Lokoja",
	"Yola",
	"Kano",
	"Kaduna",
	"Nsukka",
	"Gusau",
	"Owo",
	"Aba",
	"Lafia",
	"Zaria",
	"Gombe",
	"Jalingo",
	"Sokoto",
];

function App() {
	type weather = {
		temp_c: number;
		temp_f: number;
		condition: {
			text: string;
		};
	};

	const [citySearched, setCitySearched] = useState<string>("Lagos");
	const [cityLong, setCityLong] = useState<number | null>();
	const [cityLat, setCityLat] = useState<number | null>();
	const [citiesList, setCitiesList] = useState<Array<string>>([]);
	const [showPopUp, setShowPopUp] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [forecast, setForecast] = useState<weather | null>({
		temp_c: 0,
		temp_f: 0,
		condition: {
			text: "",
		},
	});
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);

	const filterArray = (text: string) => {
		const newList: Array<string> = [];
		cities.filter((c) => {
			console.log(c.indexOf(text));
			c.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) === 0
				? newList.push(c)
				: "";
		});
		setCitiesList(newList);
	};

	const handleOnChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("start");
		filterArray(e.target.value);
		console.log("end");
		console.log(citiesList);
	};

	const searchCoordinates = (city: string) => {
		// alert(import.meta.env.VITE_APP_MAPBOX_TOKEN);
		var data = "";

		var config = {
			method: "get",
			maxBodyLength: Infinity,
			url:
				"https://api.mapbox.com/geocoding/v5/mapbox.places/" +
				city +
				".json?country=ng&access_token=" +
				import.meta.env.VITE_APP_MAPBOX_TOKEN,
			headers: {},
			data: data,
		};

		axios(config)
			.then(function (response) {
				console.log(response.data.features[0].center);
				setCityLat(response.data.features[0].center[0]);
				setCityLong(response.data.features[0].center[1]);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const getWeatherForecast = (city: string) => {
		setIsLoading(true);
		var data = "";

		var config = {
			method: "get",
			maxBodyLength: Infinity,
			url:
				"http://api.weatherapi.com/v1/forecast.json?key=" +
				import.meta.env.VITE_WEATHER_API +
				"&q=" +
				city,
			headers: {},
			data: data,
		};

		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
				setForecast(response.data.current);
				setIsLoading(false);
			})
			.catch(function (error) {
				console.log(error);
				setIsLoading(false);
			});
	};

	const handleSearchCity = (e: string) => {
		// console.log(e);
		setCitySearched(e);
		searchCoordinates(e);
		setShowPopUp(false);
	};

	const handleOnClickMarker = () => {
		getWeatherForecast(citySearched);
		console.log(showPopUp);
		setShowPopUp(true);
	};
	// useEffect(() => {
	// 	isMobile ? setShowPopUp(false) : setShowPopUp(true);
	// }, []);

	const viewState = {
		longitude: cityLong == null ? 3.3792 : cityLong,
		latitude: cityLat == null ? 6.5244 : cityLat,
		zoom: 10,
	};
	const handleShowMenu = () => {
		setOpenDrawer(true);
	};
	const handleCloseMenu = () => {
		setOpenDrawer(false);
	};
	return (
		<div style={{ paddingLeft: 0, display: "flex", justifyContent: "center" }}>
			{isMobile ? (
				<Button
					onClick={handleShowMenu}
					variant="contained"
					style={{
						position: "absolute",
						backgroundColor: "blue",
						marginTop: "10%",
						zIndex: 2,
					}}
				>
					Countries List
				</Button>
			) : (
				<></>
			)}
			<Drawer
				variant={isMobile ? "temporary" : "permanent"}
				ModalProps={{
					keepMounted: false,
				}}
				// style={{ width: "5vw" }}
				// anchor={anchor}
				open={openDrawer}
				// onClose={toggleDrawer(anchor, false)}
			>
				{isMobile ? (
					<Button
						onClick={handleCloseMenu}
						variant="contained"
						style={{
							backgroundColor: "red",

							zIndex: 2,
						}}
					>
						Go Back
					</Button>
				) : (
					<></>
				)}
				<Typography
					variant="h5"
					style={{
						marginLeft: "5vw",
						marginRight: "5vw",
						fontWeight: "lighter",
						marginTop: "10%",
					}}
				>
					Countries
				</Typography>
				<TextField
					onChange={handleOnChangeText}
					id="filled-basic"
					label="Search Countries"
					variant="filled"
				/>
				{/* <hr color="black" style={{ width: "100%" }} /> */}

				{citiesList.length < 1
					? cities.map((c, i) => (
							<CountriesCard
								onPress={() => {
									handleSearchCity(c);
								}}
								name={c}
								key={i}
							/>
					  ))
					: citiesList.map((c, i) => (
							<CountriesCard
								name={c}
								onPress={() => {
									handleSearchCity(c);
								}}
								key={i}
							/>
					  ))}
			</Drawer>
			<Map
				{...viewState}
				initialViewState={viewState}
				style={{
					width: isMobile ? "100vw" : "100vw",
					height: isMobile ? "100vh" : "150vh",
					marginLeft: "5%",
				}}
				mapStyle="mapbox://styles/mapbox/streets-v9"
				mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_TOKEN}
			>
				<Marker
					onClick={handleOnClickMarker}
					longitude={cityLong == null ? 3.3792 : cityLong}
					latitude={cityLat == null ? 6.5244 : cityLat}
					// longitude={3.3792}
					// latitude={6.5244}
					anchor="bottom"
				>
					<img src={PinImage} style={{ height: "10vh" }} />
					{/* <h1>it is here</h1> */}
				</Marker>

				{showPopUp ? (
					<Popup
						closeOnClick={false}
						style={{ width: "50%", zIndex: 100 }}
						longitude={cityLong == null ? 3.3792 : cityLong}
						latitude={cityLat == null ? 6.5244 : cityLat}
						anchor="bottom"
						closeButton={true}
						onClose={() => {
							setShowPopUp(false);
						}}
					>
						{isLoading ? (
							<Typography style={{ fontSize: "12px" }}>
								loading forecast....
							</Typography>
						) : forecast === null ? (
							<Typography style={{ fontSize: "12px" }}>Not Loaded</Typography>
						) : (
							<>
								<Typography variant="h6">
									{citySearched} Weather Forecast
								</Typography>
								<Typography style={{ fontSize: "12px" }}>
									Temperature: {forecast.temp_c}C, {forecast.temp_f}F
								</Typography>
								<Typography style={{ fontSize: "12px" }}>
									Weather condition: {forecast.condition.text}
								</Typography>
							</>
						)}
					</Popup>
				) : (
					<></>
				)}
			</Map>
		</div>
	);
}

export default App;
