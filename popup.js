$(function() {
    chrome.tabs.getSelected(
        null,
        function(tab) {
            var port = chrome.tabs.connect(tab.id);
            port.postMessage({'question':'ping'});
            port.onMessage.addListener(
                function(o) {
                    var totalTimeUnits = o.totalDone + o.totalTodo + o.totalVerify + o.totalInProgress;
                    var percentComplete = Math.round((o.totalDone / totalTimeUnits)*100);
                    
                    // build out raw string for breakdown by story; screw fancy templates, i say (for now)
                    var storiesTable = "<table id='stories'><thead><tr><th>story</th><th>todo</th><th>in progress</th><th>verify</th><th>done</th></tr><tbody>";
                    var i = 0; numStories = o.stories.length;                   
                    for(i; i < numStories; i++) {
                        var story = o.stories[i];
                        storiesTable += "<tr>" +
                                            "<td>" + story.name + "</td>" +
                                            "<td class='data'>" + story.todo + "</td>" +
                                            "<td class='data'>" + story.inProgress + "</td>" +
                                            "<td class='data'>" + story.verify + "</td>" +
                                            "<td class='data'>" + story.done + "</td>" +
                                        "</tr>";
                    }
                    storiesTable += "</tbody></table>";
                    $('#output').html(  
                        "<div id='progress_bar_total'>" + 
                            "<div id='progress_bar_done' style='width:" + percentComplete + "%'>" + 
                                percentComplete + "% complete" +
                            "</div>" + 
                            "<div id='progress_bar_info'>" + o.totalDone + " (complete) / " + totalTimeUnits + " (total)</div>" +
                        "</div>"  +                                         
                        "<table>" +
                            "<thead>" +
                                "<tr><th>todo</th><th>in progress</th><th>verify</th><th>done</th></tr>" +
                            "</thead>" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td>" + o.totalTodo + "</td>" +
                                    "<td>" + o.totalInProgress + "</td>" +
                                    "<td>" + o.totalVerify + "</td>" +
                                    "<td>" + o.totalDone + "</td>" +
                                "</tr>" +
                            "</tbody>" +
                        "</table>" +
                        "<div style='position:relative;'>" +
                            "<h2>Breakdown by Story</h2>" +                        
                            "<div id='tape'><div id='tape_inner'></div><img src='img/btn_close.png' /></div>" +
                            storiesTable +
                        "</div>"           
                    );
                    
                    $('#progress_bar_total').unbind();
                    
                    $('#progress_bar_total').hover(
                        function() {
                            $('#progress_bar_info').css('display', 'block');
                        },
                        function() {
                            $('#progress_bar_info').css('display', 'none');
                        }
                    );
                    
                    var customSum = 0;
                    $('table#stories td.data').click(
                            function() {
                                var v = parseFloat($(this).text());
                                
                                if($(this).hasClass('selected')) {
                                    customSum -= v;
                                    $('#tape_inner').text(customSum);
                                    $(this).removeClass('selected'); 
                                    if( 0 === $('table#stories').find('td.selected').length ) {
                                        $('#tape').removeClass('visible');
                                        customSum = 0;
                                    }                                 
                                } else {                                    
                                    customSum += v;
                                    $('#tape_inner').text(customSum);
                                    $(this).addClass('selected');
                                    if( ! $('#tape').hasClass('visible')) {
                                        $('#tape').addClass('visible');
                                    }
                                }

                            }
                        );
                    
                    $('#tape').click(
                        function() {
                            $('#tape_inner').text('');
                            $(this).removeClass('visible');
                            $('table#stories td.data').removeClass('selected');
                            customSum = 0;
                        }
                    );
                }
            );
        });        
    }
);