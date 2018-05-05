/** FIREBASE */
var firebase = require("firebase-admin");
var serviceAccount = require
("./fire/firefunc-e5617-firebase-adminsdk-bngj0-0685a7a2f5.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://firefunc-e5617.firebaseio.com"
});
var fireDB = firebase.database();
/** NET */
var net = require('net');
var decode= require('net-buffer').decode
var TMP = null;
const server = net.createServer(function(sock) {
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    /*
    sock.on('data', function(data) {
        console.log('---- DATA ---- ' + sock.remoteAddress);
        toFirebase(data, sock.remoteAddress);
        sock.write('OK!');
        sock.destroy();
    }); */
    sock.on('data', function(buffer){
        console.log('=============== GET ===============');
        /* for(let i = 0; i< buffer.length; i++) {
            console.log(parseInt(buffer[i], 10));    
        } */
        
        if(buffer.length === 20) {
            if(buffer[0] == 0x55 && buffer[1] == 0xAA && buffer[2] == 0x11 && buffer[19] == 0xED) {
                console.log('GO: ' + buffer.toString());
                TesRenderData(buffer, sock.remoteAddress);
                sock.write('GOGO!');
            }else {
                console.log('LENGTH ERROR: ' + new Date());
            }
            
            // sock.destroy();
        }else {
            console.log('REJECT: ' + new Date());
            sock.destroy();
        }
        sock.destroy();
    });


    sock.on('close', function(data) {
        console.log('=============== CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
    sock.on('error', function(err) {
        console.log(err);
    });
}).listen(5325, '0.0.0.0');
server.on('error', (err) => {
    // handle errors here
    console.log(' !!!!!!!!!!!  ERROR !!!!!!!!!!!'  + new Date());
    throw err;
});
console.log('SOCKET SERVER RUN!')
function TesRenderData(buffer, ip) {
    try {
        console.log(buffer.toString('hex'));
        let check = 0;
        let data = {
            mac: '',
            pm: 0,
            tep: 0,
            hu: 0,
            tep_s: 0,
        }
        buffer.map((v, idx) => {
            check += parseInt(v);
            if(idx >= 3 && idx <= 8) {
                // Mac Address
                data.mac += v.toString(16);
            } else if (idx == 9) { // idx >= 9 && idx <= 10
                // PM2.5
                data.pm = doubleHexToData(buffer[idx], buffer[idx+1], false);
            } else if (idx >= 11 && idx <= 12) {
                // VOCS 保留
            } else if (idx == 13) { // idx >= 13 && idx <= 14
                // Temprature
                data.tep = doubleHexToData(buffer[idx], buffer[idx+1]);
            } else if (idx == 15) { // idx >= 15 && idx <= 16
                // Humidity
                data.hu = doubleHexToData(buffer[idx], buffer[idx+1]);
            } else if (idx == 17) { // idx >= 15 && idx <= 16
                // Temprature Sign (C or F)
                if (parseInt(buffer[idx]) & 0x04) {
                    data.tep_s = 'F';
                    data.tep = Math.round(data.tep * 9 / 5 *10)/10 +32
                } else {
                    data.tep_s = 'C';
                }
                
            } else if (idx == 18) { // idx >= 17 && idx <= 18
                // Checksum
                if( check % 256 == 0 && data.mac.length) {
                    data.mac = data.mac.toLowerCase();
                    TesDataToFire(data, ip);
                    return true;
                } else {

                    console.warn('ERROR');
                    TesDataLog('ERROR: Invalid Protocol, ' + buffer.toString('hex'), ip);
                    return false;
                }
            } else {
                
            }
        });
        console.log('===RESAULT===' + new Date());
        console.log(data);
        return false;
    }catch(err) {
        console.log(new Date());
        console.log('ERR: TesRenderData()' + new Date());
        TesDataLog('ERROR: TesRenderData(), ' + JSON.stringify(err));
        throw err;
    }

}
function doubleHexToData(a, b, isTenMulti = true) {
    let MSB = parseInt(a)*16*16;
    let LSB = parseInt(b);
    let tmp =  MSB + LSB;
    if (tmp & 0x8000) {
        tmp = (0xffff - tmp + 0x0001) * (-1);
    } else {

    }
    return (tmp != 0) ? ((isTenMulti)?(tmp / 10): tmp ): 0;
}
function TesDataLog(ll = '', ip) {
    fireDB.ref('/tes/_LOGS/').push({
        _t: firebase.database.ServerValue.TIMESTAMP,
        i: ip,
        l: ll,
    }).then(res => {
        console.log('>>> FIRE LOG');
    }). catch(err => {
        console.error(err);
        console.error('>>> ERROR TesDataLog');
    });
}
function TesDataToFire(data, ip = '-') {
    // TODO
    fireDB.ref('/tes/devices/').push({
        _time: firebase.database.ServerValue.TIMESTAMP,
        _i: ip,
        ...data
    }).then(res => {
        console.log('>>> FIRE');
    }). catch(err => {
        TesDataLog('ERROR: TesDataToFire(), ' + JSON.stringify(err), ip);
        console.error(err);
        console.error('>>> ERROR TesDataToFire');
    });
}
var toFirebase = function(data, ip) {
    fireDB.ref('/tes_socket/data').push({
        _time: firebase.database.ServerValue.TIMESTAMP,
	ip: ip,
        string: data.toString(),
	hex: data.toString('hex'),
    });
}
