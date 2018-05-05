var debugMode = false;
databaseRef = {};
var fireInfo = {
    'uid': null,
    'ducksPath': '/tes/devices/',
    // 'ducksPath': '/tes_socket/data/',
    'ref': null,
    'table': null
}

function debuglog(name, val) {
    if (debugMode) {
        console.group('==== ' + name + ' ====');
        console.log(val);
        console.groupEnd();
    } else {}
}

$(document).ready(function() {

    /* Firebase start */
    fireAuth().then(function(uid) {
        console.info('Firebase connection successed!');
        fireInfo['ref'] = firebase.database().ref(fireInfo['ducksPath']);
        fireRead(fireInfo['ref']);
        //FireOnAdded(fireInfo['ref']);
    });

    $("#datepick").datepicker(); //{'format':'yyyy/mm/dd'}

    $("#form-price").on("submit", function(event) {

        event.preventDefault();
        let formObj = jQFormSerializeArrToJson($(this).serializeArray());
        //formObj.date = new Date(formObj.date);
        //let date = formObj.date.replace('/');
        //formObj.date = date[2]+date[0]+date[1];
        debuglog('formObj', formObj);
        FirePush(formObj);

    });



});

function FireOnAdded(ref) {
    fireAuth().then(function(uid) {
        ref.limitToLast(1).on('child_added', function(snapshot) {
            //console.table(snapshot.val());
            //let table = jQArrayToHtmlTable(snapshot.val());
            console.warn(snapshot.val());
            //$("#form-eggList").html(table);
        });
    })
}

function FirePush(formObj) {
    fireAuth().then(function(uid) {
        fireInfo['ref'].push(formObj);
    })
}
var r = {table: null};
var firstChildAdded = false;
function fireRead(ref) {
    //.orderByChild('date').startAt("05/29/2017")
    fireAuth().then(function(uid) {
	let tt = r.table;
	tt = $('#table-eggList').DataTable({
		// "destroy": true,
		"columns": [
			{data: "_time", render: function(m){return new Date(m).toLocaleString();} },
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
		"order": [ [0, "desc"], ],
	});
        ref.orderByChild('_time').once('value', function(snapshot) {
            //console.table(snapshot.val());
            let v = snapshot.val();
            let arr = [];
            for(let key in v) {
                arr.push(v[key]);
            }
            tt.rows.add(arr).draw();
            onAdded();
	        /*
            let table = jQArrayToHtmlTable(snapshot.val());
            
            if (fireInfo['table']) {
                fireInfo['table'].destroy();
            }
            $("#form-eggList").html(table);
            fireInfo['table'] = $('#table-eggList').DataTable({
                "destroy": true,
                "order": [
                    [0, "desc"]
                ]
            }); */             
        });
        ref.limitToLast(1).on('child_added', function(snap) {
            if(firstChildAdded) {
                let addEl = snap.val();
                // console.log(addEl);
                tt.row.add(addEl).draw();
                // tt.row.add([addEl._time, addEl.ip, addEl.string, addEl.hex]).draw();
            }else {
                firstChildAdded = true;
            }
        });


    })
}


function fireAuth() {

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
            /*var config = {
                apiKey: "AIzaSyC3FbiHwXeoeW2D8INTdium56nsZbYGWCw",
                authDomain: "ducks-e38bc.firebaseapp.com",
                databaseURL: "https://ducks-e38bc.firebaseio.com",
                projectId: "ducks-e38bc",
                storageBucket: "ducks-e38bc.appspot.com",
                messagingSenderId: "11994674623"
            };
            firebase.initializeApp(config); */
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

function jQObjToHtmlTable(el) {
    let htmlTable = '<tr>';
    htmlTable +=
        '<td>' + new Date(el['_time']).getDate() + '</td>' +
        '<td>' + el['ip'] + '</td>' +
        '<td><pre>' + el['string'] + '</pre></td>' +
        '<td><pre>' + el['hex'] + '</pre></td>' ;
    htmlTable += '</tr>';
    return htmlTable;
}

function jQArrayToHtmlTable(arr) {
    /*

    */
    let htmlTable = '';
    jQuery.each(arr, function(index, el) {
        htmlTable += '<tr>';
        htmlTable +=
            '<td>' + new Date(el['_time']).toLocaleString() + '</td>' +
            '<td>' + el['ip'] + '</td>' +
            '<td><pre>' + el['string'] + '</pre></td>' +
            '<td><pre>' + el['hex'] + '</pre></td>' ;
        htmlTable += '</tr>';
    });
    return htmlTable;
}

function jQFormSerializeArrToJson(formSerializeArr) {
    let jsonObj = {};
    jQuery.map(formSerializeArr, function(n, i) {
        jsonObj[n.name] = n.value;
    });

    return jsonObj;
}


