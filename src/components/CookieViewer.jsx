import moment from "moment"
import React from "react"
import PropTypes from "prop-types"
import Paper from "@material-ui/core/Paper"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Tooltip from "components/Tooltip"
import Fade from "@material-ui/core/Fade"
import InputLabel from "@material-ui/core/InputLabel"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Backdrop from "@material-ui/core/Backdrop"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ToggleButtonGroup from "@material-ui/core/ToggleButtonGroup"
import ToggleButton from "@material-ui/core/ToggleButton"
import Grid from "@material-ui/core/Grid"
import InputAdornment from "@material-ui/core/InputAdornment"
import StyledTextField from "components/StyledTextField"
import CloseIcon from "@material-ui/icons/Close"
import TodayIcon from "@material-ui/icons/Today"
import SecureOnIcon from "@material-ui/icons/Lock"
import SecureOffIcon from "icons/SecureOff"
import HostOnlyOnIcon from "icons/HostOnlyOn"
import HostOnlyOffIcon from "icons/HostOnlyOff"
import HttpOnlyOnIcon from "@material-ui/icons/VisibilityOff"
import HttpOnlyOffIcon from "@material-ui/icons/Visibility"
import SessionOnIcon from "@material-ui/icons/HistoryToggleOff"
import SessionOffIcon from "@material-ui/icons/Schedule"
import ProtectOnIcon from "@material-ui/icons/Security"
import ProtectOffIcon from "icons/ProtectOff"
import UnspecifiedIcon from "icons/Unspecified"
import NoRestrictionIcon from "@material-ui/icons/GpsOff"
import LaxIcon from "@material-ui/icons/GpsNotFixed"
import StrictIcon from "@material-ui/icons/GpsFixed"
import CookieMenu from "components/CookieMenu"
import { withChrome } from "contexts/ChromeContext"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
	backdrop: {
		zIndex: 1000,
	},
	root: {
		width: "100%",
		height: "100%",
		zIndex: 100,
		maxWidth: 850,
		maxHeight: 555,
		userSelect: "none",
		borderRadius: 0,
	},
	header: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing ( 0.5, 0.5 ),
	},
	title: {
		flex: 1,
		padding: theme.spacing ( 0, 1 ),
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	body: {
		padding: theme.spacing ( 0, 2 ),
	},
	toggleLabel: {
		marginLeft: theme.spacing ( 1 ),
	},
})

function createCookieKey ( cookie ) {
	return `<${cookie.name}><${cookie.domain}><${cookie.path}>`
}

class CookieViewer extends React.Component {

	constructor ( props ) {
		super ( props )
		this.state = {
			cookie: {
				...props.cookie,
			},
			error: false,
			key: createCookieKey ( props.cookie ),
			isProtected: this.isProtected (),
		}
	}

	isProtected () {
		const { data, cookie } = this.props
		const protectList = data.list.protect
		const key = createCookieKey ( cookie )
		return key in protectList
	}

	setCookie ( data, additional = {}, callback = () => {} ) {
		this.setState ( state => ({
			error: false,
			cookie: { ...state.cookie, ...data },
			...additional,
		}), callback )
	}

	handleSave ( duplicate = false ) {
		const isNewCookie = this.props.isNew
		const onClose = this.props.onClose
		const oldCookie = this.props.cookie
		const newCookie = {
			...(duplicate ? this.props : this.state).cookie,
			name: duplicate ? `${(duplicate ? this.props : this.state).cookie.name}_duplicate` : (duplicate ? this.props : this.state).cookie.name
		}
		const getUrl = cookie => `http${cookie.secure ? "s" : ""}://${cookie.domain.replace (/^\./, "")}${cookie.path}`
		const set = cookie => new Promise ( ( resolve, reject ) => {
			chrome.cookies.set ({
				url: getUrl ( cookie ),
				domain: cookie.hostOnly ? undefined : cookie.domain,
				name: cookie.name,
				value: cookie.value,
				path: cookie.path,
				secure: cookie.sameSite === "no_restriction" ? true : cookie.secure,
				httpOnly: cookie.httpOnly,
				sameSite: cookie.sameSite,
				expirationDate: cookie.session ? undefined : cookie.expirationDate,
				storeId: cookie.storeId,
			}, response => {
				if ( chrome.runtime.lastError ) {
					reject ( chrome.runtime.lastError )
				}
				else {
					resolve ( response )
				}
			})
		})
		const remove = cookie => new Promise ( ( resolve, reject ) => {
			chrome.cookies.remove ({
				name: cookie.name,
				url: getUrl ( cookie ),
			}, response => {
				if ( chrome.runtime.lastError ) {
					reject ( chrome.runtime.lastError )
				}
				else {
					resolve ( response )
				}
			})
		})
		return Promise.resolve ()
			.then ( () => isNewCookie || duplicate ? Promise.resolve () : remove ( oldCookie ) )
			.then ( () => set ( newCookie ) )
			.then ( () => onClose () )
			.catch ( error => this.setState (
				{ error: error.message },
				() => isNewCookie || duplicate ? Promise.resolve () : set ( oldCookie )
			))
	}

