var ANIMATION_DURATION = 100;

var canvasHTML = '<canvas id="timetable" width="811" height=""391/>';

var downloadButtonHTML = '' +
    '<a download="schedule.png" class="SSSBUTTON_ACTIONLINK" id="download-btn"> ' + 
        'Download Schedule' + 
    '</a>';

var buttonHTML = '' +
    '<a href="#" class="timetable-button SSSBUTTON_ACTIONLINK">Toggle Timetable</a>';

var container = '' +
    '<table id="timetable-container">' +
        '<tr>' +
            '<td width="250px"></td>' +
            '<td>' +
                downloadButtonHTML +
            '</td>' + 
            '<td style="position:relative">' +
                canvasHTML +
                buttonHTML +
            '</td>'
        '</tr>' +
    '</table>'; 

var selectedColors = [
                        '#FF6600','#086B08','#4B7188','#8C0005','#FF69B1',
                        '#191973','#474747','#8B5928','#C824F9','#8EEFC2'
                    ];

$(document).ready(function() {
    var iframe = $('#ptifrmtgtframe');
    var toggleState = false;

    iframeWindow = iframe[0].contentWindow || iframe[0].contentWindow.window;
    iframeDocument = iframe[0].contentDocument || iframe[0].contentWindow.document;

    $(iframeWindow).bind('load', function() {
        setInterval(function() {
            if($('#timetable', iframe.contents()).length === 0) {
                createTimeTable();
            }
            else {
                iframeWindow.document.getElementById('download-btn')
                            .addEventListener('click', downloadSchedule, false);
            }
        }, 50)

        createTimeTable();

        function createTimeTable() {
            var subjects = [];
            var colors = {};

            $('#timetable', iframe.contents()).remove();

            // check if we're on the search part
            if($('a[id="DERIVED_SSS_CRT_LINK_ADD_ENRL"]', iframe.contents()).length) {
                var subjectsElement = $('[id^="DERIVED_SSS_CRT_SSS_SUBJ_CATLG$"]', iframe.contents());
                var durationRoomElement = $('[id^="DERIVED_SSS_CRT_SSR_MTG_SCHED_LONG$"]', iframe.contents());

                subjectsElement.each(function(i) {
                    var courseName = $(this).text();
                    var durationRoomTemp = $(durationRoomElement[i]).text().split('\n');
                    var durationRoom = [];

                    for(var j = 0; j < durationRoomTemp.length / 2 + 1; j += 2) {
                        durationRoom.push({
                            day: parseDay(durationRoomTemp[j]),
                            time: parseTime(durationRoomTemp[j]),
                            room: durationRoomTemp[j + 1]
                        });
                    }

                    if(courseName === ' ') {
                        courseName = $(this).closest('[id^="trSSR_REGFORM_VW$0_row"]').prev().find('[id^="DERIVED_SSS_CRT_SSS_SUBJ_CATLG$"]').text()
                    }

                    var day = durationRoom.map(function(o) {
                        return o.day;
                    });
                    var time = durationRoom.map(function(o) {
                        return o.time;
                    });
                    var room = durationRoom.map(function(o) {
                        return o.room;
                    });

                    subjects.push({
                        courseName: courseName,
                        day: day,
                        time: time,
                        room: room
                    });

                    if (!(courseName in colors)) {
                        if (selectedColors.length <= 0) {
                            selectedColors = [
                                        '#FF6600','#086B08','#4B7188','#8C0005','#FF69B1',
                                        '#191973','#474747','#8B5928','#C824F9','#8EEFC2'
                                    ];
                        }

                        colors[courseName] = selectedColors.shift();
                    }
                });
            }
            // we're on add to cart page probably
            else {
                var subjectsElement = $('span[title="View Details"]', iframe.contents());
                var durationElement = $('[id^="DERIVED_REGFRM1_SSR_MTG_SCHED_LONG$"]', iframe.contents());
                var roomElement = $('[id^="DERIVED_REGFRM1_SSR_MTG_LOC_LONG$"]', iframe.contents());

                subjectsElement.each(function(i) {
                    var subjectsFullCourseName = $(this).text().replace('\n', '');
                    var courseName = subjectsFullCourseName.match(/[^-]+-/)[0];

                    if($(durationElement[i]).text() !== 'TBA') {
                        courseName = courseName.substring(0, courseName.length - 1);

                        var dayTime = $(durationElement[i]).text().split('\n') 
                        var day = dayTime.map(parseDay)
                        var time = dayTime.map(parseTime)
                        var room = $(roomElement[i]).text().split('\n');

                        subjects.push({
                            courseName: courseName,
                            section: subjectsFullCourseName.match(/-[A-Z0-9]+/)[0].substring(1),
                            day: day,
                            time: time,
                            room: room
                        });

                        if (!(courseName in colors)) {
                            if (selectedColors.length <= 0) {
                                selectedColors = [
                                            '#FF6600','#086B08','#4B7188','#8C0005','#FF69B1',
                                            '#191973','#474747','#8B5928','#C824F9','#8EEFC2'
                                        ];
                            }

                            colors[courseName] = selectedColors.shift();
                        }
                    }
                });
            }

            if($('[id="win0divSSR_REGFORM_VW$0"]', iframe.contents()).length) {
                $('[id="win0divSSR_REGFORM_VW$0"]', iframe.contents()).prepend(container);
            }
            else if(/Confirm classes$/.test($('#DERIVED_REGFRM1_TITLE1', iframe.contents()).text())) {
                $('[id="ACE_DERIVED_REGFRM1_"]', iframe.contents()).children('tbody').children('tr:nth-child(3)').children('td').append(container);

                $('#timetable-container').find('td').first().css('width', '400');
            }

            if(toggleState) {
                $('#timetable', iframe.contents()).show(ANIMATION_DURATION);
                toggleState = true;
            }
            else {
                $('#timetable', iframe.contents()).hide(ANIMATION_DURATION);
                toggleState = false;
            }

            if($('#timetable', iframe.contents()).length) {
                scheda.init('timetable', {
                    bgColor : "#FFFFFF",
                    headerBgColor : "#00838F",
                    miniGridColor : "#DFE0D2",
                    hMainGridColor : "#00838F",
                    vMainGridColor : "#00838F",
                    timeColumnWidth : 80,
                    time : {
                        color : "#FFFFFF",
                        bgColor : "#00838F",
                        style : "bold",
                        font : "Arial",
                        size : 12
                    },
                    day : {
                        color : "#FFFFFF",
                        style : "bold",
                        font : "Arial",
                        size : 12
                    },
                    sched : {
                        color : "#FFFFFF",
                        style : "bold",
                        font : "Arial",
                        size : 10
                    }
                });

                subjects.forEach(function(subject) {
                    if(subject.day) {
                        for(var i = 0; i < subject.day.length; i++) {
                            if(subject.day[i]) {
                                scheda.drawCourse(
                                    subject.day[i].map(convertDate).join(''),
                                    subject.time[i].start + '-' + subject.time[i].end,
                                    subject.courseName,
                                    subject.section,
                                    subject.room[i],
                                    colors[subject.courseName]
                                );
                            }
                        }
                    }
                });
            }

            $('.timetable-button', iframe.contents()).on('click', function(e) {
                if(toggleState) {
                    toggleState = false;
                    $('#timetable', iframe.contents()).hide(ANIMATION_DURATION);
                }
                else {
                    toggleState = true;
                    $('#timetable', iframe.contents()).show(ANIMATION_DURATION);
                }
            });
        }
    });
});

function parseDay(fullDay) {
    var arr = fullDay.match(/[A-Z][a-z]/g);

    if(!arr) {
        return null;
    }

    return arr; 
}

function parseTime(fullDay) {
    var arr = fullDay.match(/\d{1,2}:\d{2}/g);

    if(!arr) {
        return null;
    }
    else {
        return {
            start: arr[0],
            end: arr[1]
        };
    }
}

function convertDate(date) {
    return date === 'Th' ? 'Th' : date[0];
}

function cloneArray(array) {
    return array.slice()
}

function downloadSchedule () {
    iframe = $('#ptifrmtgtframe');
    iframeWindow = iframe[0].contentWindow || iframe[0].contentWindow.window;
    timetable = iframeWindow.document.getElementById('timetable');

    dt = timetable.toDataURL('image/png');
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=schedule.png');

    this.href = dt;
}