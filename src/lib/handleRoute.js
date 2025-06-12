export const handleRoute = (asyncFun) => {
    return async (req, res, next) => {
        try {
            await asyncFun(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}