var debugMode = false;
var fireInfo = {
    'uid': null,
    'path': '/tes/devices/',
    // 'path': '/tes_socket/data/',
    'ref': null,
    'table': null
};
const TABLE_LIST_OPTIONS = {
    // "destroy": true,
    responsive: true,
    processing: true,
    order: [ [0, "desc"], ],
    columns: [
        {
            data: "_time",
            render: function(m){
            return new Date(m).toLocaleString('zn-TW', {year:'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false});}
        },
        {data: "mac"},
        {data: "pm"},
        {data: "tep"},
        {data: "tep_s", render: function(m){return '°' + m;}},
        {data: "hu"},
    ],
    /*"columns": [
        {data: "_time", render: function(m){return new Date(m).toLocaleString();} },
        {data: "ip"},
        {data: "string"},
        {data: "hex"},
    ],*/
    
};

$(document).ready(function() {
    fireAuth$().then(function(uid) {
        console.info('Connected!');
        fireInfo['ref'] = firebase.database().ref(fireInfo['path']);
        fireRead(fireInfo['ref']);
    });

});

var firstChildAdded = false;
function fireRead(ref) {
    fireAuth$().then(function(uid) {
        fireInfo['table'] = $('#datalist').DataTable(TABLE_LIST_OPTIONS);
        ref.orderByChild('_time').limitToLast(100).once('value', function(snapshot) {
            //console.table(snapshot.val());
            let v = snapshot.val();
            let arr = [];
            for(let key in v) {
                arr.push(v[key]);
            }
            fireInfo['table'].rows.add(arr).draw();
            $('.loader').hide();
        });
        ref.limitToLast(1).on('child_added', function(snap) {
            if(firstChildAdded) {
                let addEl = snap.val();
                // console.log(addEl);
                fireInfo['table'].row.add(addEl).draw();
                // fireInfo['table'].row.add([addEl._time, addEl.ip, addEl.string, addEl.hex]).draw();
            }else {
                firstChildAdded = true;
            }
        });
    })
}

function fireAuth$() {
    return new Promise(function(resolve, reject) {
        if (!fireInfo['uid']) {
             var config = {
                apiKey: "AIzaSyCZBcJlkm-TnD1hXqaP_4_fz31jGV0Dlxk",
                authDomain: "firefunc-e5617.firebaseapp.com",
                databaseURL: "https://firefunc-e5617.firebaseio.com",
                projectId: "firefunc-e5617",
                storageBucket: "firefunc-e5617.appspot.com",
                messagingSenderId: "772742104711"
              };
              firebase.initializeApp(config);
            firebase.auth().signInAnonymously().then(function(data) {
                fireInfo['uid'] = data.uid;
                resolve(fireInfo['uid']);
            }, function(error) {
                // Handle Errors here.
                console.warn(error);
                reject(error);
            });
        } else {
            resolve(fireInfo['uid']);
        }
    });
}
