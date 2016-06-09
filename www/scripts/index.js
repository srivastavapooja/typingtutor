// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    var line1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    var line2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    var line3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    var current_word = null;
    window.word_array = [];
    var preprimer = ['a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for', 'funny', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little', 'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said', 'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'];
    var primer = ['all','am','are','at','ate','be','black','brown','but','came','did','do','eat','four','get','good','have','he','into','like','must','new','no','now','on','our','out','please','pretty','ran','ride','saw','say','she','so','soon','that','there','they','this','too','under','want','was','well','went','what','white','who','will','with','yes'];
    var first = ['after','again','an','any','as','ask','by','could','every','fly','from','give','giving','had','has','her','him','his','how','just','know','let','live','may','of','old','once','open','over','put','round','some','stop','take','thank','them','then','think','walk','were','when'];
    var second = ['always','around','because','been','before','best','both','buy','call','cold','does','dont','fast','first','five','found','gave','goes','green','its','made','many','off','or','read','right','sing','sit','sleep','tell','their','these','those','upon','us','use','very','wash','which','why','wish','work','would','write','your'];
    var third = ['about','better','bring','carry','clean','cut','done','draw','drink','eight','fall','far','full','got','grow','hold','hot','hurt','if','keep','kind','laugh','light','long','much','myself','never','only','own','pick','seven','shall','show','six','small','start','ten','today','together','try','warm'];
    var nouns = ['apple','baby','back','ball','bear','bed','bell','bird','birthday','boat','box','boy','bread','brother','cake','car','cat','chair','chicken','children','Christmas','coat','corn','cow','day','dog','doll','door','duck','egg','eye','farm','farmer','father','feet','fire','fish','floor','flower','game','garden','girl','goodbye','grass','ground','hand','head','hill','home','horse','house','kitty','leg','letter','man','men','milk','money','morning','mother','name','nest','night','paper','party','picture','pig','rabbit','rain','ring','robin','Santa Claus','school','seed','sheep','shoe','sister','snow','song','squirrel','stick','street','sun','table','thing','time','top','toy','tree','watch','water','way','wind','window','wood'];
    var alpha_order_index = 0;
    var capsOn = false;
    var timer = false;
    var numberofattempts = 0;
    var filereadcomplete = true;

    function onDeviceReady() {

        StatusBar.hide();
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        
       
        window.screen.lockOrientation('landscape');
        
        AndroidFullScreen.immersiveMode(null, null);

/***********Handle the page for beginner and advanced level**********/
        if (document.getElementById("editor") != null) {
            /*Handle the initial page load*/
            var keyboard = localStorage.getItem('keyboardtype');
            if (keyboard == null) {
                localStorage.setItem('keyboardtype', 'standard');
                keyboard = 'standard';
            }
            if (keyboard == 'standard') {
                $('<link rel="stylesheet" type="text/css" href="' + 'css/index - Standard.css' + '" >').appendTo("head");
                createKeyboard();
            }
            if (keyboard == 'big') {
                $('<link rel="stylesheet" type="text/css" href="' + 'css/index.css' + '" >').appendTo("head");
                createKeyboardBig();
            }
            document.getElementById("text_id").readOnly = true;
            document.getElementById("text_id").focus();
            addKeyeventListeners();
            readAllLists();
            
            var interval = setInterval(function () {
                if (filereadcomplete) {
                    if (localStorage.getItem("order") == "alphabetical")
                        sortWordArray();
                    selectWord();
                    if (localStorage.getItem("level") == "beginner") {
                        highlightKey();
                    } else if (localStorage.getItem("level") == "Advanced") {
                        highlightKeysAdvanced()
                    }
                    clearInterval(interval);
                }
            }, 300);
            for (var i = 97; i < 123; i++) {
                var filename = "res/audio/_" + String.fromCharCode(i) + ".wav";
                loadAudio(filename);
            }
            //  loadAudio('res/audio/away.wav');

            /*Handle the speaker button*/
            $("#volume_id").click(function(){
                $(".volume_btn").toggleClass("mute_btn");
            });
            
            /*Handle the refresh button*/
            document.getElementById("refresh_id").addEventListener('click', function () {

                var word = document.getElementById("text_id").value;
                document.getElementById("text_id").value = null;
                current_word = document.getElementById("word_id").textContent;
                /*clear timer to stop the repetition of alphabet sound. A delay of 500 ms is added to handle the race
                situation if the key is pressed even before the timer is started*/
                
                clearInterval(timer);
                if (localStorage.getItem("level") == "beginner") {
                    var key = current_word.charAt(word.length);
                    var id = getKeyId(key);
                    document.getElementById(id).style.backgroundColor = "lightgray";
                    document.getElementById(id).disabled = true;
                    selectWord();
                    highlightKey();
                    return;
                }
                if (localStorage.getItem("level") == "Advanced") {
                    for (var i = 0; i < current_word.length; i++) {
                        var id = getKeyId(current_word.charAt(i));
                        document.getElementById(id).style.backgroundColor = "lightgray";
                        document.getElementById(id).disabled = true;
                    }
                    selectWord();
                    highlightKeysAdvanced();
                    return;
                }
            });
        }

/**********Handle the page for Expert level**********/
        if (document.getElementById("editor2") != null) {
            /*Handlr inital page load and word selection*/
            document.getElementById("text_id2").focus();
            Keyboard.show();
            readAllLists();
            var order = localStorage.getItem('order');
            if (order == null) {
                localStorage.setItem('order', 'default');
            }
            var interval = setInterval(function () {
                if (filereadcomplete) {
                    if (localStorage.getItem("order") == "alphabetical")
                        sortWordArray();
                    selectWord();
                    if (localStorage.getItem("level") == "Expert") {
                        highlightKeyExpert()
                    }
                    clearInterval(interval);
                }
            }, 300);

            for (var i = 97; i < 123; i++) {
                var filename = "res/audio/" + String.fromCharCode(i) + ".wav";
                loadAudio(filename);
            }
           // loadAudio('res/audio/fanfare.wav');

            /*Handle backspace key in Keyup event as backspace key cannot be listened in keypress event*/
            if (cordova.platformId == 'ios') {
                $('#editor2').keyup(function (e) {
                    if (e.keyCode == 8) {
                        var typed_word = document.getElementById("text_id2").value;
                        var previousspanid = "span_id" + (typed_word.length + 1);
                        $('#' + previousspanid).removeClass("span_highlight").addClass("span_class");
                    }
                    highlightKeyExpert();
                });

                /*Handle keypress events for character keys. If key pressed not the same as expected then prevent default action, else continue*/
                $('#editor2').keypress(function (e) {
                    var current_word = document.getElementById("word_id").textContent;
                    var typed_word = document.getElementById("text_id2").value;
                    
                    var ch = current_word.substr(typed_word.length, 1);
                    var ch_upper, ch_lower, charcode_upper, charcode_lower;
                    if ((ch == ",") || (ch == ".") || (ch == " ")) {
                        charcode_upper = charcode_lower = ch.charCodeAt(0);
                    } else {
                        ch_upper = ch.toUpperCase();
                        ch_lower = ch.toLowerCase();
                        charcode_upper = ch_upper.charCodeAt(0);
                        charcode_lower = ch_lower.charCodeAt(0);
                    }
                    if ((charcode_upper == e.charCode) || (charcode_lower == e.charCode)) {
                    }
                    else
                        e.preventDefault();
                });
            }
            if (cordova.platformId == 'android') {
             /*   $("#text_id2").on('input', function () {
                    var typed_word = document.getElementById("text_id2").value;
                    var ch = typed_word.substr(typed_word.length-1, 1);
                    var ch_upper, ch_lower, charcode_upper, charcode_lower;
                    if ((ch == ",") || (ch == ".") || (ch == " ")) {
                        charcode_upper = charcode_lower = ch.charCodeAt(0);
                    } else {
                        ch_upper = ch.toUpperCase();
                        ch_lower = ch.toLowerCase();
                        charcode_upper = ch_upper.charCodeAt(0);
                        charcode_lower = ch_lower.charCodeAt(0);
                    }
                    if ((ch_upper == current_word[typed_word.length - 1]) || (ch_lower == current_word[typed_word.length - 1])) {
                        
                    }
                    else {
                        document.getElementById("text_id2").value = typed_word.substr(0, typed_word.length - 1);
                    }
                    highlightKeyExpert();
                });*/
                $('#editor2').keyup(function (e) {
                    if (e.keyCode == 8) {
                        var typed_word = document.getElementById("text_id2").value;
                        var previousspanid = "span_id" + (typed_word.length);
                        $('#' + previousspanid).removeClass("span_highlight").addClass("span_class");

                    } else {
                        var typed_word = document.getElementById("text_id2").value;
                        var ch = typed_word.substr(typed_word.length - 1, 1);
                        var ch_upper, ch_lower, charcode_upper, charcode_lower;
                        if ((ch == ",") || (ch == ".") || (ch == " ")) {
                            charcode_upper = charcode_lower = ch.charCodeAt(0);
                        } else {
                            ch_upper = ch.toUpperCase();
                            ch_lower = ch.toLowerCase();
                            charcode_upper = ch_upper.charCodeAt(0);
                            charcode_lower = ch_lower.charCodeAt(0);
                        }
                        if ((ch_upper == current_word[typed_word.length - 1]) || (ch_lower == current_word[typed_word.length - 1])) {

                        }
                        else {
                            document.getElementById("text_id2").value = typed_word.substr(0, typed_word.length - 1);
                        }
                    }
                    highlightKeyExpert();
                });
            }
            /*Handle the speaker button*/
            $("#volume_id").click(function () {
                $(".volume_btn").toggleClass("mute_btn");
                document.getElementById("text_id2").focus();
                Keyboard.show();

            });

            /*Handle refresh button*/
            document.getElementById("refresh_id").addEventListener('click', function () {
                document.getElementById("text_id2").value = null;
                current_word = document.getElementById("word_id").textContent;
                if (localStorage.getItem("level") == "Expert") {
                    document.getElementById("text_id2").focus();
                    Keyboard.show();
                    selectWord();
                    highlightKeyExpert();
                    return;
                }
            });
        }

/**********Common handling for all the back buttons**********/
        if (document.getElementById("back_btn_id") != null) {
            document.getElementById("back_btn_id").addEventListener('click', function () {
                if (document.getElementById("selectlist") != null) {
                    if(!checkAtleastOnelistSelected()) return;
                }
                pageTransition('right',window.history.back());
            });
        }

/**********Handle the index page**********/
        if (document.getElementById("index") != null) {
            loadAudio("res/audio/hello.wav");
            loadAudio("res/audio/typing.wav");
            loadAudio("res/audio/tutor.wav");
            var order = localStorage.getItem('order');
            if (order == null) {
                localStorage.setItem('order', 'default');
            }
            var listoptions = localStorage.getItem("wordlistoptions");
            if (listoptions == null|| listoptions=='') {
                listoptions = '1';
                localStorage.setItem("wordlistoptions", listoptions);

            } 

            document.getElementById("fingertap").addEventListener('touchend', function (e) {
                if (document.getElementById("fingertap").style.display == "inline") {
                    var touchpoints = e.touches;
                    if (touchpoints.length == 1) {
                        pageTransition('left', 'parentzone.html');
                    } else {
                        document.getElementById("fingertap").style.display = "none";
                        return;
                    }
                }
            });
            
            document.getElementById("parent_id").addEventListener('touchend', function (e) {
                var touchlist = e.touches;
                if (touchlist.length == 1) {
                    pageTransition('left', 'parentzone.html');
                } else {
                    document.getElementById("fingertap").style.display = "inline";
                }
            });
            document.getElementById("start_id").addEventListener("touchend", function () {
                pageTransition('left', 'level.html');
            });
        }

/**********Handle the Level Page**********/
        if (document.getElementById("level") != null) {
            document.getElementById("level1_btn_id").addEventListener("touchend", function () {
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem("level", "beginner");
                }
                pageTransition('left', 'editor.html');
            });
            document.getElementById("level2_btn_id").addEventListener("touchend", function () {
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem("level", "Advanced");
                }
                pageTransition('left', 'editor.html');
            });
            document.getElementById("level3_btn_id").addEventListener("touchend", function () {
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem("level", "Expert");
                }
                pageTransition('left', 'editor2.html');
            });
        }
        
