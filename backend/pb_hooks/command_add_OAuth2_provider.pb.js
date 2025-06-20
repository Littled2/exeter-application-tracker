/// <reference path="../pb_data/types.d.ts" />


/**
 * Allows provider client ID and secret to be added
 */


$app.rootCmd.addCommand(new Command({
    use: "set-oauth",
    help: () => {
        console.log("Used to add client ID and client secret for an oauth provider")
        console.log("set-oauth <provider_name> <client_id> <client_secret>")
        console.log("Eg. set-oauth google client_id_23242 client_secret_24987")
    },
    run: (cmd, args) => {

        if(args.length !== 3) {
            cmd.print("Insufficient arguments provided")
            cmd.print("Command should use format: set-oauth <provider_name> <client_id> <client_secret>")
            return
        }

        const provider = args[0]
        const clientId = args[1]
        const clientSecret = args[2]

        // Find the 'users' auth collection
        const users = $app.findCollectionByNameOrId("users")

        if (!users) {
            cmd.print("Error: 'users' collection not found.")
            return
        }

        // Ensure the oauth2.providers array exists
        if (!users.oauth2.providers) {
            users.oauth2.providers = []
        }
        const providers = users.oauth2.providers

        // Update existing provider or add a new one
        let existing = providers.find(p => p.name === provider)
        if (existing) {
            existing.clientId = clientId
            existing.clientSecret = clientSecret
        } else {
            providers.push({
                name: provider,
                displayName: provider,
                clientId: clientId,
                clientSecret: clientSecret,
                // built-in providers use default URLs, so leave them blank
                authURL: "",
                tokenURL: "",
                userInfoURL: ""
            })
        }

        // Enable OAuth2 for this collection
        users.oauth2.enabled = true

        $app.save(users);
        cmd.print(`OAuth2 provider '${provider}' configured successfully.`);

    }
}))