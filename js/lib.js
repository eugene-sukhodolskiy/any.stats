function delFromHTML(id,page){

    $(page + ' .container [data-param="' + id + '"]').css('opacity','0');

    setTimeout(function(){

        $(page + ' .container [data-param="' + id + '"]').css('display','none');

    },200);
    
}

function studyDelFromDB(id){

    DB.connect.transaction(function(c){

        c.executeSql('DELETE FROM entry WHERE id_study=?',[id],function(c,res){

            c.executeSql('DELETE FROM study WHERE id=?',[id]);

        }, function(c,err){
            
            console.log(err);
            
        });

    });

}

function inpFocus(){

    $('input[type="text"]').focus(function(){
        $(this).css('border-color', 'black');
    });

}

function showInput(t){
    
    $(t).parent().find('.form-wrap.input').css({'width': 'inherit','opacity': 1}).find('input',0).focus();
    
    var cv = $(t).parent().find('.current-value');
    
//    if($(cv).attr('data-edit-flag') == 1){
        
        var val = $(cv).html();
        
       if(typeof val == 'string') $(cv).parent().find('input',0).attr('value',val).prop('selectionStart',val.length);
        
//    }
    
}

function hiddenInput(t){
    
    var fw = $(t).parent();
    
    $(fw).css({'width': '0px','opacity': 0});
    
    var val = $(t).prop('value');
    
    var cval = $(fw).parent().find('.current-value');
    
    if(val != ''){
    
        $(cval).html(val).attr('data-edit-flag',1);
        
        $(fw).parent().removeClass('warning');
        
    }else{
        
        $(cval).html($(cval).attr('data-default'));
        
        $(fw).parent().addClass('warning');
        
    }
    
}

function checkOn(p,t){
    
    if($(t).prop('checked') == true){
        
        $(t).addClass('check');
        
        $(t).parent().parent().find('.current-value').html(p);
        
    }else{
        
        checkOff(p,t);
        
    }
    
}

function checkOff(p,t){

    $(t).removeClass('check');
    
    var cval = $(t).parent().parent().find('.current-value');
    
    $(cval).html($(cval).attr('data-default'));

}

function showNoRes(){
    
    $("#showStats .canvas-container").css('display', 'none');
    
    $("#showStats .average").css('display','none');
    
    $("#showStats .unit").css('display','none');
    
    $('#showStats [name="period"]').css('display','none');
    
    $('#showStats .block-name').css('display','none');
    
    $('#showStats .no-res').css('display','block');
    
}

function hidNoRes(){

    $("#showStats .canvas-container").removeAttr('style');

    $("#showStats .average").removeAttr('style');
    
    $("#showStats .unit").removeAttr('style');

    $('#showStats [name="period"]').removeAttr('style');
    
    $('#showStats .block-name').removeAttr('style');

    $('#showStats .no-res').css('display','none');

}

function showLastOneStat(p,container,id_study){
    
    DB.connect.transaction(function(c){
    
        c.executeSql("SELECT unit FROM study WHERE id=?",[id_study],function(c,res){

            var str = getListEntries(p,res);

            $(container).html(str);

            Funcs.init(container);

            addBlurToFormEntriesList(container);
            
            addMaxLengthToInput(container);
            
            addContextMenuEvent(container);

        });
        
    });
    
}

function getListEntries(p,res){
    
    var str = '';
    
    var count = (p.rows.length < 10) ? p.rows.length : 10;

    for(var i = 0; i < count; i++){

        var time = getFormatDate(p.rows.item(i).timestamp);

        var split = time.split(' ');

        time = split[0] + '<span>' + split[1] + '</span>';

        str += '<div class="form-group one-stat" data-context="show_cmentry">';

        str += '<div class="form-wrap input">';
        
        str += '<span class="counter"></span>';
                    
        str += '<input type="number" data-id="' + p.rows.item(i).id + '" value="' + p.rows.item(i).value + '" placeholder="Value" min="1" step="1" max="999999999">';

        str += '</div>';

        str += '<div class="time">' + time + '</div>';

        str += '<div class="current-value" data-default="' + p.rows.item(i).value + '" data-unit="' + res.rows.item(0).unit + '">' + p.rows.item(i).value + '</div>';

        str += '<div class="del"></div> </div>';

    }
    
    return str;
    
}

function addBlurToFormGroup(container){
    
    container = container || '';
    
    $(container + ' .form-wrap.input input[type="text"]').blur(function(){

        hiddenInput(this);

    });
    
}

function addBlurToFormEntriesList(container){

    container = container || '';

    $(container + ' .form-wrap.input input[type="text"]').blur(function(){

        blurToFormEntriesList(this);

    });
    
    $(container + ' .form-wrap.input input[type="number"]').blur(function(){

        blurToFormEntriesList(this);

    });

}