/**********Handle the Parentzone/Settings page**********/
        if (document.getElementById("parentzone") != null) {
        document.getElementById("help_btn_id").addEventListener('touchend', function () {
            pageTransition('left', 'help.html');
        });
        document.getElementById("settings_id1").addEventListener('touchend', function () {
            pageTransition('left', 'wordlist.html');
        });
        document.getElementById("settings_id2").addEventListener('touchend', function () {
            pageTransition("left","selectlist.html");
        });
        document.getElementById("settings_id3").addEventListener('touchend', function () {
            pageTransition("left", "orderlist.html");
        });
        document.getElementById("settings_id4").addEventListener('touchend', function () {
            pageTransition("left", "recording.html");
        });
        document.getElementById("settings_id5").addEventListener('touchend', function () {
            pageTransition("left", "selectkeyboard.html");
        });
    }

/**********Handle the View-Edit Word list page**********/
    if (document.getElementById('wordlist') != null) {
        document.getElementById("wordlist_id1").addEventListener('touchend', function () {
            localStorage.setItem("dolchlevel", "preprimer");
            pageTransition("left", "dolchlist.html");
        });
        document.getElementById("wordlist_id2").addEventListener('touchend', function () {
            localStorage.setItem("dolchlevel", "primer");
            pageTransition('left', "dolchlist.html");
        });
        document.getElementById("wordlist_id3").addEventListener('touchend', function () {
            localStorage.setItem("dolchlevel", "first");
            pageTransition('left', "dolchlist.html");
        });
        document.getElementById("wordlist_id4").addEventListener('touchend', function () {
            localStorage.setItem("dolchlevel", "second");
            pageTransition('left', "dolchlist.html");
        });
        document.getElementById("wordlist_id5").addEventListener('touchend', function () {
            localStorage.setItem("dolchlevel", "third");
            pageTransition('left', "dolchlist.html");
        });
        document.getElementById("wordlist_id6").addEventListener('touchend', function () {
            localStorage.setItem("dolchlevel", "nouns");
            pageTransition('left', "dolchlist.html");
        });
        document.getElementById("wordlist_id7").addEventListener('touchend', function () {
            localStorage.setItem("dolchlevel", "custom");
            pageTransition('left','editlist.html');
        });
    }

