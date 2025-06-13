import { useForm } from "react-hook-form"

export function Login() {

    const { register, handleSubmit } = useForm()

    return (
        <form className="flex col gap-s">
            <h2>Login</h2>
            <hr/>
            <div>
                <div>
                    <label>Username</label>
                </div>
                <input style={{ width: "100%" }} placeholder="Username" type="text" {...register("username")}></input>
            </div>
            <div>
                <div>
                    <label>Password</label>
                </div>
                <input style={{ width: "100%" }} placeholder="Password" type="password" {...register("password")}></input>
            </div>
            <div>
                <input type="submit"/>
            </div>
        </form>
    )
}