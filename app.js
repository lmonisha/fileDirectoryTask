const express = require('express')
const app = express()
const cors = require('cors')
const models = require('./models/index')
const routes = require('./routes/index')

const cron = require('node-cron')
const readfileController = require('./controllers/taskController')
var morgan = require('morgan')

app.use('/', routes)


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'))

app.get('/', async (req, res) => {
    res.send('HelloWorld!!!!!!!!!!!!')
})

let DIRECTORY_TO_MONITOR = 'c:/Users/sss/Desktop/monitest';
let monitoringInterval = '* * * * *';
let MAGIC_STRING = 'cgfcfg';
let scheduletask = null

app.post('/configure', (req, res) => {
    const { directory, interval, magic } = req.body;
    // Update configuration variables
    DIRECTORY_TO_MONITOR = directory;
    monitoringInterval = interval;
    MAGIC_STRING = magic;
    console.log('DIRECTORY_TO_MONITOR inside', DIRECTORY_TO_MONITOR)

    if (scheduletask) {
        scheduletask.destroy();
    }

        scheduletask = cron.schedule(monitoringInterval, async () => {
            try {
                let files = await readfileController.readFilesForscheduler(DIRECTORY_TO_MONITOR, MAGIC_STRING)

            } catch (err) {
                console.log('scheduler', err)
            }
        })
    

    res.send('Configuration updated successfully.');
});

app.get('/monitored-directory', (req, res) => {

    res.json({ directory: DIRECTORY_TO_MONITOR, monitoringInterval: monitoringInterval, MAGIC_STRING: MAGIC_STRING });
});

scheduletask = cron.schedule(monitoringInterval, async () => {
    console.log('monitoringInterval------------>', monitoringInterval)
    console.log('monitoringInterval------------>', DIRECTORY_TO_MONITOR)
    try {
        let file = await readfileController.readFilesForscheduler(DIRECTORY_TO_MONITOR, MAGIC_STRING)

        console.log('file in job', file)
    } catch (err) {
        console.log('scheduler', err)
    }

})

app.post('/start-task', (req, res) => {
    // Check if the task is already running
    if (scheduletask) {
        return res.status(400).send('Task is already running.');
    }

    // Start the task
    scheduletask = cron.schedule(monitoringInterval, async () => {
        try {
            // Your task logic here
            // For example, call readAllFiles function
            let file = await readfileController.readFilesForscheduler(DIRECTORY_TO_MONITOR, MAGIC_STRING)

        } catch (error) {
            console.error('Error in task:', error);
            // Handle errors as needed
        }
    });

    res.send('Task started successfully.');
});

// Define an API route to stop the task manually
app.post('/stop-task', (req, res) => {
    // Check if the task is not running
    if (!scheduletask) {
        return res.status(400).send('Task is not running.');
    }

    // Stop the task
    scheduletask.stop();
    scheduletask = null;

    res.send('Task stopped successfully.');
});


models.sequelize.sync().then(() => {

    app.listen(8000, () => console.log('server is running on the port'))
})