/**********Handle the dolchlist page**********/
    if (document.getElementById("dolchlist") != null) {
        createDolchWordList();
    }

/**********Handle the Edit Custom List page**********/
    if (document.getElementById("editlist") != null) {
        /*Handle initial page load and dynamically create the list of words after reading from file*/
        readWordFile();
        var filereadinterval = setInterval(function () {
            if (filereadcomplete) {
                createListToEdit();
                clearInterval(filereadinterval);
            }
        }, 300);

        /*Handle the Add button*/
        document.getElementById("div_edit").addEventListener('touchstart', function (event) { });
        document.getElementById("add_id").addEventListener('click', function () {
            document.getElementById("add_word_div").style.display = "inline";
            document.getElementById("new_word_id").disabled = false;
            document.getElementById("new_word_id").focus();
        });

        /*Handle the Delete/Done button*/
        document.getElementById("delete_id").addEventListener('click', function () {
            if (document.getElementById("delete_id").textContent == "Delete") {
                document.getElementById("delete_id").textContent = "Done";
                var node_list = document.getElementsByTagName('input');
                for (var i = 0; i < node_list.length; i++) {
                    var node = node_list[i];
                    if (node.getAttribute('type') == 'checkbox') {
                        node.style.display = "inline-block";
                        node.disabled = false;
                    }
                }
            } else {
                
                deleteWord();
                var node_list = document.getElementsByTagName('input');
                for (var i = 0; i < node_list.length; i++) {
                    var node = node_list[i];
                    if (node.getAttribute('type') == 'checkbox') {
                        node.style.display = "none";
                        node.disabled = true;
                    }
                }
                document.getElementById("delete_id").textContent = "Delete";
            }
        });

/*Handle Save button for adding new word*/            
        document.getElementById("save_id").addEventListener('click', function () {
            addNewWord();
        });
        document.getElementById("cancel_id").addEventListener('click', function () {
            document.getElementById("new_word_id").value = null;
            document.getElementById("add_word_div").style.display = "none";

        });
            
    }

/**********Handle the select word list page**********/
    if (document.getElementById("selectlist") != null) {
        document.getElementById("selectlist_ul").style.listStyle = "none";

        /*Add the list item for Custom word list only if the custom list file is not empty*/
        var basepath = cordova.file.documentsDirectory;
        
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if (isAndroid)
            basepath = cordova.file.dataDirectory;

        window.resolveLocalFileSystemURL(basepath + "res/wordlist.txt", function (dir) {
            dir.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    JSON.stringify(e);
                    var wordlist = this.result;
                    if (wordlist == '') {
                        var list = document.getElementById("selectlist_ul");
                        var listitems = list.getElementsByTagName("li");
                        list.removeChild(listitems[listitems.length - 1]);
                        var options = localStorage.getItem("wordlistoptions");
                        var index = options.indexOf('7');
                        if (index != -1) options = options.slice(0, index) + options.slice(index + 1);

                        localStorage.setItem("wordlistoptions", options);
                    }
                }
                reader.readAsText(file);
            }, function (e) { JSON.stringify(e);});
        });
        
        /*This code is to overcome the issue of ghost click. Initially disable checkboxes on page load and enable only after 300ms*/
        var cbox = document.getElementsByName("select_word_list");
        var i = 0;
        while (i < cbox.length) {
            document.getElementById(cbox[i].id).checked = false;
            document.getElementById(cbox[i].id).disabled = true;
            i++;
        }
        setTimeout(function () {
            var cbox = document.getElementsByName("select_word_list");
            var i = 0;
            while (i < cbox.length) {
                document.getElementById(cbox[i].id).disabled = false;
                i++;
            }

        }, 500);
        
        var listoptions = localStorage.getItem("wordlistoptions");
        if (listoptions == null) {
            document.getElementById("preprimer").checked = "checked";
            listoptions = '1';
        } else {
            for (var i = 0; i < listoptions.length; i++) {
                var listid = getWordListCheckboxid(listoptions[i]);
                document.getElementById(listid).checked = "checked";
            }
            
        }
        localStorage.setItem("wordlistoptions", listoptions);

        var checkboxes = document.getElementsByName("select_word_list");
        var j=0;
        while (j < checkboxes.length) {
            document.getElementById(checkboxes[j].id).addEventListener('click', function () {
                addcheckboxeventlistener(this.id)
            });
            j++;
        }
    }

/**********Handle the orderlist page**********/
    if (document.getElementById("orderlist") != null) {
        /*This code is to overcome the issue of ghost click. Initially disable radio buttons on page load and enable only after 300ms*/
        var radiobtn = document.getElementsByName("order");
        var j = 0;
        while (j < radiobtn.length) {
            document.getElementById(radiobtn[j].id).disabled = true;
            j++;
        }
        setTimeout(function () {
            var rbtn = document.getElementsByName("order");
            var i = 0;
            while (i < rbtn.length) {
                document.getElementById(rbtn[i].id).disabled = false;
                i++;
            }

        }, 500);

        var previousvalue = localStorage.getItem("order");
        if ((previousvalue == null)||(previousvalue=="")) {
            previousvalue = "default";
            localStorage.setItem("order", previousvalue);
        }
        previousvalue = previousvalue + "_id";
        document.getElementById(previousvalue).checked = "checked";
        j=0;
        while (j < radiobtn.length) {
            document.getElementById(radiobtn[j].id).addEventListener('click', function () {
                var order = this.value;
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem("order", order);
                }
            });
            
            j++;
        }
    }

/**********Handle the Record Custom Words page**********/
    if (document.getElementById("recording") != null) {
        /*Handle initial page load and dynamically create the list of words after reading from file*/
        readWordFile();
        var filereadinterval = setInterval(function () {
            if (filereadcomplete) {
                createListToRecord();
                clearInterval(filereadinterval);
            }
        }, 300);

        document.getElementById("record_btn_id").addEventListener('click', function () {
            navigator.device.capture.captureAudio(captureSuccess, captureError, { limit: 1 });
        });
        document.getElementById("play_btn_id").addEventListener('click', function () {
            var filename = null;
            filename = getCheckedRadioButton();
            filename = "res/audio/" + filename;
            console.log(filename);
            if (filename != null) {
                var basepath = cordova.file.documentsDirectory;
                var ua = navigator.userAgent.toLowerCase();
                var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
                if (isAndroid)
                    basepath = cordova.file.dataDirectory;

                window.resolveLocalFileSystemURL(basepath + filename, function (dir) {
                    var media = new Media(dir.toInternalURL(), function () {
                        media.release();
                    }, function (e) {
                        JSON.stringify(e);
                    });
                    media.play();
                }, function (e) {
                    document.getElementById("playalert").style.display = "inline";
                    document.getElementById("playalert").style.zIndex = 3;
                    document.getElementById("play_ok_btn").addEventListener("click", function () {
                        document.getElementById("playalert").style.display = "none";
                    });
                });
            }
        });
        document.getElementById("del_record_btn_id").addEventListener('click', function () {
            var filename = getCheckedRadioButton();
            deleteRecording(filename);
        });

    }

