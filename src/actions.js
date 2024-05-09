module.exports = {
	initActions: function () {
		let self = this
		let actions = {}

		actions.sendMessage = {
			name: 'Send Message',
			options: [
				{
					type: 'textinput',
					label: 'Title',
					id: 'title',
					default: '',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Message',
					id: 'message',
					default: 'Hello World',
					useVariables: true,
				},
				{
					type: 'checkbox',
					label: 'Enable Markdown in Message Body',
					id: 'markdown',
					default: false,
				},
				{
					type: 'checkbox',
					label: 'Specify Custom Topic',
					id: 'customTopic',
					default: false,
				},
				{
					type: 'textinput',
					label: 'Topic',
					id: 'topic',
					default: 'ntfy-companion',
					useVariables: true,
					isVisible: (configValues) => configValues.customTopic === true,
				},
				{
					type: 'dropdown',
					label: 'Message Priority',
					id: 'priority',
					default: '3',
					choices: [
						{ id: '1', label: 'Min' },
						{ id: '2', label: 'Low' },
						{ id: '3', label: 'Default' },
						{ id: '4', label: 'High' },
						{ id: '5', label: 'Max / Urgent' },
					],
				},
				{
					type: 'multidropdown',
					label: 'Message Tags/Emojis',
					id: 'tags',
					default: self.EMOJIS[0].id,
					choices: self.EMOJIS,
					minSelection: 0,
				},
				{
					type: 'checkbox',
					label: 'Specify Click Action',
					id: 'includeClick',
					default: false,
				},
				{
					type: 'textinput',
					label: 'Click Action',
					id: 'click',
					default: 'http://ntfy.sh',
					useVariables: true,
					isVisible: (configValues) => configValues.includeClick === true,
				},
				{
					type: 'checkbox',
					label: 'Specify Icon',
					id: 'includeIcon',
					default: false,
				},
				{
					type: 'textinput',
					label: 'Icon',
					id: 'icon',
					default: '',
					tooltip: 'URL to JPEG or PNG of Icon to diplsay in notification.',
					useVariables: true,
					isVisible: (configValues) => configValues.includeIcon === true,
				},
				{
					type: 'checkbox',
					label: 'Specify Email',
					id: 'includeEmail',
					default: false,
				},
				{
					type: 'textinput',
					label: 'Email',
					id: 'email',
					default: '',
					tooltip: 'Email to send notification to.',
					useVariables: true,
					isVisible: (configValues) => configValues.includeEmail === true,
				},
				{
					type: 'checkbox',
					label: 'Cache Message',
					id: 'cache',
					default: true,
					tooltip: 'Cache the message for future subscribers.',
				},
			],
			callback: async function (action) {
				let opt = action.options

				let headers = {}

				let title = await self.parseVariablesInString(opt.title)
				let message = await self.parseVariablesInString(opt.message)

				if (opt.markdown) {
					headers.Markdown = 'yes'
				}

				let topic = undefined
				if (opt.customTopic) {
					topic = await self.parseVariablesInString(opt.topic)
				}

				headers.Priority = opt.priority

				if (opt.tags) {
					headers.Tags = opt.tags.join(',')
				}

				if (opt.includeClick) {
					headers.Click = await self.parseVariablesInString(opt.click)
				}

				if (opt.includeIcon) {
					headers.Icon = await self.parseVariablesInString(opt.icon)
				}

				if (opt.includeEmail) {
					headers.Email = await self.parseVariablesInString(opt.email)
				}

				if (opt.cache == false) {
					headers.Cache = 'no' //we only care to send the header if they want to override the default
				}

				if (title == undefined || title == '') {
					title = self.config.topic
				}
				headers.Title = title

				self.sendMessage(topic, headers, message)
			},
		}

		actions.subscribeToTopic = {
			name: 'Subscribe to Topic',
			options: [
				{
					type: 'textinput',
					label: 'Topic',
					id: 'topic',
					default: 'ntfy-companion',
					useVariables: true,
				},
			],
			callback: async function (action) {
				let opt = action.options
				let topic = await self.parseVariablesInString(opt.topic)
				self.subscribeToTopic(topic)
			},
		}

		actions.unsubscribeFromTopic = {
			name: 'Unsubscribe from Topic',
			options: [
				{
					type: 'textinput',
					label: 'Topic',
					id: 'topic',
					default: 'ntfy-companion',
					useVariables: true,
				},
			],
			callback: async function (action) {
				let opt = action.options
				let topic = await self.parseVariablesInString(opt.topic)
				self.unsubscribeFromTopic(topic)
			},
		}

		self.setActionDefinitions(actions)
	},
}
