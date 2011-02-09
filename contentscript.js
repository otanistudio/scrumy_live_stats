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
                
                var stories = [];
                
                var totalTodo = 0;
                var totalInProgress = 0;
                var totalVerify = 0;
                var totalDone = 0;
                
                $('tr.story-task-row').each(
                    function() {
                        var row = $(this);
                        var storyName = $.trim(row.find('td.stories div.story div.story-handle span.title').text());
                        var storyTodoCount = countEm(row.find('td.todo > div.task'));
                        var storyInProgressCount = countEm(row.find('td.inprogress > div.task'));
                        var storyVerifyCount = countEm(row.find('td.verify > div.task'));
                        var storyDoneCount = countEm(row.find('td.done > div.task'));
                        stories.push({
                            'name' : storyName,
                            'todo' : storyTodoCount,
                            'inProgress' : storyInProgressCount,
                            'verify' : storyVerifyCount,
                            'done' : storyDoneCount
                        });
                        
                        totalTodo += storyTodoCount;
                        totalInProgress += storyInProgressCount;
                        totalVerify += storyVerifyCount;
                        totalDone += storyDoneCount;
                    }
                );
                                
                var taskTimes = {
                    "totalTodo" : totalTodo,
                    "totalInProgress" : totalInProgress,
                    "totalVerify" : totalVerify,
                    "totalDone" : totalDone,
                    "stories" : stories
                };
                port.postMessage(taskTimes);
            }
        );
    }
);