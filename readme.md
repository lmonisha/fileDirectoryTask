# Node.js API Project

## Installation

Clone the repository:

```bash
git clone https://github.com/lmonisha/fileDirectoryTask.git
cd your-repository
npm install



## Prerequisites
Node.js (version X.X.X)
npm (version X.X.X)
postgresql
pgadmin4




## API Endpoints

| Route              | Method | Body                        | Sample Response                                    | Description                   |
|--------------------|--------|-----------------------------|----------------------------------------------------|-------------------------------|
| `/watchAllfileChangeswithOcuurences` | POST       | '{'"directory":"","magic_string":""'}'                       |`[ { "id": 1, "directory": "c:/Users/sss/Desktop/monitest","occurences":"[list of file with occurence count]" },"fileAddedList":[]` | to watch all the file add delete activity |
| `/fileReadwithOccurencess`           | POST       | '{'"directory":"","magic_string":""'}'                       |`[ { "id": 1, "directory":"c:/Users/sss/Desktop/monitest","occurences":"[list of file with occurence count]" }`                         | to check file match occurence with magic string |
| `/alltask`                           | GET        | N/A                     
                        |`[ { "id": 1, "directory":"c:/Users/sss/Desktop/monitest","occurences":"[list of file with occurence count]" },"fileAddedList":[]`                                 |to retrive all task details |





