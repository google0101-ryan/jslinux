"use strict";

var term, pc, boot_start_time;

var binaries = [false, false, false]

function loadbinary(url,slot) {
    var req, binary_array, len, typed_arrays_exist;

    req = new XMLHttpRequest();

    req.open('GET', url, true);

    typed_arrays_exist = ('ArrayBuffer' in window && 'Uint8Array' in window);
    if (typed_arrays_exist && 'mozResponseType' in req) {
        req.mozResponseType = 'arrayBuffer';
    } else if (typed_arrays_exist && 'responseType' in req) {
        req.responseType = 'arraybuffer';
    } else {
        req.overrideMimeType('text/plain; charset=x-user-defined');
        typed_arrays_exist = false;
    }

    req.onerror = function(e) {
        throw "Error while loading " + req.statusText;
    };

    req.onload = function (e) {
        console.log('onload triggered');
        if (req.readyState === 4) {
          if (req.status === 200) {
            if (typed_arrays_exist && 'mozResponse' in req) {
              binaries[slot] = req.mozResponse;
            } else if (typed_arrays_exist && req.mozResponseArrayBuffer) {
              binaries[slot] = req.mozResponseArrayBuffer;
            } else if ('responseType' in req) {
              binaries[slot] = req.response;
            } else {
              binaries[slot] = req.responseText;
            }
            //cb_f()
          } else {
            throw "Error while loading " + url;
          }
        }
    }

    req.send(null);
};

function checkbinaries() {
    if ((binaries[0] != false) && (binaries[1] != false) && (binaries[2] != false)) {
        console.log("...binaries done loading, calling start()");
    } else {
        setTimeout(checkbinaries, 500);
    }
}

function load_binaries() {
    console.log("requesting binaries");
    loadbinary('vmlinux-2.6.20.bin', 0);
    loadbinary("root.bin", 1);
    loadbinary("linuxstart.bin", 2);

    console.log("waiting for binaries to finish loading...");
}