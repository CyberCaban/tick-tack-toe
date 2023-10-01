/**
 * @route POST play/connect
 * @desc connect to a room
 */

const connect = async (req, res) => {
    try {
        res.status(200).json("ping");
    } catch (e) {
        res.status(400).json(e);
    }
};

/**
 * @route POST play/turn
 * @desc test
 */

const turn = async (req, res) => {
    try {
        res.status(200).json(req.body);
    } catch (e) {
        res.status(400).json(e);
    }
};

module.exports = {
    turn,
    connect,
};
