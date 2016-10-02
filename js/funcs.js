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
    
    
    var str = (new String(page)).split('#')[1];

    var letter = (new String(str[0])).toUpperCase();

    str = str.split(str[0])[1];
    
    var funcname = 'hQuestionDel' + letter + str;
    
    console.log(funcname);
    
    Funcs.do[funcname](true,el);
    
}

Funcs.do.sQuestionDelGroups = function(id,t){
    
    sQuestionDel(id,t,'#groups');
    
}

Funcs.do.hQuestionDelGroups = function(id,t){

    hQuestionDel(id,t,'#groups');

}

Funcs.do.sQuestionDelStudy = function(id,t){

    sQuestionDel(id,t,'#study');

}

Funcs.do.hQuestionDelStudy = function(id,t){

    hQuestionDel(id,t,'#study');

}


Funcs.do.delGroup = function(id){
    
    DB.connect.transaction(function(connect){

        connect.executeSql("SELECT id FROM study WHERE id_group=?",[id], function(c,res){
            
            for(var i=0;i<res.rows.length;i++){
                
                studyDelFromDB(res.rows.item(i).id);
                
            }
            
            
            c.executeSql("DELETE FROM groups WHERE id=?",[id],function(c,res){
                
                delFromHTML(id,'#groups');
                
            });

        }, function(c,err){
            
            console.log(err);
            
        });

    });
    
}

Funcs.do.delStudy = function(id){
    
    studyDelFromDB(id);
    
    delFromHTML(id,'#study');
    
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









