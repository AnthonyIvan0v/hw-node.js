const controllersWrapper = (controllers) => {
    const func = async (req, res, next) => {
        try {
            await controllers(req, res, next);
        } catch (error) {
            next(error);
        }
    };
    return func;
};

module.exports = controllersWrapper;
