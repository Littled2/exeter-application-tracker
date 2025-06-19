/// <reference path="../pb_data/types.d.ts" />

/**
 * Checks for the existence of a /env file on startup
 * 
 * If no file is found, throws an error and shuts down
 */

onBootstrap(e => {

    // Check that a .env file exists
    try {

        let _ = $os.readFile(__hooks + "/../.env")
        
    } catch (error) {
        console.error(`\n*No .env file found*, or error reading the .env file\nExpected .env file at: ${__hooks}/../.env\n`)
        console.error("Error message:", error)
        console.log('Shutting down until the above is fixed')
        $os.exit(2)
    }

    e.next()


    // FAILS if the .env file does not exist, since e.next() is not called

})