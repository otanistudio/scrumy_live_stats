var countEm = function(tasks) {
    var pattern = /\((-?\d*\.?\d+?)\)/;    
    var timeUnits = 0;
    var numTasks = tasks.length;
    while (numTasks--) {
        var timeExtract = pattern.exec( $(tasks[numTasks]).text() ) || [null, 3];
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
                        var storyTodoCount = countEm(row.find('td.todo > div.task pre.title_inner'));
                        var storyInProgressCount = countEm(row.find('td.inprogress > div.task pre.title_inner'));
                        var storyVerifyCount = countEm(row.find('td.verify > div.task pre.title_inner'));
                        var storyDoneCount = countEm(row.find('td.done > div.task pre.title_inner'));
                        
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