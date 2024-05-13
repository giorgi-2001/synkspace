import { formatDistanceToNowStrict } from "date-fns"

const getDistance = (dateString: string) => {
    const distance = formatDistanceToNowStrict(new Date(dateString))
    return distance.split(' ').map((word, i) => {
        if (i === 1) {
            return word.slice(0, 1)
        }
        return word
    }).toString().replace(',', '')
}

export default getDistance