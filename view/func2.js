var debugMode = false;
databaseRef = {};
var fireInfo = {
    'uid': null,
    'ducksPath': '/tes/data/',
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

function fireRead(ref) {
    //.orderByChild('date').startAt("05/29/2017")
    fireAuth().then(function(uid) {
        ref.orderByChild('_time').on('value', function(snapshot) {
            //console.table(snapshot.val());
            console.log(snapshot.val());


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
            });
            
            

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
                console.log('uid:' + data.uid);
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
        '<td>' + el['id'] + '</td>' +
        '<td>' + el['temprature'] + '</td>' +
        '<td>' + el['humidity'] + '</td>' +
        '<td>' + (el['status'] || '') + '</td>';
    htmlTable += '</tr>';
    return htmlTable;
}

function jQArrayToHtmlTable(arr) {
    /*
    ARR:
    [{
    	amount-new-egg
    	amount-old-egg
    	amount-plus-egg
    	date
    	region}, {...}, ... ]
    ====
    TABLE:
    	| 日期 | 地點 | 新蛋 | 老蛋 | 加工 |
    	------------------------------------
    */
    let htmlTable = '';
    jQuery.each(arr, function(index, el) {
        htmlTable += '<tr>';
        htmlTable +=
            '<td>' + new Date(el['_time']).toLocaleString() + '</td>' +
            '<td>' + el['id'] + '</td>' +
            '<td>' + el['temprature'] + '</td>' +
            '<td>' + el['humidity'] + '</td>' +
            '<td>' + (el['status'] || '') + '</td>';
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


