/// <reference path="../pb_data/types.d.ts" />

// Every 24 hours, delete all read notifications
cronAdd("removeUsersWhoHaveNotAgreedToAllPolicies", "0 0 * * 1", () => {

    try {
    
        const usersToDelete = arrayOf(new DynamicModel({
            "id": "",
            "hasAgreedToAllPolicies": false,
            "created": ""
        }))

        // Select all users who have not agreed to all policies
        // Avoid users who signed up less than 15 minutes ago! (So not to delete users currently in the sign up process)

        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString().replace("T", " ")

        console.log(fifteenMinsAgo)

        $app.db()
        .select("id", "hasAgreedToAllPolicies", "created")
        .from("users")
        .where(
            $dbx.exp("hasAgreedToAllPolicies = false")
        )
        .andWhere(
            $dbx.exp("created < {:fifteenMinsAgo}", { fifteenMinsAgo })
        )
        .all(usersToDelete)


        usersToDelete.forEach(doc => {

            // Delete the user
            try {

                let record = $app.findRecordById("users", doc.id)
                $app.delete(record)

            } catch (error) {
                console.log("Failed to delete user who did not agree to all policies", error)
                $app.logger().error("Failed to delete user who did not agree to all policies", error)
            }

            console.log("Deleted", usersToDelete?.length, " users who did not agree to all policies")
            $app.logger().error("Deleted", usersToDelete?.length, " users who did not agree to all policies")

        })

    } catch (error) {
        console.error("Error removing users who have not agreed to all policies", error)
        $app.logger().error("Error removing users who have not agreed to all policies", error)
    }


})