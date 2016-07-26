var canvasHTML = '' + 
    '<canvas id="timetable" width="811" height=""391/>';

var buttonHTML = '' +
    '<a href="#" class="timetable-button">+</a>'; 

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
        }, 50)

        createTimeTable();

        function createTimeTable() {
            var subjectsElement = $('span[title="View Details"]', iframe.contents());
            var durationElement = $('[id^="DERIVED_REGFRM1_SSR_MTG_SCHED_LONG$"]', iframe.contents());
            var roomElement = $('[id^="DERIVED_REGFRM1_SSR_MTG_LOC_LONG$"]', iframe.contents())
            var subjects = [];

            $('#timetable', iframe.contents()).remove();

            subjectsElement.each(function(i) {
                var subjectsFullCourseName = $(this).text().replace('\n', '');
                var courseName = subjectsFullCourseName.match(/[^-]+-/)[0];

                if($(durationElement[i]).text() !== 'TBA') {
                    subjects.push({
                        courseName: courseName.substring(0, courseName.length - 1),
                        section: subjectsFullCourseName.match(/-[A-Z0-9]+/)[0].substring(1),
                        day: parseDay($(durationElement[i]).text()),
                        time: parseTime($(durationElement[i]).text()),
                        room: $(roomElement[i]).text()
                    });
                }
            });

            $('[id="win0divSSR_REGFORM_VWGP$0"]', iframe.contents()).append(canvasHTML);
            $('[id="win0divSSR_REGFORM_VWGP$0"]', iframe.contents()).append(buttonHTML);

            if(toggleState) {
                $('#timetable', iframe.contents()).show();
                toggleState = true;
                $('.timetable-button', iframe.contents()).text('-');
            }
            else {
                $('#timetable', iframe.contents()).hide();
                toggleState = false;
                $('.timetable-button', iframe.contents()).text('+');
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

                console.log(subjects);

                subjects.forEach(function(subject) {
                    if(subject.day) {
                        scheda.drawCourse(subject.day.map(function(date){ return convertDate(date) }).join(''), subject.time.start + '-' + subject.time.end, subject.courseName, subject.section, subject.room);
                    }
                });
            }

            $('.timetable-button', iframe.contents()).on('click', function(e) {
                if(toggleState) {
                    toggleState = false;
                    $('#timetable', iframe.contents()).hide();
                    $('.timetable-button', iframe.contents()).text('+');
                }
                else {
                    toggleState = true;
                    $('#timetable', iframe.contents()).show();
                    $('.timetable-button', iframe.contents()).text('-');
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
    if(date === 'Mo') return 'M';
    if(date === 'Tu') return 'T';
    if(date === 'We') return 'W';
    if(date === 'Th') return 'Th';
    if(date === 'Fr') return 'F';
    if(date === 'Sa') return 'S';
}

function cloneArray(array) {
    return JSON.parse(JSON.stringify(array));
}