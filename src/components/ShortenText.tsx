import { useState } from "react"

type ShortenTextProps = {
    text: string,
    styleString?: string,
    wordCount: number
}

const ShortenText = ({ text, styleString, wordCount }: ShortenTextProps) => {

    const [grow, setGrow] = useState(false)

    const myArray = text.split(' ')

    let content

    if (myArray?.length > wordCount && !grow) {
        const newText = myArray.slice(0, wordCount).toString()
            .replace(/,,/g, '###')
            .replace(/,/g, ' ')
            .replace(/###/g, ', ')
        content = (
            <p className={`whitespace-pre-line ${styleString} text-sm sm:text-base`}>
                {newText}...
                <button
                    className="block font-bold hover:underline"
                    onClick={() => setGrow(true)}
                >See more</button>
            </p>
        )
    } else {
        content = <p className={`whitespace-pre-line ${styleString} text-sm sm:text-base`}>{text}</p>
    }

    return content
}

export default ShortenText