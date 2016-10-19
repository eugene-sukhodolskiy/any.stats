function hQuestionDel(id,t,page){

    $(page + ' .container [data-flag="animation"]').css('opacity','1').removeAttr('data-flag');

    $(t).parent().parent().find('.name').removeAttr('style');

    var askDel = $(t).parent().parent().find('.askDel');

    $(askDel).css('opacity',0);

    setTimeout(function(){

        $(askDel).css('display','none');

    },200);

    $('.page .no-click').css('display','none');

    $(t).parent().parent().find('.nav-btn-del').css('opacity',1);

}

function sQuestionDel(id,t,page){

    $(page + ' .container .nav-btn').attr('data-flag','animation');

    $(t).parent().removeAttr('data-flag');

    $(page + ' .container [data-flag="animation"]').css('opacity','.5');

    $(t).parent().find('.name').css({'margin-top': '65px','opacity': '.6','font-size': '18px'});

    var askDel = $(t).parent().find('.askDel');

    $(askDel).css('display','block');

    setTimeout(function(){

        $(askDel).css('opacity',1);

    },1);

    $('.page .no-click').css('display','block');

    $(t).parent().find('.nav-btn-del').css('opacity',0);

}

function delFromHTML(id,page){
    
    var el = $('.page .no:visible',0);
    
    var str = (new String(page)).split('#')[1];
    
    var letter = (new String(str[0])).toUpperCase();
    
    str = str.split(str[0])[1];
    
    var funcname = 'hQuestionDel' + letter + str;


    Funcs.do[funcname](id,el,page);

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

function getCount(res,i){

    i = i || 0;

    DB.connect.transaction(function(c){

        c.executeSql('SELECT COUNT(*) FROM study WHERE id_group=?',[res.rows.item(i).id],function(c,r){


            var str = '(' + r.rows.item(0)['COUNT(*)'] + ')';

            $('#groups .nav-btn[data-param="'+res.rows.item(i++).id+'"] span.count').html(str);

            if(i < res.rows.length){

                getCount(res,i);

            }

        });

    });

}



// system funcs //

function inpFocus(){

    $('input[type="text"]').focus(function(){
        $(this).css('border-color', 'black');
    });

}

function showInput(t){
    
    $(t).parent().find('.form-wrap.input').css({'width': 'inherit','opacity': 1}).find('input',0).focus();
    
    var cv = $(t).parent().find('.current-value');
    
    if($(cv).attr('data-edit-flag') == 1){
        
        var val = $(cv).html();
        
        $(cv).parent().find('input',0).attr('value',val).prop('selectionStart',val.length);
        
    }
    
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
    
    $('#showStats .no-res').css('display','block');
    
}

function hidNoRes(){

    $("#showStats .canvas-container").removeAttr('style');

    $("#showStats .average").removeAttr('style');
    
    $("#showStats .unit").removeAttr('style');

    $('#showStats [name="period"]').removeAttr('style');

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

        str += '<div class="form-group one-stat">';

        str += '<div class="form-wrap input">';
        
        str += '<span class="counter"></span>';
                    
        str += '<input type="text" data-id="' + p.rows.item(i).id + '" value="' + p.rows.item(i).value + '" placeholder="Value" maxlength="10">';

        str += '</div>';

        str += '<div class="time">' + time + '</div>';

        str += '<div class="current-value" data-func="showInput" data-default="' + p.rows.item(i).value + '" data-unit="' + res.rows.item(0).unit + '">' + p.rows.item(i).value + '</div>';

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

        hiddenInput(this);
        
        var value = new String($(this).prop('value'));
        
        var id_entry = new String($(this).attr('data-id'));
        
        DB.connect.transaction(function(c){
            
            c.executeSql("UPDATE entry SET value=? WHERE id=?",[value,id_entry], function(c,res){
                
                console.log('UPDATE entry WHERE id='+id_entry);
                
            },function(c,err){
                
                console.log(err);
                
            })
            
        });

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
        
        str += '<button class="timestamp-btn" data-page="goToEntries" data-param="' + arr.start[i] + '-' + arr.end[i] + ' - ' + id_study + '">' + arr.format[i] + '</button>'
        
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





