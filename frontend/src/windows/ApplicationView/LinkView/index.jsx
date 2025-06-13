export function LinkView({ linkText, link }) {
    return (
        <a href={link}>
            <button>
                {linkText}
            </button>
        </a>
    )
}