export const waitFor = (numOfSeconds, until: (() => Promise<boolean>), msIntervals = 500): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        let timeOut = numOfSeconds * 1000
        const interval = setInterval(async () => {
            if (await until()) {
                clearInterval(interval)
                return resolve(true)
            }
            timeOut -= msIntervals;
            if (timeOut <= 0) {
                return resolve(false)
            }
        }, msIntervals);
    })
}
