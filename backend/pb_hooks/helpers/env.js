const ENV_PATH = __hooks + "/../../.env"


function load_env_vars() {

    let envStr = String.fromCharCode(...$os.readFile(ENV_PATH))

    const lines = envStr.split('\n');
    
    for (let line of lines) {
        // Remove comments and trim whitespace
        line = line.trim();
        if (!line || line.startsWith('#')) continue;

        // Split at first '='
        const eqIndex = line.indexOf('=');
        if (eqIndex === -1) continue; // Invalid line

        let key = line.slice(0, eqIndex).trim();
        let value = line.slice(eqIndex + 1).trim();

        // Remove surrounding quotes if present
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        process.env[key] = value;
    }
}



module.exports = { load_env_vars, ENV_PATH }