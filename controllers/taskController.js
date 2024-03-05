const fs = require('fs');
const path = require('path')

const chokidar = require('chokidar');

const models = require('../models/index')


// Configurable magic string
var MAGIC_STRING = 'cgfcfg';

// Directory to monitor
var DIRECTORY_TO_MONITOR = 'c:/Users/sss/Desktop/monitest';

// Function to read files in a directory
async function readFiles(directory, MAGIC_STRING) {
    var filePathOccureces = []
    console.log('iam running here')
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {

            console.log('files------>', files)
            if (err) {
                console.error('Error reading directory:', err);
                return err;
            }

            const readFilePromise = files.map(file => {
                return new Promise((resolveFile, rejectFile) => {
                    const filePath = path.join(directory, file);
                    fs.readFile(filePath, 'utf8', async (err, data) => {
                        console.log('dataa---------->', data)
                        if (err) {
                            console.error('Error reading file:', filePath, err);
                            rejectFile()
                            return err;
                        }

                        // Search for magic string in file contents
                        const occurrences = countOccurrences(data, MAGIC_STRING);
                        console.log(`File: ${filePath}, Magic String Occurrences: ${occurrences}`);
                        filePathOccureces.push(filePath, occurrences)
                        resolveFile()
                        console.log('filepathoccure in foreach---------------->', filePathOccureces)
                    });
                });
            })

            console.log('readFileproise------>', readFilePromise)


            Promise.all(readFilePromise).then(() => {
                console.log('file read succesfulllyyyyyyyy')
                resolve(filePathOccureces)
            }).catch((err) => {
                console.log('proise catch error', err)
            })

            console.log('filepathoccure---------------->', filePathOccureces)
        });
    })

}


async function taskOccurencesDetails(directory, startTime, endTime, totalRunTime, occurences) {
    try {

        console.log('ia in taskoccurences details-====================================')
        return new Promise((resolve, reject) => {
            let filter = {
                directory: directory,
                startTime: startTime,
                endTime: endTime,
                totalRunTime: totalRunTime,
                occurences: occurences,
                Status: 'Success'
            }

            console.log('filter&&&&&&&&&&&&&&&&&&&&&&&7777', filter)
            models.taskDetails.create(filter).then(result => {
                console.log('result------------>', result.dataValues)
                resolve(result.dataValues)
            }).catch(err => {
                console.log('error------------>', err)
                resolve(err)
            })
        })
    } catch (err) {
        console.log('errorin catch block', err)
        return err
    }
}
async function fileChanges(taskRunId, AddedfileList, deletedFileList) {
    try {
        return new Promise((resolve, reject) => {

            let filter = {
                taskRunId: taskRunId,
                AddedList: AddedfileList,
                deletedFileList: deletedFileList
            }

            models.changeDetails.create(filter).then(result => {
                console.log('result------------>', result)
                resolve(result.dataValues)
            }).catch(err => {
                console.log('error------------>', err)
                resolve(err)
            })
        })
    } catch (err) {
        console.log('errorin catch block', err)
        return err
    }
}


// Function to count occurrences of a string in another string
function countOccurrences(string, substring) {
    return string.split(substring).length - 1;
}




module.exports.readAllFiles = async (req, res) => {

    if (req.body) {
        DIRECTORY_TO_MONITOR = req.body.directory
        MAGIC_STRING = req.body.magic_string

    }

    const watcher = chokidar.watch(DIRECTORY_TO_MONITOR, {
        ignored: /^\./, // ignore dotfiles
        persistent: true,
        ignoreInitial: true, // Do not fire 'add' event for files that are present when the watcher is started
    });

    if (watcher) {
        const startTime = new Date()
        let AddedfileList = []
        let deletedFileList = []

        watcher.on('add', async (filepath) => {
            console.log('path in add event-------------->', filepath);

            // console.log('filename', path.basename(filepath))
            const fileName = path.basename(filepath)
            console.log('fileName------------------------>', fileName)
            AddedfileList.push(fileName);

            console.log('AddedfileList------------------------>', AddedfileList)
            let occurences = await readFiles(DIRECTORY_TO_MONITOR, MAGIC_STRING);

            console.log('ocuurenncsess--------------################', occurences)
            const endTime = new Date();
            const totalRunTime = endTime - startTime;
            let taskRunId = await taskOccurencesDetails(DIRECTORY_TO_MONITOR, startTime, endTime, totalRunTime, occurences)
            console.log('taskRunId-------->', taskRunId)

            if (taskRunId) {
                taskRunId = taskRunId.id
                console.log('AddedfileList file changes------------------------>', AddedfileList)

                await fileChanges(taskRunId, AddedfileList, deletedFileList)
            }

        });

        watcher.on('unlink', async (filepath) => {
            const fileName = path.basename(filepath);
            console.log('File deleted:', fileName);

            deletedFileList.push(fileName)

            const endTime = new Date();
            const totalRunTime = endTime - startTime;
            occurences = []
            let taskRunId = await taskOccurencesDetails(DIRECTORY_TO_MONITOR, startTime, endTime, totalRunTime, occurences)

            if (taskRunId) {
                taskRunId = taskRunId.id

                await fileChanges(taskRunId, AddedfileList, deletedFileList)
            }
        })


        watcher.on('error', (error) => {
            console.error('error', error);
        });

        res.send('ok')
    } else {
        return res.status(502).message('no watcher available')

    }
}
// Initial read of files


//to retive the task run details
module.exports.taskStatus = async (req, res) => {
    await models.taskDetails.findAll({
        include: [{
            model: models.changeDetails
        }],

        required: false

    }).then(response => {
        console.log('response from table----------->', response)
        return res.json(response)
    }).catch(err => {
        console.log('response from catch-------> ', err)
        return res.send(err)

    })
}


module.exports.readFiles = async (req, res) => {
    try {
        // console.log('from parameter----------------------->',DIRECTORY_TO_MONITOR)
        // console.log('from parameter----------------------->',MAGIC_STRING)
        console.log('ia here---------->')
        if (req.body) {
            DIRECTORY_TO_MONITOR = req.body.directory
            MAGIC_STRING = req.body.magic_string
        }
        // console.log('req.body--->', DIRECTORY_TO_MONITOR)

        const startTime = new Date()
        const endTime = new Date();
        const totalRunTime = endTime - startTime;
        let occurences = await readFiles(DIRECTORY_TO_MONITOR, MAGIC_STRING);



        let taskRun = await taskOccurencesDetails(DIRECTORY_TO_MONITOR, startTime, endTime, totalRunTime, occurences)
        return res.json(taskRun)
    } catch (err) {
        console.log('erin catch', err)
        return res.send(err)

    }

}




module.exports.readFilesForscheduler = async (DIRECTORY_TO_MONITOR, MAGIC_STRING) => {
    try {


        const startTime = new Date()
        const endTime = new Date();
        const totalRunTime = endTime - startTime;
        let occurences = await readFiles(DIRECTORY_TO_MONITOR, MAGIC_STRING);
        let taskRun = await taskOccurencesDetails(DIRECTORY_TO_MONITOR, startTime, endTime, totalRunTime, occurences)


        // setTimeout(async () => {
        //     await module.exports.readAllFiles(req, res);

        // }, 5000)
    } catch (err) {
        console.log('erin catch', err)

    }

}