const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const utils = require('./src/utils')
const constants = require('./src/constants')

class ntfyInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
			...constants,
		})

		this.eventSources = []

		this.DATA = []
	}

	async destroy() {
		this.eventSources.forEach((eventSource) => {
			eventSource.close()
		})
		this.eventSources = []
	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkVariables()
		this.checkFeedbacks()

		this.initConnection()
	}
}

runEntrypoint(ntfyInstance, UpgradeScripts)
