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

Funcs.do.openEditName = function(page){
    
    var p = $('#' + page + ' .form-edit');
    
    $(p).css({'display': 'block'});
    
    var val = $('#' + page ).find('.page-name').html();
    
    $(p).find('input').attr('value',val).focus().prop('selectionStart',val.length);
    
    setTimeout(function(){
        
        $(p).css({
            
            'opacity': 1,
            'height': '100%'
            
        });
        
    },1);
    
}

Funcs.do.closeEditName = function(page){

    var p = $('#' + page + ' .form-edit');
    
    $(p).css({

        'opacity': 0,
        'height': '10%'

    });

    $('#' + page ).find('.page-name').html($(p).find('input').attr('value'));

    setTimeout(function(){
        
        $(p).css({'display': 'none'});

    },200);

}

Funcs.do.saveEditName = function(page){
    
    var inp = $('#' + page + ' .form-edit').find('input');
    
    var val = $(inp).prop('value');
    
    if(val == ''){
        
        $(inp).parent().css('background-color', '#C62828');
        
        setTimeout(function(){
            
            $(inp).parent().css('background-color', '#1976D2');
            
        },2000);
        
        
    } else {
        
        var path = '#' + page + ' .page-name';
        
        setTimeout(function(){
            $(path).html(val);
        },10);
        
        var tabname = {
            
            'study': 'groups',
            'showStats': 'study'
            
        }
        
        var id = $(path).attr('data-id');
        
        DB.connect.transaction(function(c){
            
            c.executeSql("UPDATE " + tabname[page] + " SET name=? WHERE id=?",[val,id],null,function(c,err){
                
                console.log(err);
                
            });
            
        });
    
        Funcs.do.closeEditName(page);
        
    }
    
}


Funcs.do.showInput = function(p,t){
    
    showInput(t);

}