/**********Handle Select Keyboard Page**********/
    if (document.getElementById("selectkeyboardlist") != null) {
        /*This code is to overcome the issue of ghost click. Initially disable radio buttons on page load and enable only after 300ms*/
        var radiobtn = document.getElementsByName("keyboardtype");
        var j = 0;
        while (j < radiobtn.length) {
            document.getElementById(radiobtn[j].id).disabled = true;
            j++;
        }
        setTimeout(function () {
            var rbtn = document.getElementsByName("keyboardtype");
            var i = 0;
            while (i < rbtn.length) {
                document.getElementById(rbtn[i].id).disabled = false;
                i++;
            }

        }, 500);

        var previousvalue = localStorage.getItem("keyboardtype");
        if ((previousvalue == null) || (previousvalue == "")) {
            previousvalue = "standard";
            localStorage.setItem("keyboardtype", previousvalue);
        }
        previousvalue = previousvalue + "_id";
        document.getElementById(previousvalue).checked = "checked";
        j = 0;
        while (j < radiobtn.length) {
            document.getElementById(radiobtn[j].id).addEventListener('click', function () {
                var type = this.value;
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem("keyboardtype", type);
                }
            });

            j++;
        }
    }
    }

    /*function to create standard virtual keyboard*/
    function createKeyboard() {
        var button;

        /*Keyboard line 1*/
        for (var i = 0; i < line1.length; i++) {
            button = document.createElement("button");
            button.className = "keyboard_btn";
            button.id = button.textContent = line1[i].toLocaleLowerCase();
            button.disabled = true;
            document.getElementById("keyboard_ln1_id").appendChild(button);
        }
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "back";
        button.textContent = '<';
        button.disabled = false;
        document.getElementById("keyboard_ln1_id").appendChild(button);
        

        /*Keyboard line 2*/
        for (var i = 0; i < line2.length; i++) {
            button = document.createElement("button");
            button.className = "keyboard_btn";
            button.id = button.textContent = line2[i].toLocaleLowerCase();
            button.disabled = true;
            document.getElementById("keyboard_ln2_id").appendChild(button);
        }
        

        /*Keyboard line 3*/
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "caps";
        button.textContent = '||';
        button.disabled = false;
        document.getElementById("keyboard_ln3_id").appendChild(button);

        for (var i = 0; i < line3.length; i++) {
            button = document.createElement("button");
            button.className = "keyboard_btn";
            button.id = button.textContent = line3[i].toLocaleLowerCase();
            button.disabled = true;
            document.getElementById("keyboard_ln3_id").appendChild(button);
        }
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "comma";
        button.textContent = ",";
        button.disabled = true;
        document.getElementById("keyboard_ln3_id").appendChild(button);
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "dot";
        button.textContent = '.';
        button.disabled = true;
        document.getElementById("keyboard_ln3_id").appendChild(button);


        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "caps1";
        button.textContent = '||';
        button.disabled = false;
        document.getElementById("keyboard_ln3_id").appendChild(button);

        /*Keyboard line 4*/
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "spacebar";
        button.textContent = "Space";
        button.disabled = true;
        document.getElementById("keyboard_ln4_id").appendChild(button);
    }

    /*function to create big virtual keyboard*/
    function createKeyboardBig() {
        var button;

        /*Keyboard line 1*/
        for (var i = 0; i < line1.length; i++) {
            button = document.createElement("button");
            button.className = "keyboard_btn";
            button.id = button.textContent = line1[i].toLocaleLowerCase();
            button.disabled = true;
            document.getElementById("keyboard_ln1_id").appendChild(button);
        }

        /*Keyboard line 2*/
        for (var i = 0; i < line2.length; i++) {
            button = document.createElement("button");
            button.className = "keyboard_btn";
            button.id = button.textContent = line2[i].toLocaleLowerCase();
            button.disabled = true;
            document.getElementById("keyboard_ln2_id").appendChild(button);
        }

        /*keyboard line 3*/
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "caps";
        button.textContent = '||';
        button.disabled = false;
        document.getElementById("keyboard_ln3_id").appendChild(button);

        for (var i = 0; i < line3.length; i++) {
            button = document.createElement("button");
            button.className = "keyboard_btn";
            button.id = button.textContent = line3[i].toLocaleLowerCase();
            button.disabled = true;
            document.getElementById("keyboard_ln3_id").appendChild(button);
        }

        
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "back";
        button.textContent = '<';
        button.disabled = false;
        document.getElementById("keyboard_ln3_id").appendChild(button);

        /*Keyboard line 4*/
        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "comma";
        button.textContent = ",";
        button.disabled = true;
        document.getElementById("keyboard_ln4_id").appendChild(button);

        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "spacebar";
        button.textContent = "Space";
        button.disabled = true;
        document.getElementById("keyboard_ln4_id").appendChild(button);

        button = document.createElement("button");
        button.className = "keyboard_btn";
        button.id = "dot";
        button.textContent = '.';
        button.disabled = true;
         document.getElementById("keyboard_ln4_id").appendChild(button);

    }

/*function to add click event listeners to all keyboard keys*/    
    function addKeyeventListeners() {
        var start = 97;
        var end = 122;

        while (start <= end) {

            var id = String.fromCharCode(start);
            document.getElementById(id).addEventListener("touchend", function () { onClick(this.id) });
            start += 1;
        }
        document.getElementById('comma').addEventListener("touchend", function () { onClick(this.id) });
        document.getElementById('spacebar').addEventListener("touchend", function () { onClick(this.id) });
        document.getElementById('dot').addEventListener("touchend", function () { onClick(this.id) });
        document.getElementById('caps').addEventListener("touchend", function () { toUpper(this.id) });
        if(document.getElementById("caps1") != null)
          document.getElementById('caps1').addEventListener("touchend", function () { toUpper(this.id) });
        document.getElementById('back').addEventListener("touchend", function () { backspace(this.id) });
    }

/*function to handle the click event on virtual keyboard keys*/
    function onClick(id) {
        if (document.getElementById(id).disabled == true)
            return;
        clearInterval(timer);
       
        if (id == "spacebar")
            document.getElementById("text_id").value += " ";
        else
            document.getElementById("text_id").value += document.getElementById(id).textContent;
        if (localStorage.getItem("level") == "beginner")
            highlightKey();
        else if ((localStorage.getItem("level") == "Advanced")) {
            highlightKeysAdvanced();
        }
    }

/*function to handle caps button. Toggle the keyboard text to upper and lower case based on caps lock pressed*/
    function toUpper(id) {
        var start = 97;
        var end = 122;
        if (capsOn == false) {
            while (start <= end) {
                document.getElementById(String.fromCharCode(start)).textContent = (document.getElementById(String.fromCharCode(start)).textContent).toUpperCase();
                start++;
            }
            capsOn = true;
        } else {
            while (start <= end) {
                document.getElementById(String.fromCharCode(start)).textContent = (document.getElementById(String.fromCharCode(start)).textContent).toLowerCase();
                start++;
            }
            capsOn = false;
        }
    }

