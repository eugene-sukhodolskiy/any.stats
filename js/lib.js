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
    
    $(t).parent().find('.form-wrap.input').addClass('full').find('input',0).focus();
    
    var cv = $(t).parent().find('.current-value');
    
    if($(cv).attr('data-edit-flag') == 1){
        
        var val = $(cv).html();
        
        $(cv).parent().find('input',0).attr('value',val).prop('selectionStart',val.length);
        
    }
    
}

function hiddenInput(t){
    
    var fw = $(t).parent();
    
    $(fw).removeClass('full');
    
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

            var str = '';

            for(var i = 0; i < 10; i++){

                var time = getFormatDate(p.rows.item(i).timestamp);

                var split = time.split(' ');

                time = split[0] + '<span>' + split[1] + '</span>';
                
                str += '<div class="one-stat-wrap">';

                str += '<div class="form-group one-stat">';

                str += '<div class="form-wrap input">';

                str += '<input type="text" value="' + p.rows.item(i).value + '" placeholder="Value">';

                str += '</div>';

                str += '<div class="time">' + time + '</div>';

                str += '<div class="current-value" data-func="showInput" data-default="' + p.rows.item(i).value + '" data-unit="' + res.rows.item(0).unit + '">' + p.rows.item(i).value + '</div>';

                str += '<div class="del"></div> </div>';
                
                str += '<button class="one-stat-del"></button>';
                
                str += '</div>';

            }

            $(container).html(str);

            Funcs.init(container);

            addBlurToFormGroup(container);
            
            $(".one-stat").swipe({
                
                swipeStatus: function(event, d, direction, distance) {
                    
                    
                    if(d != 'end' && direction == "left" && distance < 50){
                    
                        $(this).css('left',(0 - distance) + 'px');
                        
                    }else if(d != 'end' && direction == "right" && distance >= 50){
                        
                        $(this).css('left',(0 - distance) + 'px');
                        
                    }
                    
                    if(d == 'end' && distance >= 50){
                        
                        $(this).css('left','-100px');
                        
                    }else if(d == 'end' && distance <= 50){
                        
                        $(this).css('left','0px');
                        
                    }
                    
                }
                
            });
            
            
//            $('.one-stat').swipeLeft(function(){
//                
//                console.log('swipe left');
//                
//            });
//            
//            $('.one-stat').swipeRight(function(){
//
//                console.log('swipe right');
//
//            });

        });
        
    });
    
}

function addBlurToFormGroup(container){
    
    container = container || '';
    
    $(container + ' .form-wrap.input input[type="text"]').blur(function(){

        hiddenInput(this);

    });
    
}

function getFormatDate(timestamp){
    
    var d = new Date(timestamp);

    var year = d.getFullYear();

    var month = d.getMonth();

    month = (month < 10) ? '0' + month : month;

    var day = d.getDate();

    day = (day < 10) ? '0' + day : day;

    var h = d.getHours();

    h = (h < 10) ? '0' + h : h;

    var m = d.getMinutes();
    
    m = (m < 10) ? '0' + m : m;
    
    
    var str = year + '/' + month + '/' + day + ' ';
    
    str += h + ':' + m;
    
    return str;
    
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





