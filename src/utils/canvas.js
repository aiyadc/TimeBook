import { fabric } from "fabric";

function canvas(_canvasObject) {
    var _config = {
        canvasState: [],
        currentStateIndex: -1,
        undoStatus: false,
        redoStatus: false,
        undoFinishedStatus: 1,
        redoFinishedStatus: 1,
        undoButton: document.getElementById("undo"),
        redoButton: document.getElementById("redo")
    };

    _canvasObject.on("object:modified", function() {
        updateCanvasState();
    });

    _canvasObject.on("object:added", function() {
        updateCanvasState();
    });

    var updateCanvasState = function() {
        if (_config.undoStatus == false && _config.redoStatus == false) {
            var jsonData = _canvasObject.toJSON();
            var canvasAsJson = JSON.stringify(jsonData);
            if (_config.currentStateIndex < _config.canvasState.length - 1) {
                // 在撤销过程中，如果有进行更改，那么撤销所在的那一步之后的将会被清空
                var indexToBeInserted = _config.currentStateIndex + 1;
                _config.canvasState[indexToBeInserted] = canvasAsJson;
                var numberOfElementsToRetain = indexToBeInserted + 1;
                _config.canvasState = _config.canvasState.splice(
                    0,
                    numberOfElementsToRetain
                );
            } else {
                //如果没在撤销给过程中则直接push进去即可
                _config.canvasState.push(canvasAsJson);
            }
            // 无论什么情况，只要做了改变，那么当前指针就会跑到最前面
            _config.currentStateIndex = _config.canvasState.length - 1;
            if (
                _config.currentStateIndex == _config.canvasState.length - 1 &&
                _config.currentStateIndex != -1
            ) {
                _config.redoButton.disabled = "disabled";
            }
        }
    };

    var undo = function() {
        if (_config.undoFinishedStatus) {
            if (_config.currentStateIndex == -1) {
                _config.undoStatus = false;
            } else {
                if (_config.canvasState.length >= 1) {
                    _config.undoFinishedStatus = 0;
                    if (_config.currentStateIndex != 0) {
                        _config.undoStatus = true;
                        _canvasObject.loadFromJSON(
                            _config.canvasState[_config.currentStateIndex - 1],
                            function() {
                                var jsonData = JSON.parse(
                                    _config.canvasState[_config.currentStateIndex - 1]
                                );
                                _canvasObject.renderAll();
                                _config.undoStatus = false;
                                _config.currentStateIndex -= 1;
                                _config.undoButton.removeAttribute("disabled");
                                // 只要不是最前面的步骤，undo之后，redo就是解封的
                                if (
                                    _config.currentStateIndex !==
                                    _config.canvasState.length - 1
                                ) {
                                    _config.redoButton.removeAttribute("disabled");
                                }
                                _config.undoFinishedStatus = 1;
                            }
                        );
                    } else if (_config.currentStateIndex == 0) {
                        _canvasObject.clear();
                        _config.undoFinishedStatus = 1;
                        _config.undoButton.disabled = "disabled";
                        _config.redoButton.removeAttribute("disabled");
                        _config.currentStateIndex -= 1;
                    }
                }
            }
        }
    };

    var redo = function() {
        if (_config.redoFinishedStatus) {
            if (
                _config.currentStateIndex == _config.canvasState.length - 1 &&
                _config.currentStateIndex != -1
            ) {
                _config.redoButton.disabled = "disabled";
            } else {
                if (
                    _config.canvasState.length > _config.currentStateIndex &&
                    _config.canvasState.length != 0
                ) {
                    _config.redoFinishedStatus = 0;
                    _config.redoStatus = true;
                    _canvasObject.loadFromJSON(
                        _config.canvasState[_config.currentStateIndex + 1],
                        function() {
                            var jsonData = JSON.parse(
                                _config.canvasState[_config.currentStateIndex + 1]
                            );
                            _canvasObject.renderAll();
                            _config.redoStatus = false;
                            _config.currentStateIndex += 1;
                            if (_config.currentStateIndex != -1) {
                                _config.undoButton.removeAttribute("disabled");
                            }
                            _config.redoFinishedStatus = 1;
                            if (
                                _config.currentStateIndex == _config.canvasState.length - 1 &&
                                _config.currentStateIndex != -1
                            ) {
                                _config.redoButton.disabled = "disabled";
                            }
                        }
                    );
                }
            }
        }
    };
    return {
        undoButton: _config.undoButton,
        redoButton: _config.redoButton,
        undo: undo,
        redo: redo
    };
};
// console.log(canvas)
export default canvas