export default (req, request) => {
    request.status(200).json({
        text: 'Hello'
    })
}