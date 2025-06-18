/// <reference path="../pb_data/types.d.ts" />

onBootstrap(e => {

    // Check that a .env file exists
    try {

        let file = $os.readFile(__hooks + "/../.env")
        
    } catch (error) {
        console.log(`No .env file found, or error reading the .env file\n\nExpected .env file at: ${__hooks}/../.env\n\n`, error)
    }

    e.next()


    // FAILS if the .env file does not exist, since e.next() is not called

})