/*function to handle backspace key*/
    function backspace(id) {
        var typed_word = document.getElementById("text_id").value;
        if (typed_word == "") return;

        var previousspanid = "span_id" + (typed_word.length);
        $('#' + previousspanid).removeClass("span_highlight").addClass("span_class");
        var spanid = "span_id" + (typed_word.length - 1);
        $('#' + spanid).removeClass("span_class").addClass("span_highlight");

        document.getElementById("text_id").value = typed_word.substr(0, typed_word.length - 1);
        
        var nextkey = typed_word.charAt(typed_word.length - 1);
        var nextkeyid = getKeyId(nextkey);
        clearInterval(timer);
        if ((nextkeyid != "comma") && (nextkeyid != "dot") && (nextkeyid != "spacebar")) {
            playMedia("res/audio/" + nextkeyid + ".wav");
            timer = setInterval(function () {
                playMedia("res/audio/" + nextkeyid + ".wav");
            }, 10000);
        }
        if (localStorage.getItem("level") == "beginner") {
            if (typed_word.toLowerCase() != document.getElementById("word_id").textContent.toLowerCase()) {
                var previouskey = document.getElementById("word_id").textContent.charAt(typed_word.length);
                var previouskeyid = getKeyId(previouskey);
                document.getElementById(previouskeyid).style.backgroundColor = "lightgray";
                document.getElementById(previouskeyid).disabled = true;
            }
            document.getElementById(nextkeyid).style.backgroundColor = "rgb(257,251,16)";
            document.getElementById(nextkeyid).disabled = false;
        }
    }

/*function to load audio files during initial page load, if they are not already present in documents directory*/
    function loadAudio(filename) {
        var basepath = cordova.file.documentsDirectory;
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if(isAndroid)
            basepath = cordova.file.dataDirectory;
        window.resolveLocalFileSystemURL(basepath + filename, function (dir) {
        }, function () {
            var fileTransfer = new FileTransfer();
            var url = cordova.file.applicationDirectory + ("www/" + filename);
            fileTransfer.download(url, basepath + filename,
                function (entry) {
                },
                function (err) {
                    console.dir(err);
                })
        });
    }

/*function to download the custom words file in document directory, if not already present, and read the file on initial page load*/
    function readWordFile() {
        filereadcomplete = false;
        var basepath = cordova.file.documentsDirectory;
        var basepath = cordova.file.documentsDirectory;
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if (isAndroid)
            basepath = cordova.file.dataDirectory;

        var filename = "res/wordlist.txt";
        window.resolveLocalFileSystemURL(basepath + filename, function (dir) {
            dir.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    var wordlist = this.result;
                    createWordArray(wordlist);
                    filereadcomplete = true;
                }
                reader.readAsText(file);
            });
        }, function () {
            var fileTransfer = new FileTransfer();
            var url = cordova.file.applicationDirectory + "www/res/wordlist.txt";
            fileTransfer.download(url, basepath + filename,
                function (entry) {
                    entry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (e) {
                            var wordlist = this.result;
                            createWordArray(wordlist);
                            filereadcomplete = true;
                        }
                        reader.readAsText(file);
                    });
                },
                function (err) {
                    console.dir(err);
                })
        });
    }

/*function to create/update global array word_array to be used for selecting words for all levels*/
    function createWordArray(tempstr) {
        var i = window.word_array.length;
        while (tempstr) {
            var index = tempstr.indexOf('#');
            if (index == -1) {
                window.word_array[i] = tempstr;
                tempstr = null;
            } else {
                window.word_array[i] = tempstr.substr(0, index);
                tempstr = tempstr.substr(tempstr.indexOf('#') + 1, tempstr.length - 1);
            }
            i++;
        }
    }

/*function to sort the word_array if the display order selected by user is alphabetical*/
    function sortWordArray() {
        window.word_array.sort(function (a, b) {
            if (a.toLowerCase() < b.toLowerCase())
                return -1;
            else if (a.toLowerCase() > b.toLowerCase())
                return 1;
            return 0;
        });
    }

/*function to select the next word to be displayed*/
    function selectWord() {
        var index;
        if (localStorage.getItem("order") == "random") {
            index = Math.floor(Math.random() * window.word_array.length);
        }
        else {
            index = alpha_order_index;
            alpha_order_index++;
            if (alpha_order_index == window.word_array.length) alpha_order_index = 0;
        }
        current_word = window.word_array[index];
        document.getElementById("word_id").textContent = current_word;
        constructWordSpan();
    }

/*function to wrap each alphabet of current word displayed in a span. This is done for highlighting individual letter*/
    function constructWordSpan() {
        $('#word_id').each(function (index) {
            var ch = $(this).text();
            var characters = $(this).text().split("");
            $(this).empty();
            var str = "";
            for (var i = 0; i < characters.length; i++) {
                var spanid = "span_id" + i;
                var spanclass = "span_class";
                str = str + '<span class =' + spanclass + ' id=' + spanid + '>' + characters[i] + '</span>'
            }
            $(this).append(str);
        });

    }

/*function used by beginner level to highlight the next word to be typed and display result if word complete*/
    function highlightKey() {

        var typed_word = document.getElementById("text_id").value;
        if (typed_word.length != 0) {
            var previouskey = current_word.charAt(typed_word.length - 1);
            var previouskeyid = getKeyId(previouskey);
            document.getElementById(previouskeyid).style.backgroundColor = "lightgray";
            document.getElementById(previouskeyid).disabled = true;
            var previousspanid = "span_id" + (typed_word.length - 1);
            $('#' + previousspanid).removeClass("span_highlight").addClass("span_class");
        }
        if (typed_word.toLowerCase() == current_word.toLowerCase()) {
            var wordaudio = getAudioFileName(current_word);
            playMedia("res/audio/" + wordaudio + ".wav");

            setTimeout(function () {
                $('#firstdiv').addClass('overlay');
                document.getElementById("welldone_id").style.display = "inline";
                document.getElementById("refresh_id").style.display = "none";
            }, 1000);
            
            setTimeout(function () {
                $('#firstdiv').removeClass('overlay');
                document.getElementById("welldone_id").style.display = "none";
                document.getElementById("refresh_id").style.display = "inline";
                document.getElementById("text_id").value = null;
                selectWord();
                highlightKey();
                return;
            }, 3000);
            return;
        }

        if (typed_word.length == 0) {
            var wordaudio = getAudioFileName(current_word);
            playMedia("res/audio/" + wordaudio + ".wav");
            document.getElementById("refresh_id").style.display = "none";
            setTimeout(function () {
                var ch = current_word.substr(typed_word.length, 1);
                var id = getKeyId(ch);
                document.getElementById(id).style.backgroundColor = "rgb(257,251,16)";
                document.getElementById(id).disabled = false;
                var spanid = "span_id" + typed_word.length;
                $('#' + spanid).removeClass("span_class").addClass("span_highlight");
                document.getElementById("refresh_id").style.display = "inline";

                if ((id != "comma") && (id != "dot") && (id != "spacebar")) {
                    playMedia("res/audio/_" + id + ".wav");
                    timer = setInterval(function () {
                        playMedia("res/audio/_" + id + ".wav");
                    }, 10000);
                }
            }, 2000);
        } else {
            var ch = current_word.substr(typed_word.length, 1);
            var id = getKeyId(ch);
            document.getElementById(id).style.backgroundColor = "rgb(257,251,16)";
            document.getElementById(id).disabled = false;
            var spanid = "span_id" + typed_word.length;
            $('#' + spanid).removeClass("span_class").addClass("span_highlight");

            if ((id != "comma") && (id != "dot") && (id != "spacebar")) {
                playMedia("res/audio/_" + id + ".wav");
                timer = setInterval(function () {
                    playMedia("res/audio/_" + id + ".wav");
                    
                }, 10000);
            }
            
        }
    }

