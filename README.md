# analysis-rookie-event

Thanks to The Blue Alliance for providing powerful APIs and database.

## Installation

You need to install nodejs first.

Then run the following commands:

```
$ git clone https://github.com/ZodiacEFZ/analysis-rookie-event.git
$ npm i
```

## Analyzing

Create a folder `db` first, and then connect to the Internet,
run `npm start`. A `data.csv` will be automatically generated in `db` folder.

Windows:

```
set DEBUG=analyze:*
npm start
```

Linux / OS X:

```
DEBUG=analyze:* npm start
```

## Updating to a new version

Delete all files under `db` folder to clear cache.

## License

MIT

## Output Data

It's not hard to edit what data you want to be printed in the csv file. Edit `output csv` function [here](https://github.com/ZodiacEFZ/analysis-rookie-event/blob/master/index.js#L76). Each array represents a row in csv.

By default these columns will be stored:

  Event Name, Start Date, End Date, Timezone, UTC, Location, Qualification High / Average / Average Win Score, Playoff High / Average / Average Win Score, China Teams in 2015, Rookie Teams in 2015, All Teams in 2015, China Teams in 2016, Rookie Teams in 2016, All Teams in 2016, The Blue Alliance URL