function blurToFormEntriesList(t){
    
    hiddenInput(t);

    var value = new String($(t).prop('value'));

    var id_entry = new String($(t).attr('data-id'));

    DB.connect.transaction(function(c){

        c.executeSql("UPDATE entry SET value=? WHERE id=?",[value,id_entry], function(c,res){

            reloadGraph();

        },function(c,err){

            console.log(err);

        })

    });
    
}

function getFormatDate(timestamp,format){
    
    format = format || 'Y/M/D h:m';
    
    var date = {};
    
    var d = new Date(parseInt(timestamp));

    date.Y = d.getFullYear();

    date.M = d.getMonth();

    date.M = (date.M < 10) ? '0' + date.M : date.M;

    date.D = d.getDate();

    date.D = (date.D < 10) ? '0' + date.D : date.D;

    date.h = d.getHours();

    date.h = (date.h < 10) ? '0' + date.h : date.h;

    date.m = d.getMinutes();
    
    date.m = (date.m < 10) ? '0' + date.m : date.m;
    
    
    var str = '';
    
    for(var i=0;i<format.length;i++){
        
        if(typeof date[format[i]] != 'undefined'){
            
            str += date[format[i]];
            
        }else{
            
            str += format[i];
            
        }
        
    }
    
    return str;
    
}


function genTimeBtn(arr,container){
    
    var str = '';
    
    var id_study = Nav.currentParam;
    
    for(var i=0;i<arr.start.length;i++){
        
        str += '<button class="timestamp-btn" data-page="entriesList" data-param="' + arr.start[i] + '-' + arr.end[i] + ' - ' + id_study + '">' + arr.format[i] + '</button>'
        
    }
        
    $(container).html(str);
    
    Nav.initPages(container);
    
}

function getFormatFromPeriod(period){
    
    var source = {
        
        '600000': 'Y/M/D h:m',
        
        '3600000': 'Y/M/D h:m',
        
        '86400000': 'Y/M/D',
        
        '2592000000': 'Y/M',
        
        '31536000000': 'Y',
        
    }
    
    return source[new String(period)];
    
}


function addMaxLengthToInput(container){
    
    container = container || '';
    
    $(container + ' input[maxlength]').keydown(function(e){

        var char = e.keyCode;

        if(char == 13){

            $(this).blur();

            return false;

        }

        var counter = $(this).parent().find('span.counter');

        var max = parseInt($(this).attr("maxlength"));

        var val = $(this).prop('value');

        var count = val.length;

        count = (isNaN(count)) ? 0 : count;



        var len = count;

        len = (len > max) ? max : len;

        len = max - len;

        $(counter).html(len + '/' + max);

        if(len <= 5){

            $(counter).css({'opacity': 1});

        } else {

            $(counter).css({'opacity': 0});

        }


    });
    
}

function showLeftMenu(){
    
    $('.popup-background').css('display','block');
    
    setTimeout(function(){
        
        $('.popup-background').css('opacity',1);
        
//        $('.left-menu').css('width','300px');
        $('.left-menu').animate({'width': '300px'},200);
        
    },1);
    
    Nav.addTmpBack(function(){
        
        hidLeftMenu();
        
    });
    
}

function hidLeftMenu(){
    
    Nav.removeTmpBack();
    
    $('.popup-background').css('opacity',0);

//    $('.left-menu').css('width','0');
    
    $('.left-menu').animate({'width': '0px'},200);
    

    setTimeout(function(){
        
        $('.popup-background').css('display','none');

    },200);
    
}

function initLeftMenu(){
    
    DB.connect.transaction(function(c){
        
        c.executeSql('SELECT * FROM groups ORDER BY id ASC',[],function(c,res){
            
            var str = '';
            
            for(var i=0;i<res.rows.length;i++){
                
                str += '<li class="label-style" data-page="study" data-func="hidMenu" data-param="' + res.rows.item(i).id + '">' + res.rows.item(i).name + '</li>';
                
            }
            
            var container = '.left-menu .group-list ul';
            
            $(container).prepend(str);
            
            Nav.initPages(container);
            
            Funcs.init(container);
            
        },function(c,err){
            
            console.log(err);
            
        });
        
    });
    
}

function show_cmdown(t,container){
    
    Nav.addTmpBack(function(){
        
        hid_cmdown();
        
    });
    
    $(container).css('display','block');
    
    var li_height = parseInt($(container).find('li',0).css('height'));
    
    var mtop = $(container).find('li').length * li_height;
    
    $(container).css('height',mtop + 'px');
    
    $('.popup-background').css('display','block');
    
    setTimeout(function(){
        
        $('.popup-background').css('opacity',1);
        
        $(container).css('margin-top',(0 - mtop) + 'px');
        
    },1);
    
}

function hid_cmdown(){
    
    Nav.removeTmpBack();
    
    $('.cm-down').css('margin-top','0px');
    
    $('.popup-background').css('opacity',0);
    
    setTimeout(function(){
        
        $('.cm-down').css('display','none');

        $('.popup-background').css('display','none');
        
    },200);
    
}