/*common function to get keyid corresponding to key textcontext*/
    function getKeyId(key) {
        var keyid;
        if (key == ",") keyid = "comma";
        else if (key == " ") keyid = "spacebar";
        else if (key == ".") keyid = "dot";
        else keyid = key.toLowerCase();
        return keyid;
    }

/*function to handle the next keystroke in advanced level*/
    function highlightKeysAdvanced() {
        var typed_word = document.getElementById("text_id").value;
        var spanid, ch, id;
        if (typed_word.length == 0) {
            
            var wordaudio = getAudioFileName(current_word);
            playMedia("res/audio/" + wordaudio + ".wav");
            document.getElementById("refresh_id").style.display = "none";
            setTimeout(function () {
                for (var i = 0; i < current_word.length; i++) {
                    ch = current_word[i];
                    id = getKeyId(ch);
                    document.getElementById(id).style.backgroundColor = "rgb(257,251,16)";
                    document.getElementById(id).disabled = false;
                }
                $('#span_id0').removeClass("span_class").addClass("span_highlight");
                document.getElementById("refresh_id").style.display = "inline";
                ch = current_word.substr(0, 1);
                id = getKeyId(ch);
                if ((id != "comma") && (id != "dot") && (id != "spacebar")) {
                    playMedia("res/audio/_" + id + ".wav");
                    timer = setInterval(function () {
                        playMedia("res/audio/_" + id + ".wav");
                    }, 10000);
                }
            }, 2000);
            
            return;
        } else {
            spanid = "span_id" + (typed_word.length - 1);
            $('#' + spanid).removeClass("span_highlight").addClass("span_class");
        }
        if (typed_word.toLowerCase() == document.getElementById("word_id").textContent.toLowerCase()) {
            for (var i = 0; i < document.getElementById("word_id").textContent.length; i++) {
                var ch = getKeyId(document.getElementById("word_id").textContent[i]);
                document.getElementById(ch).style.backgroundColor = "lightgray";
                document.getElementById(ch).disabled = true;
            }
            var wordaudio = getAudioFileName(current_word);
            playMedia("res/audio/" + wordaudio + ".wav");

            setTimeout(function () {
                $('#firstdiv').addClass('overlay');
                document.getElementById("welldone_id").style.display = "inline";
                document.getElementById("refresh_id").style.display = "none";

            }, 1000);
            // playMedia("res/audio/fanfare.wav");
            setTimeout(function () {
                $('#firstdiv').removeClass('overlay');
                document.getElementById("welldone_id").style.display = "none";
                document.getElementById("refresh_id").style.display = "inline";
                document.getElementById("text_id").value = null;
                numberofattempts = 0;
                selectWord();
                highlightKeysAdvanced();
                return;
            }, 3000);
            return;
        } else if ((typed_word.length == document.getElementById("word_id").textContent.length) && (typed_word.toLowerCase() != document.getElementById("word_id").textContent.toLowerCase())) {
            numberofattempts++;
            for (var i = 0; i < document.getElementById("word_id").textContent.length; i++) {
                var ch = getKeyId(document.getElementById("word_id").textContent[i]);
                document.getElementById(ch).style.backgroundColor = "lightgray";
                document.getElementById(ch).disabled = true;
            }
            var id;
            
            $('#firstdiv').addClass('overlay');
              document.getElementById("correct_word_id").textContent = current_word;
            if (numberofattempts < 2)
                document.getElementById("incorrect_id").style.display = "inline";
            else {
                document.getElementById("correct_word_div").style.display = "inline";
                playMedia("res/audio/" + current_word.toLowerCase() + ".wav");
            }
            
            document.getElementById("refresh_id").style.display = "none";

            setTimeout(function () {
                $('#firstdiv').removeClass('overlay');
                if (numberofattempts < 2)
                    document.getElementById("incorrect_id").style.display = "none";
                else {
                    document.getElementById("correct_word_div").style.display = "none";
                    selectWord();
                    numberofattempts = 0;
                }
                document.getElementById("refresh_id").style.display = "inline";
                document.getElementById("text_id").value = null;
                highlightKeysAdvanced();
                return;
            }, 2000);
            return;
        }
        else if (typed_word.length < document.getElementById("word_id").textContent.length) {
            spanid = "span_id" + (typed_word.length);
            $('#' + spanid).removeClass("span_class").addClass("span_highlight");
            ch = current_word.substr(typed_word.length, 1);
            id = getKeyId(ch);
            if ((id != "comma") && (id != "dot") && (id != "spacebar")) {
                playMedia("res/audio/_" + id + ".wav");
                timer = setInterval(function () {
                    playMedia("res/audio/_" + id + ".wav");
                }, 10000);
            }
            return;
        }
    }

/*function to handle the next keystroke in expert level*/
    function highlightKeyExpert() {
        var typed_word = document.getElementById("text_id2").value;
        var current_word = document.getElementById("word_id").textContent;
        if (typed_word.length != 0) {
            var previousspanid = "span_id" + (typed_word.length - 1);
            $('#' + previousspanid).removeClass("span_highlight").addClass("span_class");
        }
        if (typed_word.toLowerCase() == current_word.toLowerCase()) {
            var wordaudio = getAudioFileName(current_word);
            playMedia("res/audio/" + wordaudio + ".wav");

            setTimeout(function () {
                Keyboard.hide();
                $('#firstdiv').addClass('overlay');
                document.getElementById("welldone_id").style.display = "inline";
                document.getElementById("refresh_id").style.display = "none";

            }, 1000);
            // playMedia("res/audio/fanfare.wav");
            
            setTimeout(function () {
                $('#firstdiv').removeClass('overlay');
                document.getElementById("welldone_id").style.display = "none";
                document.getElementById("refresh_id").style.display = "inline";
                document.getElementById("text_id2").value = null;
                document.getElementById("text_id2").focus();
                Keyboard.show();
                selectWord();
                highlightKeyExpert();
                return;
            }, 3000);
            return;
        }
        
        var spanid = "span_id" + typed_word.length;
        $('#' + spanid).removeClass("span_class").addClass("span_highlight");
        var ch = current_word.substr(typed_word.length, 1);
        var id = getKeyId(ch);
        if (typed_word.length == 0) {
            var wordaudio = getAudioFileName(current_word);
            playMedia("res/audio/" + wordaudio + ".wav");

            setTimeout(function () {
                if ((id != "comma") && (id != "dot") && (id != "spacebar")) {
                    playMedia("res/audio/_" + id + ".wav");

                }
            }, 2000);
        } else {
            if ((id != "comma") && (id != "dot") && (id != "spacebar")) {
                playMedia("res/audio/_" + id + ".wav");

            }
        }
    }

/*common function to play audio file*/
    function playMedia(filename) {
        var audiourl = cordova.file.documentsDirectory + filename;
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if (isAndroid)
            audiourl = cordova.file.dataDirectory+ filename;

        window.resolveLocalFileSystemURL(audiourl, function (dir) {
            var media = new Media(dir.toInternalURL(), function () {
                media.release();
            }, function (e) {
                JSON.stringify(e);
            });
            media.play();
            if(document.getElementById("volume_id").className == "volume_btn mute_btn")
                media.setVolume('0.0');
        }, function (e) { JSON.stringify(e); });
    }

