import pg from 'pg';
var conString =
	"postgres://qqaqecoz:gmSfPJuIGEELe4n1MxZjB9fRN9I2Dszp@trumpet.db.elephantsql.com/qqaqecoz";
var client = new pg.Client(conString);
client.connect(function (err) {
	if (err) {
		return console.error("could not connect to postgres", err);
	}
});

export default client;