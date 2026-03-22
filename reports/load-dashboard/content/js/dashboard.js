/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 32.66734847931429, "KoPercent": 67.33265152068572};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2451359972727494, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7355960688319755, 500, 1500, "02 - Reserve (Selecionar Voo)"], "isController": false}, {"data": [0.0, 500, 1500, "01 - Home (Selecionar Cidades)"], "isController": false}, {"data": [0.0, 500, 1500, "03 - Purchase (Comprar Passagem)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 164268, 110606, 67.33265152068572, 825.6525921055833, 0, 21631, 460.0, 2051.800000000003, 3222.9500000000007, 4804.990000000002, 520.0082305829469, 2493.3239782997516, 157.98151383371058], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02 - Reserve (Selecionar Voo)", 54742, 1080, 1.9728910160388733, 768.6521135508375, 166, 8345, 388.0, 1481.0, 3107.650000000005, 4917.900000000016, 181.0257309051948, 1279.8325006345094, 47.73139389101816], "isController": false}, {"data": ["01 - Home (Selecionar Cidades)", 54948, 54948, 100.0, 943.587901288493, 0, 21631, 557.0, 1656.4000000000087, 3273.850000000002, 5064.950000000008, 173.94387375552003, 154.67326094311403, 40.58197368785515], "isController": false}, {"data": ["03 - Purchase (Comprar Passagem)", 54578, 54578, 100.0, 764.0895232511283, 166, 8240, 388.0, 1462.0, 3053.850000000002, 4838.970000000005, 180.78950070721828, 1165.1644489494413, 75.03470488336696], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Texto de confirmacao nao encontrado na resposta", 53576, 48.438601884165415, 32.6149950081574], "isController": false}, {"data": ["405/Method Not Allowed", 53902, 48.73334177169412, 32.81345118951957], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/172.217.28.147] failed: Connection timed out: connect", 4, 0.0036164403377755274, 0.002435045170087905], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Uma tentativa de conex&atilde;o falhou porque o componente conectado n&atilde;o respondeu\\r\\ncorretamente ap&oacute;s um per&iacute;odo de tempo ou a conex&atilde;o estabelecida falhou\\r\\nporque o host conectado n&atilde;o respondeu", 8, 0.007232880675551055, 0.00487009034017581], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10, 0.009041100844438819, 0.006087612925219763], "isController": false}, {"data": ["429/Too Many Requests", 3106, 2.808165922282697, 1.8908125745732582], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 164268, 110606, "405/Method Not Allowed", 53902, "Texto de confirmacao nao encontrado na resposta", 53576, "429/Too Many Requests", 3106, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Uma tentativa de conex&atilde;o falhou porque o componente conectado n&atilde;o respondeu\\r\\ncorretamente ap&oacute;s um per&iacute;odo de tempo ou a conex&atilde;o estabelecida falhou\\r\\nporque o host conectado n&atilde;o respondeu", 8], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["02 - Reserve (Selecionar Voo)", 54742, 1080, "429/Too Many Requests", 1080, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01 - Home (Selecionar Cidades)", 54948, 54948, "405/Method Not Allowed", 53902, "429/Too Many Requests", 1024, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Uma tentativa de conex&atilde;o falhou porque o componente conectado n&atilde;o respondeu\\r\\ncorretamente ap&oacute;s um per&iacute;odo de tempo ou a conex&atilde;o estabelecida falhou\\r\\nporque o host conectado n&atilde;o respondeu", 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.blazedemo.com:443 [www.blazedemo.com/172.217.28.147] failed: Connection timed out: connect", 4], "isController": false}, {"data": ["03 - Purchase (Comprar Passagem)", 54578, 54578, "Texto de confirmacao nao encontrado na resposta", 53576, "429/Too Many Requests", 1002, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
