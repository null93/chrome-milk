import moment from "moment"
import React from "react"
import PropTypes from "prop-types"

class Expiration extends React.Component {

	constructor ( props ) {
		super ( props )
		this.timeout = null
		this.state = {
			today: moment ().unix (),
		}
	}

	refresh () {
		const { timestamp, onExpire } = this.props
		const today = moment ().unix ()
		this.setState ({ today: today }, () => {
			if ( timestamp <= today ) {
				clearTimeout ( this.timeout )
				onExpire ()
			}
			else {
				this.timeout = setTimeout ( () => this.refresh (), 1000 )
			}
		})
	}

	componentDidMount () {
		this.refresh ()
	}

	componentWillUnmount () {
		if ( this.timeout ) {
			clearTimeout ( this.timeout )
		}
	}

	plural ( value, label ) {
		const postfix = value === 1 ? "" : "s"
		return `${value} ${label}${postfix}`
	}

	render () {
		const { type, timestamp } = this.props
		const { today } = this.state
		const expiration = moment.unix ( timestamp )
		const duration = moment.duration ( Math.round ( Math.abs ( timestamp - today ) ), "seconds" )
		switch ( type ) {
			case "humanized":
				return <div>{`Expires in ${duration.humanize ()}`}</div>
			case "countdown":
				return <div key={today} >
				{
					[
						`${this.plural ( duration._data.years, "year" )}`,
						`${this.plural ( duration._data.months, "month" )}`,
						`${this.plural ( duration._data.days, "day" )}`,
						`${this.plural ( duration._data.hours, "hour" )}`,
						`${this.plural ( duration._data.minutes, "minute" )}`,
						`${this.plural ( duration._data.seconds, "second" )}`,
					].filter ( e => !e.startsWith ("0") ).join (", ")
				}
				</div>
			case "timestamp":
				return <div>{expiration.format ("L LTS")}</div>
			case "seconds":
				const seconds = duration.asSeconds ()
				const plural = seconds === 1 ? "" : "s"
				const formatted = seconds.toString ().replace ( /\B(?=(\d{3})+(?!\d))/g, "," )
				return <div>{`Expires in ${formatted} second${plural}`}</div>
		}
	}

}

Expiration.propTypes = {
	type: PropTypes.oneOf ([ "humanized", "countdown", "timestamp", "seconds" ]).isRequired,
	timestamp: PropTypes.number.isRequired,
	onExpire: PropTypes.func.isRequired,
}

export default Expiration
