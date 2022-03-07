const { info, error } = require('../../util/logging/logging-util');
const { statusAndMsgs, constants } = require('../../util/constants/constants');
const { registryService } = require('../../services/registry-service');


const registryController = (req, res) => {
    let {hostName, nodeName, port, serviceName, timeOut, weight} = req.body;

    port = Math.abs(parseInt(port));
    timeOut = Math.abs(parseInt(timeOut)) || constants.HEARTBEAT_TIMEOUT;
    weight = Math.abs(parseInt(weight)) || 1;

    if(!(hostName && nodeName && port && serviceName)){
        error(statusAndMsgs.MSG_REGISTER_MISSING_DATA);
        res.status(statusAndMsgs.STATUS_GENERIC_ERROR).json({"message" : statusAndMsgs.MSG_REGISTER_MISSING_DATA});
        return;
    }

    const serviceResponse = registryService.registryService(serviceName, nodeName, `${hostName}:${port}`, timeOut, weight);
    info(serviceResponse);
    res.status(statusAndMsgs.STATUS_SUCCESS).json(serviceResponse);
}


const serverListController = (req, res) => {
    res.type('application/json');
    res.send(JSON.stringify(registryService.getCurrentlyRegisteredServers()));
}

module.exports = {
    registryController,
    serverListController
};