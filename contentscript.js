var countEm = function(tasks) {
    var pattern = /\((-?\d+)\)/;    
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
                
                $('tr.story-task-row').each(
                    function() {
                        //console.log($(this));
                        var row = $(this);
                        var storyName = $.trim(row.find('td.stories div.story div.story-handle span.title').text());
                        var storyTodoCount = countEm(row.find('td.todo > div.task'));
                        var storyInProgressCount = countEm(row.find('td.inprogress > div.task'));
                        var storyVerifyCount = countEm(row.find('td.verify > div.task'));
                        var storyDoneCount = countEm(row.find('td.done > div.task'));
                        //console.log('todo per story: ' + storyTodoCount);
                    }
                );
                
                var taskTimes = {
                    "todo" : countEm($('td.todo pre.title_inner')),
                    "inProgress" : countEm($('td.inprogress pre.title_inner')),
                    "verify" : countEm($('td.verify pre.title_inner')),
                    "done" : countEm($('td.done pre.title_inner'))
                };
                port.postMessage(taskTimes);
            }
        );
    }
);