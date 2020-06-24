import material from '@dojo/widgets/theme/material';

import BasicWeather from './weather/BasicWeather';
import ReadonlyWeather from './weather/ReadonlyWeather';

`!has('docs')`;
import testsContext from './tests';

const tests = typeof testsContext !== 'undefined' ? testsContext : { keys: () => [] };

export const config = {
	name: 'dojo-weather',
	home: 'src/examples/README.md',
	themes: [{ label: 'default', theme: material }],
	tests,
	readmePath: (widget: string) => `src/${widget}/README.md`,
	widgetPath: (widget: string, filename: string) => `src/${widget}/${filename || 'index'}.tsx`,
	examplePath: (widget: string, filename: string) => `src/examples/${widget}/${filename || 'index'}.tsx`,
	codesandboxPath: () => '',
	widgets: {
		weather: {
			filename: 'Weather',
			overview: {
				example: {
					filename: 'BasicWeather',
					module: BasicWeather
				}
			},
			examples: [
				{
					title: 'Readonly Weather',
					filename: 'ReadonlyWeather',
					module: ReadonlyWeather
				}
			]
		}
	}
};
export default config;
