import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeAhead from '@dojo/widgets/chip-typeahead';
import {
	createResourceMiddleware,
	createResourceTemplate,
	defaultFind
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();

interface WeatherProperties {
	/** The locations to display weather for */
	locations: string[];
	/** Callback fired when a location is added or removed */
	onChange?: (locations: string[]) => void;
}

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
	const { locations = [], onChange } = properties();
	return (
		<div>
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
			<pre>{JSON.stringify(locations)}</pre>
		</div>
	);
});
