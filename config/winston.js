import winston from "winston"
import expressWinston from "express-winston"

export const requestLogger = expressWinston.logger({
	transports: [
		new winston.transports.Console()
	],
	format: winston.format.simple(),
	expressFormat: true,
	meta: false,
	colorize: true,
})