/*function to add new word in the list on custom word list page and write the new word in file */
    function addNewWord() {
        if (document.getElementById("new_word_id").value == "") {
            return;
        }
        var textitem = document.getElementById("new_word_id").value;
        for (var j = 0; j < textitem.length; j++) {
            var code = textitem.charCodeAt(j);
            if (((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122)) || (code == 46) || (code == 32) || (code == 44)) continue;
            else {
                $('#firstdiv').addClass('overlay');
                document.getElementById("delete_id").disabled = true;
                document.getElementById("add_word_div").style.display = "none";
                document.getElementById("addalert").style.display = "inline";
                document.getElementById("addalert").style.zIndex = 3;
                document.getElementById("add_ok_btn").addEventListener("click", function () {
                    document.getElementById("addalert").style.display = "none";
                    $('#firstdiv').removeClass('overlay');
                    document.getElementById("delete_id").disabled = false;
                    document.getElementById("add_word_div").style.display = "inline";
                });
                return;
            }
        }
        var item = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = textitem;
        checkbox.className = 'unchecked';
        checkbox.disabled = true;

        var label = document.createElement('label');
        label.htmlFor = textitem;
        label.appendChild(document.createTextNode(textitem));
        item.appendChild(checkbox);
        item.appendChild(label);
        item.style.marginBottom = "10px";
        var li = document.getElementsByTagName("li");
        if (li.length != 0) {
            var color = li[li.length - 1].style.backgroundColor;
            if (color == "rgb(175, 220, 228)") {
                item.style.backgroundColor = "rgb(151, 187, 194)";
            } else {
                item.style.backgroundColor = "rgb(175, 220, 228)";
            }
        } else {
            item.style.backgroundColor = "rgb(151, 187, 194)";
        }
        document.getElementById("list_id").appendChild(item);
        document.getElementById("add_word_div").style.display = "none";
        document.getElementById("new_word_id").value = null;
        window.word_array.push(textitem);

        var basepath = cordova.file.documentsDirectory;
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if (isAndroid)
            basepath = cordova.file.dataDirectory;

        window.resolveLocalFileSystemURL(basepath + "res", function (dir) {
            dir.getFile("wordlist.txt", { create: true }, function (file) {

                file.createWriter(function (fileWriter) {
                    if (fileWriter.length != 0) {
                        textitem = '#' + textitem;/*if this is not new file append # after last word*/
                    }
                    fileWriter.seek(fileWriter.length);
                    var blob = new Blob([textitem], { type: 'text/plain' });
                    fileWriter.write(blob);
                    
                });
            });
        });
    }

/*function to delete word from custom word list page and remove the word from file*/
    function deleteWord() {
        var list = document.getElementById("list_id");
        var listitems = list.getElementsByTagName("li");
        var i = 0;
        while (listitems[i]) {
            if (listitems[i].firstChild.checked) {
                for (var j = 0; j < window.word_array.length; j++) {
                    if (window.word_array[j] == listitems[i].firstChild.id) {
                        var audiofile = window.word_array[j].toLowerCase() + ".wav";
                        audiofile = audiofile.replace(/ /g, "_");
                        deleteRecording(audiofile);
                        window.word_array.splice(j, 1);
                    }
                }
                list.removeChild(listitems[i]);
            } else {
                i++;
            }
        }
        if (listitems.length == 0) {
            var options = localStorage.getItem('wordlistoptions');
            var index = options.indexOf('7');
            
            if (index != -1) options = options.slice(0, index) + options.slice(index + 1);
            localStorage.setItem("wordlistoptions", options);

        }
        for (i = 0; i < listitems.length; i++) {
            if (i % 2 == 0) {
                listitems[i].style.backgroundColor = "rgb(151, 187, 194)";
            } else {
                listitems[i].style.backgroundColor = "rgb(175, 220, 228)";
            }
        }
        var str = "";
        for (var index = 0; index < window.word_array.length; index++) {
            str = str + window.word_array[index] + '#';
        }
        str = str.substr(0, str.length - 1);
        var basepath = cordova.file.documentsDirectory;
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if (isAndroid)
            basepath = cordova.file.dataDirectory;

        if (str.length == 0) {
            window.resolveLocalFileSystemURL(basepath + "res", function (dir) {
                dir.getFile("wordlist.txt", { create: true }, function (file) {
                    file.createWriter(function (fileWriter) {
                        fileWriter.truncate(0);
                    });
                });
            });
        } else {
            window.resolveLocalFileSystemURL(basepath + "res", function (dir) {
                dir.getFile("wordlist.txt", { create: true }, function (file) {
                    file.createWriter(function (fileWriter) {
                        //   fileWriter.truncate(0);
                        var blob = new Blob([str], { type: 'text/plain' });
                        fileWriter.write(blob);
                    });
                });
            });
        }
    }
  
/*function to dynamically create list of custom words on custom word list page*/
    function createListToEdit() {
        document.getElementById("add_word_div").style.display = "none";
        var list = document.getElementById('list_id');
        for (var i = 0; i < window.word_array.length; i++) {
            var item = document.createElement('li');
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = window.word_array[i];
            checkbox.className = 'unchecked';
            checkbox.disabled = true;

            var label = document.createElement('label');
            label.htmlFor = window.word_array[i];
            label.appendChild(document.createTextNode(window.word_array[i]));
            item.appendChild(checkbox);
            item.appendChild(label);
            item.style.marginBottom = "10px";
            list.appendChild(item);
            if (i % 2 == 0) {
                item.style.backgroundColor = "rgb(151, 187, 194)";
            } else {
                item.style.backgroundColor = "rgb(175, 220, 228)";
            }
            document.getElementById("div_edit").appendChild(list);
        }
    }

/*function to dynamically create list of custom words for recording*/
    function createListToRecord() {
        var list = document.getElementById('list_id');
        for (var i = 0; i < window.word_array.length; i++) {
            var item = document.createElement('li');
            var radiobtn = document.createElement('input');
            radiobtn.type = "radio";
            var id = window.word_array[i].replace(/ /g, "_");
           // id = id.replace(/,/g, "");
           // id = id.replace(/./g, "");
            radiobtn.id = id;
            radiobtn.name = "word";

            var label = document.createElement('label');
            label.htmlFor = window.word_array[i];
            label.appendChild(document.createTextNode(window.word_array[i]));
            item.appendChild(radiobtn);
            item.appendChild(label);
            item.style.marginBottom = "10px";
            list.appendChild(item);
            if (i % 2 == 0) {
                item.style.backgroundColor = "rgb(151, 187, 194)";
            } else {
                item.style.backgroundColor = "rgb(175, 220, 228)";
            }
            document.getElementById("div_edit").appendChild(list);
        }
    }

