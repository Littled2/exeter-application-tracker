import { PropagateLoader } from "react-spinners";

export function AnimatedButton({ submitting, children, ...props }) {
    return (
        <button {...props}>
            {
                !submitting ? (
                    children
                ) : (
                    // <PropagateLoader />
                    "Processing..."
                )
            }
        </button>
    )
}