function show_cmdelstudy(t){
    
    var id = $(t).attr('data-param');
    
    $('.cm-del-study li',0).attr('data-param',id);
    
    show_cmdown(t,'.cm-del-study');
    
}

function show_cmentry(t){
    
    var inp_id = $(t).find('input',0).attr('data-id');
    
    $('.cm-entry li').attr('data-param',inp_id);
    
    show_cmdown(t,'.cm-entry');
    
}

function addContextMenuEvent(container){
    
    $(container + ' [data-context]').bind('taphold', function(){
        
        console.log('tap');
        
        $(this).attr('data-taphold',1);
        
        var cmname = $(this).attr('data-context');
        
        var cm = {
            
            'show_cmdelstudy': show_cmdelstudy,
            'show_cmentry': show_cmentry
            
        }
        
        cm[cmname](this);
        
    });
    
}


function addLabels(container){
    
    container = container || '#allStudy';
    
    DB.connect.transaction(function(c){
        
        c.executeSql('SELECT id,name FROM groups',[],function(c,res){
            
            for(var i=0;i<res.rows.length;i++){
                
                $(container + ' .nav-btn[data-label-id="' + res.rows.item(i).id + '"] .label-name').html(res.rows.item(i).name);
                
            }
            
        },function(c,err){
            
            console.log(err);
            
        });
        
    });
    
}

function updateLabelList(){
    
    var li = $('.left-menu .group-list li.label-style');
    
    for(var i=0;i<li.length;i++){
        
        li[i].parentNode.removeChild(li[i]);
        
    }
    
    $('.left-menu .group-list ul').html($('.left-menu .group-list ul').html());
    
    initLeftMenu();
    
    
}

function initLabelListOnNewStudy(){
    
    DB.connect.transaction(function(c){

        c.executeSql('SELECT * FROM groups ORDER BY id DESC',[],function(c,res){

            var str = '';

            for(var i=0;i<res.rows.length;i++){

                str += '<option value="' + res.rows.item(i).id + '">' + res.rows.item(i).name + '</option>';

            }

            var container = '#idLabel';

            $(container).html(str);

        },function(c,err){

            console.log(err);

        });

    });  
    
}

function newGraph(res){
    
    var points = [];

    var ft;

    var sum = 0;

    var time = parseInt($('#showStats select[name="period"]').prop('value'));

    var flag = 1;

    var n = 1;

    var check = $('#average').prop('checked');

    var c = 0;

    var timebtns = {

        start: [],

        end: [],

        format: []

    };

    for(var i=0;i<res.rows.length;i++){

        flag = 0;

        if(sum == 0){

            sum = res.rows.item(i).value;

            ft = res.rows.item(i).timestamp;

            c++;

            continue;

        }

        if(ft - res.rows.item(i).timestamp <= time){

            sum += res.rows.item(i).value;

            c++;

        }else{

            if(check == true)
                sum = sum / c;

            c = 1;

            var p = [n++, sum, ft];

            points[points.length] = p;

            timebtns.start[timebtns.start.length] = ft;

            timebtns.end[timebtns.end.length] = res.rows.item(i - 1).timestamp;

            sum = res.rows.item(i).value;

            ft = res.rows.item(i).timestamp;

            flag = 1;

        }

    }

    if(flag == 0){

        if(check == true)
            sum = sum / c;

        c = 0;

        var p = [n, sum, ft];

        points[points.length] = p;

        timebtns.start[timebtns.start.length] = ft;

        timebtns.end[timebtns.end.length] = res.rows.item(i - 1).timestamp;

    }

    //            console.log(points);

    var max = 0;

    var formatDate = getFormatFromPeriod(time);

    for(var i=0;i<points.length;i++){

        if(points[i][1] > max)
            max = points[i][1];

        var time = getFormatDate(points[i][2],formatDate);

        points[i][3] = time;

        timebtns.format[timebtns.format.length] = time;

    }

    var height = parseInt($('#main-canvas').attr('height'));


    //            console.log(max);

    graph.sizeY = (height - height / 4) / max;

    if(points.length == 0){

        showNoRes();

    }else{

        hidNoRes();

    }

    graph.set([points]);

    graph.draw();

    genTimeBtn(timebtns,'#showStats .time-btn-container');

    $('#showStats .time-btn-container').css('width',$('#main-canvas').css('width'));
    
}

function reloadGraph(){

    DB.connect.transaction(function(c){
        
        var id_study = Nav.currentParam;

        c.executeSql("SELECT * FROM entry WHERE id_study=? ORDER BY timestamp DESC",[id_study],function(c,res){

            graph.clear();
            
            newGraph(res);

        }, function(c,err){

            console.log(err);

        });

    });
    
}


// vis/hid //

function showPage(page){

    $('#' + page).css({'display': 'block'});

    setTimeout(function(){ 

        $('#' + page).css('opacity', 1);

    },10);

}

function hiddenPage(){

    $('.page').css({'opacity': 0});

    Nav.hiddenAll();

}

//////





