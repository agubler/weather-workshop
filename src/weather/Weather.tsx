import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeAhead from '@dojo/widgets/chip-typeahead';
import {
	createResourceMiddleware,
	createResourceTemplate,
	defaultFind
} from '@dojo/framework/core/middleware/resources';
import * as css from './Weather.m.css';

const resource = createResourceMiddleware();

interface WeatherDetailsProperties {
	location: string;
}

interface WeatherDetails {
	name: string;
	temp: number;
	maxTemp: number;
	minTemp: number;
	description: string[];
	icon: string;
}

const weatherTemplate = createResourceTemplate<WeatherDetails>({
	find: defaultFind,
	read: async (request, { put }) => {
		const { query } = request;
		const response = await fetch(`https://dramatic-carbonated-goldfish.glitch.me/weather?query=${query.name}`);
		const json = await response.json();
		console.log(json);
		put(json, request);
	}
});

interface WeatherProperties {
	/** Determines if the locations can be selected within the widget */
	readonly?: boolean;
	/** The locations to display weather for */
	locations: string[];
	/** Callback fired when a location is added or removed */
	onChange?: (locations: string[]) => void;
}

const weatherDetailFactory = create({ resource }).properties<WeatherDetailsProperties>();

const WeatherDetails = weatherDetailFactory(function WeatherDetails({ id, properties, middleware: { resource } }) {
	const { location } = properties();
	const { createOptions, getOrRead } = resource;
	const options = createOptions(id);
	const [weatherDetails] = getOrRead(weatherTemplate, options({ query: { name: location } }));
	if (weatherDetails) {
		const [weatherDetail] = weatherDetails;
		return (
			<div classes={css.root}>
				<div classes={css.leading}>
					<h1 classes={css.name}>{weatherDetail.name}</h1>
					<div classes={css.info}>
						<div>{`${weatherDetail.minTemp} / ${weatherDetail.maxTemp}°C`}</div>
						<div classes={css.description}>
							{weatherDetail.description.map((item) => item).join(' or ')}{' '}
							<i classes={[css.icon, 'wi', weatherDetail.icon]}></i>
						</div>
					</div>
				</div>
				<div classes={css.trailing}>{`${weatherDetail.temp}°C`}</div>
			</div>
		);
	}
});

const capitalCityTemplate = createResourceTemplate<{ value: string }>({
	find: defaultFind,
	read: async (request, { put }) => {
		const { offset, size, query } = request;
		let url = `https://dramatic-carbonated-goldfish.glitch.me/capitals?size=${size}&offset=${offset}`;
		if (query.value) {
			url = `${url}&query=${query.value}`;
		}
		const response = await fetch(url);
		const json = await response.json();
		put(json, request);
	}
});

const factory = create({ resource }).properties<WeatherProperties>();

export default factory(function Weather({ properties, middleware: { resource } }) {
	const { locations = [], onChange, readonly = false } = properties();
	return (
		<div>
			{!readonly && (
				<ChipTypeAhead
					resource={resource({ template: capitalCityTemplate })}
					onValue={(value) => {
						onChange && onChange(value);
					}}
					value={locations}
				>
					{{
						label: 'Select Capital Cities'
					}}
				</ChipTypeAhead>
			)}
			{locations.map((location) => (
				<WeatherDetails location={location}></WeatherDetails>
			))}
		</div>
	);
});
