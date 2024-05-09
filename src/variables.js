module.exports = {
	initVariables: function () {
		let self = this
		let variables = []

		//build the variables based on the unique topics in the self.DATA.messages array
		let topics = [...new Set(self.DATA.map((item) => item.topic))]

		//if topics does not include the self.config.topic, add that
		if (self.config.topic) {
			if (!topics.includes(self.config.topic)) {
				topics.push(self.config.topic)
			}
		}

		if (topics) {
			topics.forEach((topic) => {
				if (topic) {
					let topic_variableid = topic.replace(/[^a-zA-Z0-9]/g, '_')

					variables.push({
						name: `Last Message for ${topic}`,
						variableId: `message_${topic_variableid}`,
					})

					variables.push({
						name: `Priority of Last Message for ${topic}`,
						variableId: `priority_${topic_variableid}`,
					})

					variables.push({
						name: `Timestamp of Last Message for ${topic}`,
						variableId: `timestamp_${topic_variableid}`,
					})
				}
			})
		}

		self.setVariableDefinitions(variables)
	},

	checkVariables: function () {
		let self = this

		let variableObj = {}

		try {
			//loop through self.DATA and build the variable object
			self.DATA.forEach((message) => {
				let topic = message.topic
				let topic_variableid = topic.replace(/[^a-zA-Z0-9]/g, '_')

				variableObj[`message_${topic_variableid}`] = message.message
				variableObj[`priority_${topic_variableid}`] = message.priority

				//format timestamp
				//let timestamp = new Date(message.time)
				//variableObj[`timestamp_${topic_variableid}`] = timestamp.toLocaleString()
			})

			self.setVariableValues(variableObj)
		} catch (error) {
			self.log('error', 'Error Processing Variables: ' + String(error))
		}
	},
}