	render () {
		const { classes, cookie, isNew, onClose, onExport, onDelete, onBlock, onProtect, onRemoveProtect } = this.props
		const { isProtected, error } = this.state
		const { name, domain, path, expirationDate, sameSite, value, hostOnly, httpOnly, secure, session } = this.state.cookie
		return <Backdrop
			open={true}
			onClose={() => onClose ()}
			className={classes.backdrop} >
			<Paper className={classes.root} elevation={5} >
				<div className={classes.header} >
					<IconButton
						className={classes.button}
						size="medium"
						color="primary"
						onClick={() => onClose ()} >
						<CloseIcon/>
					</IconButton>
					<Typography className={classes.title} >
						<b>{name || <i>Not Named</i>}</b>
					</Typography>
					{
						!isNew && <CookieMenu
							isProtected={isProtected}
							onDelete={onDelete}
							onBlock={onBlock}
							onClose={onClose}
							onExport={onExport}
							onDuplicate={() => {
								this.handleSave ( true )
								onClose ()
							}}
						/>
					}
				</div>
				<Grid container spacing={1} className={classes.body} >
					<Grid item xs={12} md={12} >
						<StyledTextField
							error={Boolean ( error )}
							disabled={isProtected}
							autoFocus={true}
							value={name}
							label="Name"
							variant="filled"
							onChange={e => this.setCookie ({ name: e.target.value })}
						/>
					</Grid>
					<Grid item xs={12} md={12} >
						<StyledTextField
							error={Boolean ( error )}
							disabled={isProtected}
							value={`${hostOnly ? "" : "."}${domain.replace (/^\./, "")}`}
							label="Domain"
							variant="filled"
							onChange={e => this.setCookie ({ domain: `${hostOnly ? "" : "."}${e.target.value.replace (/^\./, "")}` })}
						/>
					</Grid>
					<Grid item xs={12} md={12} >
						<StyledTextField
							error={Boolean ( error )}
							disabled={isProtected}
							value={`/${path.replace (/^\//, "")}`}
							label="Path"
							variant="filled"
							onChange={e => this.setCookie ({ path: `/${e.target.value.replace (/^\//, "")}` })}
						/>
					</Grid>
					<Grid item xs={12} md={12} >
						<StyledTextField
							error={Boolean ( error )}
							variant="filled"
							label={`Expiration Date (${moment.duration ( moment.unix ( expirationDate ) - moment () ).humanize ()})`}
							type="datetime-local"
							onChange={e => this.setCookie ({ expirationDate: moment ( e.target.value.substring ( 0, 19 ) ).unix () })}
							disabled={session || isProtected}
							InputLabelProps={{ shrink: true }}
							inputProps={{ step: 1 }}
							value={moment.unix ( expirationDate ).format ("YYYY-MM-DDTHH:mm:ss").substring ( 0, 19 )}
							InputProps={{
								endAdornment: <InputAdornment position="end" >
									<Tooltip
										arrow
										TransitionComponent={Fade}
										placement="left"
										title="Today" >
										<IconButton
											disabled={session || isProtected}
											tabIndex={-1}
											onClick={() => this.setCookie ({ expirationDate: moment ().unix () })} >
											<TodayIcon
												fontSize="small"
												color={session || isProtected ? "disabled" : "primary"}
											/>
										</IconButton>
									</Tooltip>
								</InputAdornment>
							}}
						/>
					</Grid>
					<Grid item xs={12} md={12} >
						<StyledTextField
							error={Boolean ( error )}
							disabled={isProtected}
							maxRows={1}
							value={value}
							variant="filled"
							onChange={e => this.setCookie ({ value: e.target.value })}
							label={`Value (${value.length} byte${value.length === 1 ? "" : "s"})`}
						/>
					</Grid>
					<Grid item xs={12} md={12} >
						<FormControl fullWidth disabled={isProtected} variant="filled" >
							<InputLabel>Same Site Status</InputLabel>
							<Select
								error={Boolean ( error )}
								fullWidth
								value={sameSite}
								disabled={isProtected}
								variant="filled"
								onChange={e => this.setCookie ({
									sameSite: e.target.value,
									secure: e.target.value === "no_restriction"
										? true
										: secure
								})} >
								<MenuItem value="unspecified" >
									<ListItemIcon><UnspecifiedIcon color={isProtected ? "disabled" : "inherit"} /></ListItemIcon>
									<ListItemText primary="Unspecified" />
								</MenuItem>
								<MenuItem value="no_restriction" >
									<ListItemIcon><NoRestrictionIcon color={isProtected ? "disabled" : "inherit"} /></ListItemIcon>
									<ListItemText primary="No Restriction" />
								</MenuItem>
								<MenuItem value="lax" >
									<ListItemIcon><LaxIcon color={isProtected ? "disabled" : "inherit"} /></ListItemIcon>
									<ListItemText primary="LAX" />
								</MenuItem>
								<MenuItem value="strict" >
									<ListItemIcon><StrictIcon color={isProtected ? "disabled" : "inherit"} /></ListItemIcon>
									<ListItemText primary="Strict" />
								</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={12} >
						<ToggleButtonGroup
							size="small"
							value={[
								...( hostOnly ? [ "hostOnly" ] : [] ),
								...( httpOnly ? [ "httpOnly" ] : [] ),
								...( secure || sameSite === "no_restriction" ? [ "secure" ] : [] ),
								...( session ? [ "session" ] : [] ),
								...( isProtected ? [ "isProtected" ] : [] ),
							]}
							onChange={( e, value ) => {
								const newIsProtected = value.includes ("isProtected")
								this.setCookie (
									{
										hostOnly: value.includes ("hostOnly"),
										httpOnly: value.includes ("httpOnly"),
										secure: value.includes ("secure"),
										session: value.includes ("session"),
									},
									{ isProtected: newIsProtected },
									newIsProtected
										? onProtect ()
										: onRemoveProtect ()
								)
							}} >
							<ToggleButton
								classes={{
									root: classes.toggle,
									disabled: classes.toggleDisabled,
									selected: classes.toggleSelected,
								}}
								disabled={isProtected || sameSite === "no_restriction"}
								value="secure" >
								{secure || sameSite === "no_restriction" ? <SecureOnIcon/> : <SecureOffIcon/>}
								<span className={classes.toggleLabel} >Secure</span>
							</ToggleButton>
							<ToggleButton
								classes={{
									root: classes.toggle,
									disabled: classes.toggleDisabled,
									selected: classes.toggleSelected,
								}}
								disabled={isProtected}
								value="httpOnly" >
								{httpOnly ? <HttpOnlyOnIcon/> : <HttpOnlyOffIcon/>}
								<span className={classes.toggleLabel} >HTTP-Only</span>
							</ToggleButton>
							<ToggleButton
								classes={{
									root: classes.toggle,
									disabled: classes.toggleDisabled,
									selected: classes.toggleSelected,
								}}
								disabled={isProtected}
								value="hostOnly" >
								{hostOnly ? <HostOnlyOnIcon/> : <HostOnlyOffIcon/>}
								<span className={classes.toggleLabel} >Host-Only</span>
							</ToggleButton>
							<ToggleButton
								classes={{
									root: classes.toggle,
									disabled: classes.toggleDisabled,
									selected: classes.toggleSelected,
								}}
								disabled={isProtected}
								value="session" >
								{session ? <SessionOnIcon/> : <SessionOffIcon/>}
								<span className={classes.toggleLabel} >Session</span>
							</ToggleButton>
							<ToggleButton
								classes={{
									root: classes.toggle,
									disabled: classes.toggleDisabled,
									selected: classes.toggleSelected,
								}}
								disabled={isNew}
								value="isProtected" >
								{isProtected ? <ProtectOnIcon/> : <ProtectOffIcon/>}
								<span className={classes.toggleLabel} >Protect</span>
							</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
					<Grid item xs={12} md={12} >
						<Button
							fullWidth
							variant="contained"
							size="large"
							disabled={isProtected || Boolean ( error )}
							onClick={() => this.handleSave ()} >
							{error ? `Error: ${error}` : isProtected ? "Protected Cookie" : isNew ? "Create Cookie" : "Update Cookie"}
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</Backdrop>
	}

}

CookieViewer.propTypes = {
	classes: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
	isNew: PropTypes.bool.isRequired,
	cookie: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
	onExport: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onBlock: PropTypes.func.isRequired,
	onProtect: PropTypes.func.isRequired,
	onRemoveProtect: PropTypes.func.isRequired,
}

export default withStyles ( styles ) ( withChrome ( CookieViewer ) )