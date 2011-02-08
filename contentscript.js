var countEm = function(tasks) {
    var pattern = /\((\d+)\)/;    
    var timeUnits = 0;
    for (var i = 0; i < tasks.length; i++) {
        var timeExtract = pattern.exec( $(tasks[i]).text() ) || [null, 3];
        if(null !== timeExtract && 'NaN' != timeExtract[1] && timeExtract.length == 2) {
            timeUnits += parseFloat(timeExtract[1]);            
        }
    }
    return timeUnits;
}

chrome.extension.onConnect.addListener(
    function(port) {
        port.onMessage.addListener(
            function(msg) {
                var storyRows = $('tr.story-task-row').toArray();
                var stories = [];
                for(var i = 0; i < storyRows.length; i++) {
                    var storyCols = $(storyRows[i]).children().toArray();
                    for(var j = 0; j < storyCols[j].length; j++) {
                        
                    }                    
                }
                
                var taskTimes = {
                    "done" : countEm($('td.done pre.title_inner')),
                    "todo" : countEm($('td.todo pre.title_inner')),
                    "verify" : countEm($('td.verify pre.title_inner')),
                    "inProgress" : countEm($('td.inprogress pre.title_inner'))    
                };
                port.postMessage(taskTimes);
            }
        );
    }
);