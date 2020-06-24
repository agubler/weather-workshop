import { create, tsx } from '@dojo/framework/core/vdom';
import Weather from '../../weather/Weather';

const factory = create();

export default factory(function ReadonlyWeather() {
	return <Weather readonly={true} locations={['London', 'Paris']} />;
});
