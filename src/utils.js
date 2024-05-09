const { InstanceStatus } = require('@companion-module/base')

const EventSource = require('eventsource')

module.exports = {
	initConnection: function () {
		let self = this

		self.subscribeToTopic(self.config.topic)

		self.updateStatus(InstanceStatus.Ok)
	},

	sendMessage: function (topic = undefined, headers = {}, message = undefined) {
		let self = this

		//check auth settings and add to header if needed
		if (self.config.specifyAuth) {
			if (self.config.authType == 'basic') {
				let username = self.config.username
				let password = self.config.password

				headers.Authorization = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
			} else if (self.config.authType == 'bearer') {
				let token = self.config.token

				headers.Authorization = 'Bearer ' + token
			}
		}

		//if the topic is not provided, use the default topic
		if (topic == undefined) {
			topic = self.config.topic
		}

		let url = `${self.config.server}/${topic}`

		if (self.config.verbose) {
			self.log('debug', `Sending Message: ${message} to Topic: ${topic}`)
			self.log('debug', `Headers: ${JSON.stringify(headers)}`)
		}

		fetch(url, {
			method: 'POST',
			body: message,
			headers: headers,
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error('Error:', error))
	},

	subscribeToTopic: function (topic) {
		let self = this

		let url = `${self.config.server}/${topic}/sse`

		const eventSource = new EventSource(url)

		eventSource.onmessage = (e) => {
			let messageObj = undefined
			try {
				messageObj = JSON.parse(e.data)
			} catch (error) {
				//some error parsing data
				return
			}

			if (messageObj && messageObj.event == 'message') {
				//if the message is already in the data object, update it, else add it to the array

				let found = false
				for (let i = 0; i < self.DATA.length; i++) {
					if (self.DATA[i].topic == messageObj.topic) {
						self.DATA[i] = messageObj
						found = true
						break
					}
				}

				if (!found) {
					self.DATA.push(messageObj)

					//since we added a new topic, we need to update the list of variables
					self.initFeedbacks()
					self.initVariables()
				}

				self.checkFeedbacks()
				self.checkVariables()
			}
		}

		//store the eventSource object in the instance in an array
		self.eventSources.push(eventSource)

		self.initFeedbacks()
		self.initVariables()

		self.checkFeedbacks()
		self.checkVariables()
	},

	unsubscribeFromTopic: function (topic) {
		let self = this

		//find the eventSource object in the array by the topic
		let topic_url = `${self.config.server}/${topic}/sse`
		let eventSource = self.eventSources.find((e) => e.url.includes(topic_url))

		if (eventSource) {
			eventSource.close()
		}

		//remove the eventSource object from the array
		self.eventSources = self.eventSources.filter((e) => e.url.includes(topic) == false)

		//remove any items from the data object related to the topic
		self.DATA = self.DATA.filter((m) => m.topic != topic)

		//update the CHOICES_TOPICS array
		let topics = self.DATA.map((item) => item.topic)
		self.CHOICES_TOPICS = topics.map((topic) => {
			return { id: topic, label: topic }
		})

		self.initFeedbacks()
		self.initVariables()

		self.checkFeedbacks()
		self.checkVariables()
	},
}
