const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks: function () {
		let self = this
		let feedbacks = {}

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		//update the CHOICES_TOPICS array
		let topics = [...new Set(self.DATA.map((item) => item.topic))]

		//if topics does not include the self.config.topic, add that
		if (self.config.topic) {
			if (!topics.includes(self.config.topic)) {
				topics.push(self.config.topic)
			}
		}

		self.CHOICES_TOPICS = topics.map((topic) => {
			return { id: topic, label: topic }
		})

		feedbacks.priorityMessage = {
			type: 'boolean',
			name: 'Priority Message Received',
			description:
				'If a message is received at the specified topic and priority level, change the color of the button',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Topic',
					id: 'topic',
					default: self.CHOICES_TOPICS[0].id,
					choices: self.CHOICES_TOPICS,
				},
				{
					type: 'dropdown',
					label: 'Message Priority',
					id: 'priority',
					default: '5',
					choices: [
						{ id: '1', label: 'Min' },
						{ id: '2', label: 'Low' },
						{ id: '3', label: 'Default' },
						{ id: '4', label: 'High' },
						{ id: '5', label: 'Max / Urgent' },
					],
				},
			],
			callback: async function (feedback) {
				let opt = feedback.options

				let topic = opt.topic
				let priority = opt.priority

				//search for the last message with the specified topic
				let lastMessage = self.DATA.reverse().find(
					(message) => message.topic == topic && message.priority.toString() == priority
				)

				if (lastMessage) {
					return true
				}

				return false
			},
		}

		self.setFeedbackDefinitions(feedbacks)
	},
}