/*Function to dynamically create the list of Dolch words from array corresponding to the level user has selected to view */
    function createDolchWordList(file) {
        var dolchwordarray = [];
        var dolchlevel = localStorage.getItem('dolchlevel');
        switch (dolchlevel) {
            case "preprimer":
                dolchwordarray = preprimer;
                document.getElementById("dolchlist_heading").textContent = "Dolch List - Preprimer";
                break;
            case "primer":
                dolchwordarray = primer;
                document.getElementById("dolchlist_heading").textContent = "Dolch List - Primer";
                break;
            case "first":
                dolchwordarray = first;
                document.getElementById("dolchlist_heading").textContent = "Dolch List - 1st Grade";
                break;
            case "second":
                dolchwordarray = second;
                document.getElementById("dolchlist_heading").textContent = "Dolch List - 2st Grade";
                break;
            case "third":
                dolchwordarray = third;
                document.getElementById("dolchlist_heading").textContent = "Dolch List - 3rd Grade";
                break;
            case "nouns":
                dolchwordarray = nouns;
                document.getElementById("dolchlist_heading").textContent = "Dolch List - Nouns";
                break;
        }
        var list = document.createElement('ul');
        list.style.listStyle = "none";
        list.id = "list_id";
        for (var i = 0; i < dolchwordarray.length; i++) {
            var item = document.createElement('li');
            item.textContent = dolchwordarray[i];

            item.style.marginBottom = "10px";
            list.appendChild(item);
            if (i % 2 == 0) {
                item.style.backgroundColor = "rgb(151, 187, 194)";
            } else {
                item.style.backgroundColor = "rgb(175, 220, 228)";
            }
            document.getElementById("dolchwords").appendChild(list);
        }
    }

/*function to return the checkbox id based on value of checkboxes on selectlist page*/
    function getWordListCheckboxid(value) {
        switch (value) {
            case '1': return "preprimer";
            case '2': return "primer";
            case '3': return "first";
            case '4': return "second";
            case '5': return "third";
            case '6': return "nouns";
            case '7': return "custom";
        }
    }

/*function to handle the check/uncheck event of word list checkboxes.*/
    function addcheckboxeventlistener(id) {
        var options = localStorage.getItem("wordlistoptions");
        var cbox = document.getElementById(id);
        if (cbox.checked) {
            options = options + cbox.value;
        } else {
            var index = options.indexOf(cbox.value);
            if (index != -1) options = options.slice(0, index) + options.slice(index + 1);
        }
        localStorage.setItem("wordlistoptions", options);

    }

/*common function for native page transition*/
    function pageTransition(direction, destination) {
        window.plugins.nativepagetransitions.slide({
            'direction': direction,
            'duration': 400,
            'androiddelay': 50,
            'href': destination
        });
    }

/*function to add dolch words in word_array based on the lists selected by user*/
    function readAllLists() {
        var filestoread = localStorage.getItem("wordlistoptions");
        if ((filestoread == null)||(filestoread=="")) {
            filestoread = '1';
            localStorage.setItem('wordlistoptions', filestoread);
        }
        for (var i = 0; i < filestoread.length; i++) {
            var file = getWordListCheckboxid(filestoread[i]);
            switch (file) {
                case "preprimer": window.word_array = window.word_array.concat(preprimer);
                    for (var i = 0; i < preprimer.length; i++) {
                        var filename = getAudioFileName(preprimer[i]);
                        var file = "res/audio/" + filename + ".wav";
                        loadAudio(file);
                    }
                    break;
                case "primer": window.word_array = window.word_array.concat(primer);
                    for (var i = 0; i < primer.length; i++) {
                        var filename = getAudioFileName(primer[i]);
                        loadAudio("res/audio/" + filename + ".wav");
                    }
                    break;
                case "first": window.word_array = window.word_array.concat(first);
                    for (var i = 0; i < first.length; i++) {
                        var filename = getAudioFileName(first[i]);
                        loadAudio("res/audio/" + filename + ".wav");
                    }
                    break;
                case "second": window.word_array = window.word_array.concat(second);
                    for (var i = 0; i < second.length; i++) {
                        var filename = getAudioFileName(second[i]);
                        loadAudio("res/audio/" + filename + ".wav");
                    }
                    break;
                case "third": window.word_array = window.word_array.concat(third);
                    for (var i = 0; i < third.length; i++) {
                        var filename = getAudioFileName(third[i]);
                        loadAudio("res/audio/" + filename + ".wav");
                    }
                    break;
                case "nouns": window.word_array = window.word_array.concat(nouns);
                    for (var i = 0; i < nouns.length; i++) {
                        var filename = getAudioFileName(nouns[i]);
                        loadAudio("res/audio/" + filename + ".wav");
                    }
                    break;
                case "custom": readWordFile();
                    break;
            }
        }
    }

/*function to check at least on list is selected. Handle the case where no list is selected and select default*/
    function checkAtleastOnelistSelected() {
        var cbox = document.getElementsByName("select_word_list");
        var i = 0;
        var listselected = false;
        while (i < cbox.length) {
            if (document.getElementById(cbox[i].id).checked)
                listselected = true;
            i++;
        }
        if (listselected == false) {
            document.getElementById("listalert").style.display = "inline";
            document.getElementById("listalert").style.zIndex = 99;
            document.getElementById("list_ok_btn").addEventListener("click", function () {
                document.getElementById("listalert").style.display = "none";
            });

            document.getElementById(cbox[0].id).checked = true;
            localStorage.setItem("wordlistoptions", '1');
        }
        return listselected;
    }

/*function call on successfull recording of audio file*/
    var captureSuccess = function (mediaFiles) {
        var filename = null;
        var i, path, len;
        filename = getCheckedRadioButton();
        filename = "res/audio/" + filename;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].localURL;
            var basepath = cordova.file.documentsDirectory;
            
            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
            if (isAndroid)
                basepath = cordova.file.dataDirectory;

            window.resolveLocalFileSystemURL(basepath + filename, function (dir) {
            }, function () {
                var fileTransfer = new FileTransfer();
                //   var url = cordova.file.applicationDirectory + ("www/" + filename);
                var url = encodeURI(path);
                fileTransfer.download(url, basepath + filename,
                    function (entry) {
                    //    urlToUse = entry.toNativeURL();
                    },
                    function (err) {
                        console.log(JSON.stringify(err));
                    })
            }, function (e) { console.log(JSON.stringify(e));});
        }
    };

/*function call on unsuccessfull recording of audio file*/
    var captureError = function (error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        console.log('Error code: ' + error.code);
    };

/*function to check the radio button selected in recording page and return the corresponding audio file name*/
    function getCheckedRadioButton() {
        var rbtn = document.getElementsByName("word");
        var i = 0;
        while (i < rbtn.length) {
            if (document.getElementById(rbtn[i].id).checked == true) {
                var filename = rbtn[i].id;
                filename = filename.toLowerCase() + ".wav";
                return filename;
            }
            i++;
        }
        return null;
    }

    /*function to delete a previously recorded audio*/
    function deleteRecording(filename) {
        var basepath = cordova.file.documentsDirectory;
        
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if (isAndroid)
            basepath = cordova.file.dataDirectory;

        window.resolveLocalFileSystemURL(basepath + "res/audio", function (dir) {
            dir.getFile(filename, { create: false }, function (file) {
                file.remove(function () { 
                    document.getElementById("deleteconfirm").style.display = "inline";
                    document.getElementById("deleteconfirm").style.zIndex = 3;
                    document.getElementById("delete_ok_btn").addEventListener("click", function () {
                        document.getElementById("deleteconfirm").style.display = "none";
                    });
                });
            }, function () { });
            });
    }

/*common function to get the audio file name corresponding to a word in word_array*/
    function getAudioFileName(word) {
        word = word.toLowerCase();
        var audio = word.replace(/ /g, "_");
        if (audio == 'a')
            audio = '_a';
        if (audio == 'i')
            audio = '_i';
        return audio;
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

} )();
