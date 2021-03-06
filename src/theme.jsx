import { createMuiTheme } from "@material-ui/core/styles"

module.exports = isDark => {
	const defaultTheme = createMuiTheme ()
	const primary = isDark ? "#FFFFFF" : "#4B4B4B"
	const secondary = isDark ? "#4B4B4B" : "#FFFFFF"
	const theme = createMuiTheme ({
		type: isDark ? "dark" : "light",
		typography: {
			fontFamily: "'Roboto', 'system-ui', 'sans-serif'",
			fontSize: 12,
		},
		palette: {
			background: {
				default: isDark ? "#202124" : "#F8F9FA",
				paper: isDark ? "#292A2D" : "#FFFFFF",
			},
			primary: {
				main: isDark ? "#8AB4F8" : "#1A73E8",
			},
			error: {
				main: "#D32F2F",
			},
			text: {
				primary: isDark ? "#FFFFFF" : "#4B4B4B",
				secondary: isDark ? "#FFFFFFBB" : "#4B4B4BBB",
				disabled: isDark ? "rgba( 255, 255, 255, 0.38 )" : "rgba( 0, 0, 0, 0.38 )",
			},
			action: {
				hover: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
				disabled: isDark ? "rgba(255, 255, 255, 0.26)" : "rgba(0, 0, 0, 0.26)",
			},
			divider: isDark ? "#3F4042" : "#F0F0F0",
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					"@global": {
						"::selection": {
							background: "#FFDE03",
							color: "#4B4B4B",
						},
						"html, body, #main": {
							minWidth: 550,
							minHeight: 530,
							overflow: "hidden",
						},
						"mark": {
							background: "#FFDE03",
							color: "#4B4B4B",
							borderRadius: 2,
						},
						"::-webkit-calendar-picker-indicator": {
							display: "none",
						},
						"::-webkit-inner-spin-button": {
							display: "none",
						},
						"::-webkit-clear-button": {
							display: "none",
						},
					},
				},
			},
			MuiTableCell: {
				styleOverrides: {
					root: {
						borderBottom: `1px solid ${isDark ? "#3F4042" : "#F0F0F0"}`,
					},
					head: {
						fontWeight: 600,
						lineHeight: "14px",
					},
				},
			},
			MuiTablePagination: {
				styleOverrides: {
					toolbar: {
						minHeight: 40,
					},
				},
			},
			MuiListItemIcon: {
				styleOverrides: {
					root: {
						minWidth: 36,
						color: primary,
					},
				},
			},
			MuiToggleButton: {
				styleOverrides: {
					root: {
						width: "100%",
						color: isDark ? "#FFFFFF" : "#4B4B4B",
						border: "none",
						"&:hover": {
							backgroundColor: "#00000022",
							color: isDark ? "#FFFFFF" : "#4B4B4B",
							opacity: 1,
						},
						"&$selected": {
							backgroundColor: isDark ? "#8AB4F8" : "#1A73E8",
							color: isDark ? "#292A2D" : "#FFFFFF",
						},
						"&$selected:hover": {
							backgroundColor: `${isDark ? "#8AB4F8" : "#1A73E8"} !important`,
							color: isDark ? "#292A2D" : "#FFFFFF",
							opacity: 0.80,
						},
						"&$selected$disabled": {
							color: isDark ? "#292A2D" : "#FFFFFF",
							opacity: 0.30,
						},
					},
				},
			},
			MuiToggleButtonGroup: {
				styleOverrides: {
					root: {
						width: "100%",
						margin: "4px 0",
						background: isDark ? "#202124" : "#F8F9FA",
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: {
						display: "flex",
						alignItems: "center",
						borderRadius: 0,
					},
					icon: {
						color: isDark ? "rgba(255, 255, 255, 0.54)" : "rgba(0, 0, 0, 0.54)",
					},
				},
			},
			MuiList: {
				styleOverrides: {
					padding: {
						paddingTop: 0,
						paddingBottom: 0,
					},
				},
			},
			MuiFilledInput: {
				styleOverrides: {
					root: {
						borderTopLeftRadius: 0,
						borderTopRightRadius: 0,
						backgroundColor: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.09)",
						"&$focused, &:hover, &$disabled, &$disabled:hover": {
							backgroundColor: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.09)",
						},
					},
					underline: {
						"&:before": {
							borderBottom: `1px solid ${isDark ? "#292A2D" : "#FFFFFF"}`,
						},
					},
				},
			},
			MuiAccordion: {
				styleOverrides: {
					root: {
						"&:before": {
							transition: "none"
						},
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					arrow: {
						color: isDark ? "#8AB4F8" : "#1A73E8",
					},
					tooltip: {
						backgroundColor: isDark ? "#8AB4F8" : "#1A73E8",
						borderRadius: 2,
						color: isDark ? "#202124" : "#FFFFFF",
						fontSize: "1.01em",
						fontWeight: 700,
						padding: 7,
						boxShadow: defaultTheme.shadows [ 4 ],
					},
				},
			},
		},
	})
	if ( process.env.NODE_ENV !== "production" ) {
		console.log ( "MuiTheme:", theme )
	}
	return theme
}
