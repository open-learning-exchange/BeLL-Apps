:: go into the folder where this batch file resides i-e update_nation folder
cd %~dp0
:: move one step up the folder hierarchy so that the folder containing design docs for all dbs is more easily accessible
cd ..
:: push the design doc for the db name passed as argument %1, with this batch script, to the destination couchdb url passed as argument %2 with this script
update_nation\node_modules\.bin\couchapp push %1 %2