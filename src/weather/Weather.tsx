import { create, tsx } from '@dojo/framework/core/vdom';

interface WeatherProperties {}

const factory = create().properties<WeatherProperties>();

export default factory(function Weather() {
	return (
		<div>Hello, Dojo Workshop!</div>
	);
});
