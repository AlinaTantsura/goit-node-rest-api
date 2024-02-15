export const handleMongooseError = (error, data, next) => {
    console.log("handleMongoose is working")
    error.status = 404;
    next();
}