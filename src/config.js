module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module sends push notifications using the Ntfy.sh service.',
			},
			{
				type: 'textinput',
				id: 'server',
				label: 'Ntfy Server',
				default: 'https://ntfy.sh',
				width: 4,
			},
			{
				type: 'textinput',
				id: 'topic',
				label: 'Ntfy Default Topic',
				default: 'ntfy-companion',
			},
			{
				type: 'static-text',
				id: 'hr1',
				width: 12,
				label: ' ',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'specifyAuth',
				label: 'Specify Authentication',
				default: false,
				width: 12,
			},
			{
				type: 'dropdown',
				id: 'authType',
				label: 'Authentication Type',
				width: 12,
				default: 'basic',
				choices: [
					{ id: 'basic', label: 'Basic Auth' },
					{ id: 'bearer', label: 'Bearer Token' },
				],
				isVisible: (configValues) => configValues.specifyAuth === true,
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Username',
				default: '',
				width: 6,
				isVisible: (configValues) => configValues.specifyAuth === true && configValues.authType === 'basic',
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				default: '',
				width: 6,
				isVisible: (configValues) => configValues.specifyAuth === true && configValues.authType === 'basic',
			},
			{
				type: 'textinput',
				id: 'bearer',
				label: 'Bearer Token',
				default: '',
				width: 6,
				isVisible: (configValues) => configValues.specifyAuth === true && configValues.authType === 'bearer',
			},
			{
				type: 'static-text',
				id: 'hr2',
				width: 12,
				label: ' ',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false,
				width: 12,
			},
			{
				type: 'static-text',
				id: 'info3',
				width: 12,
				label: ' ',
				value: `Enabling Verbose Logging will push all incoming and outgoing data to the log, which is helpful for debugging.`,
				isVisible: (configValues) => configValues.verbose === true,
			},
		]
	},
}
