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



// system funcs //

function inpFocus(){

    $('input[type="text"]').focus(function(){
        $(this).css('border-color', 'black');
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
