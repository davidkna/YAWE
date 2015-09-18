/* eslint-disable new-cap, no-use-before-define */
const { ToggleButton } = require('sdk/ui/button/toggle')
const panels = require('sdk/panel')
const self = require('sdk/self')

const button = ToggleButton({
	id: 'YAWE',
	label: 'YAWE (Yet Another Wiki Extension)',
	icon: {
		'16': './images/icon_16x16.png',
		'32': './images/icon_32x32.png',
		'64': './images/icon_64x64.png',
	},
	onChange: handleChange,
})

const panel = panels.Panel({
	width: 458,
	height: 555,
	contentURL: self.data.url('app.html'),
	onHide: handleHide,
})

function handleChange(state) {
	if (state.checked) {
		panel.show({
			position: button,
		})
	}
}

function handleHide() {
	button.state('window', {checked: false})
}
