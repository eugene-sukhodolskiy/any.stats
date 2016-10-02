var Funcs = {
    
    do: {},
    
    init: function(path){
        
        path = path || '';
        
        $(path+' [data-func]').click(function(){
            
            var funcname = $(this).attr('data-func');
            
            var param = $(this).attr('data-param');
            
            Funcs.do[funcname](param,this);
            
        });
        
    }
    
}


Funcs.do.saveNewGroup = function(param){
    
//    console.log('hell');
    
    var name = $('#groupName').prop('value');
    
    if(name == ''){
        
        $('#groupName').css('border-color','red');
        
        return false;
        
    }
    
    $('#groupName').prop('value','');

    DB.connect.transaction(function(connect){
        
        connect.executeSql("INSERT INTO groups (id,name,timestamp) VALUES (NULL,?,?)",[name,new Date().getTime()], function(res){
            
            Nav.back();
            
        },function(connect,err){
            
            console.log(err);
            
        });
        
    });
    
}

Funcs.do.showDelBtn = function(page){
    
    page = '#' + page;
    
    $(page + ' .container .nav-btn').css('background','#E53935').unbind();
    
    $('[data-page]').unbind();
        
    $(page + ' .nav-btn-del').css('display','block');
    
    setTimeout(function(){
        
        $(page + ' .nav-btn-del').css('opacity','1');
        
    },1);
    
    $(page + ' [data-func="showDelBtn"]').css('background-color','#ccc').attr('data-func','hiddenDelBtn');
    
}

Funcs.do.hiddenDelBtn = function(page){
    
    page = '#' + page;

    $(page + ' .container .nav-btn').css('background','#1E88E5');
    
    Nav.initPages();
    
    $(page + ' .nav-btn-del').css('opacity','0');

    setTimeout(function(){
        
        $(page + ' .nav-btn-del').css('display','none');

    },200);
    
    $(page + ' [data-func="hiddenDelBtn"]').css('background-color','#E0E0E0').attr('data-func','showDelBtn');
    
    var el = $('.page .no:visible',0);
    
    Funcs.do.hQuestionDelGroup(true,el);
    
}

Funcs.do.sQuestionDelGroup = function(id,t){
    
    $('#groups .container .nav-btn').attr('data-flag','animation');
    
    $(t).parent().removeAttr('data-flag');
    
    $('#groups .container [data-flag="animation"]').css('opacity','.5');
    
    $(t).parent().find('.name').css({'margin-top': '65px','opacity': '.6','font-size': '18px'});
    
    var askDel = $(t).parent().find('.askDel');
    
    $(askDel).css('display','block');
    
    setTimeout(function(){
        
        $(askDel).css('opacity',1);
        
    },1);
    
    $('.page .no-click').css('display','block');
    
    $(t).parent().find('.nav-btn-del').css('opacity',0);
    
}

Funcs.do.hQuestionDelGroup = function(id,t){

    $('#groups .container [data-flag="animation"]').css('opacity','1').removeAttr('data-flag');
    
    $(t).parent().parent().find('.name').removeAttr('style');

    var askDel = $(t).parent().parent().find('.askDel');

    $(askDel).css('opacity',0);

    setTimeout(function(){

        $(askDel).css('display','none');

    },200);
    
    $('.page .no-click').css('display','none');
    
    $(t).parent().parent().find('.nav-btn-del').css('opacity',1);

}

Funcs.do.delGroup = function(id){
    
    DB.connect.transaction(function(connect){

        connect.executeSql("DELETE FROM groups WHERE id=?",[id], function(res){

            var el = $('.page .no:visible',0);

            Funcs.do.hQuestionDelGroup(true,el);
            
            $('#groups .container [data-param="' + id + '"]').css('opacity','0');
            
            setTimeout(function(){
                
                $('#groups .container [data-param="' + id + '"]').css('display','none');
                
            },200);

        });

    });
    
}

Funcs.do.delStudy = function(id){
    
    DB.connect.transaction(function(connect){

        connect.executeSql("DELETE FROM study WHERE id=?",[id], function(res){

            Nav.reload();

        });

    });
    
}

Funcs.do.saveNewStudy = function(id){
    
    var name = $('#studyName').prop('value');
    
    var unit = $('#studyUnit').prop('value');
    
    var telegramNotif = ($('#telegramNotif').prop('checked')) ? 1 : 0;

    var emailNotif = ($('#emailNotif').prop('checked')) ? 1 : 0;
    
    var period = $('#periodicity').prop('value');
    
    if(name == ''){
        
        $('#studyName').css('border-color','red'); 
        
        return false;
        
    }
    
    if(unit == ''){

        $('#studyUnit').css('border-color','red'); 
        
        return false;

    }
    
    DB.connect.transaction(function(connect){
        
        connect.executeSql('INSERT INTO study (id_group,name,unit,telegramNotif,emailNotif,repiodicityNotif,timestamp) VALUES (?,?,?,?,?,?,?)',[id,name,unit,telegramNotif,emailNotif,period,new Date().getTime()],function(connect,res){
            
            Nav.back();
            
        },function(connect,err){
            
            console.log(err);
            
        });
        
    });
    
    
}

Funcs.do.saveStat = function(id){
    
    var amount = parseInt($('#amount').prop('value'));
    
    if(isNaN(amount)){
        
        $('#amount').css('border-color','red');
        
        return false;
        
    }
    
    DB.connect.transaction(function(connect){
        
        connect.executeSql("INSERT INTO entry (value,id_study,timestamp) VALUES (?,?,?)",[amount,id,new Date().getTime()], function(connect, res){
            
            Nav.back();
            
        }, function(connect, err){
            
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






